"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { agentFromHref, classifyPath, clip, ClickSource, flush, getPageAgent, track } from "@/shared/analytics";

/** Карточка считается показанной, если половина её была на экране хотя бы столько. */
const IMPRESSION_MS = 600;

/** Источник по умолчанию — по типу страницы, на которой стоит карточка. */
function defaultSource(path: string): ClickSource {
  switch (classifyPath(path).pageType) {
    case "section_list":
    case "section_main":
    case "exchange":
      return "list";
    case "hub":
      return "hub";
    case "home":
      return "home";
    case "agent":
      return "similar";
    case "article":
    case "blog":
      return "blog";
    default:
      return "other";
  }
}

const isVisible = (el: Element) => el.getClientRects().length > 0;

/** Позиция карточки среди видимых в её списке, с учётом страницы пагинации. */
function positionOf(card: Element): number | undefined {
  const list = card.closest("[data-ms-list]");
  const scope = list ?? document;
  const items = Array.from(scope.querySelectorAll("[data-ms-agent]")).filter(isVisible);
  const index = items.indexOf(card);
  if (index < 0) return undefined;
  return index + 1 + Number(list?.getAttribute("data-ms-offset") ?? 0);
}

function cardContext(card: Element) {
  const [section, ...rest] = (card.getAttribute("data-ms-agent") ?? "").split(":");
  return {
    s: section,
    e: rest.join(":"),
    n: card.getAttribute("data-ms-name") ?? undefined,
    src: card.getAttribute("data-ms-src") ?? defaultSource(window.location.pathname),
    pos: positionOf(card),
  };
}

/** Что написано на ссылке: «Подробнее», «Перейти», название; у логотипа — «логотип». */
function linkLabel(a: HTMLAnchorElement) {
  // Вся карточка — одна ссылка (главная, хабы): её текст — всё содержимое карточки.
  if (a.hasAttribute("data-ms-agent")) return "карточка целиком";
  const text = clip(a.innerText || a.getAttribute("aria-label") || a.title, 60);
  if (!text) return a.querySelector("img") ? "логотип" : "ссылка";
  return text.length > 40 ? "блок карточки" : text;
}

const randomId = () => Math.random().toString(36).slice(2, 12);

let lastView = { path: "", at: 0, id: "" };

interface PageViewState {
  id: string;
  path: string;
  visibleSince: number | null;
  visibleMs: number;
  maxScroll: number;
  /** Прокрутка, уже отправленная прошлым приращением. */
  sentScroll: number;
}

/** Время на странице: только пока вкладка видима. Отправляем приращение с прошлой отправки. */
function leave(current: PageViewState) {
  if (current.visibleSince !== null) {
    current.visibleMs += Date.now() - current.visibleSince;
    current.visibleSince = null;
  }
  if (current.visibleMs < 300 && current.maxScroll <= current.sentScroll) return;
  track({ t: "page_leave", p: current.path, v: current.id, num: Math.round(current.visibleMs), num2: current.maxScroll });
  current.visibleMs = 0;
  current.sentScroll = current.maxScroll;
}

/** Пульс раз в 15 секунд: время и прокрутка не теряются, даже если вкладку убили без pagehide. */
const HEARTBEAT_MS = 15_000;

/**
 * Сбор собственной статистики сайта — один компонент на весь layout.
 *
 * Клики, показы и время на странице собираются делегированием и наблюдателями,
 * поэтому кнопкам не нужны свои обработчики: достаточно разметить карточки
 * через `agentMark` (src/shared/analytics/marks.ts).
 */
export function SiteTracker() {
  const pathname = usePathname();
  const view = useRef<PageViewState | null>(null);
  const seen = useRef(new Set<string>());

  // ===== Просмотр страницы и уход с неё =====
  useEffect(() => {
    const path = window.location.pathname + window.location.search;
    // Повтор эффекта в StrictMode — тот же просмотр: его id уже ушёл с page_view.
    const repeat = lastView.path === path && Date.now() - lastView.at < 1500;
    const current: PageViewState = {
      id: repeat ? lastView.id : randomId(),
      path,
      visibleSince: document.visibilityState === "visible" ? Date.now() : null,
      visibleMs: 0,
      maxScroll: 0,
      sentScroll: 0,
    };
    view.current = current;
    seen.current = new Set();

    // Заголовок App Router обновляет чуть позже смены адреса — ждём его.
    let sent = false;
    const sendView = () => {
      if (sent) return;
      sent = true;
      // Тот же адрес второй раз подряд за секунду — повтор эффекта (StrictMode), не новый просмотр.
      if (lastView.path === path && Date.now() - lastView.at < 1500) return;
      lastView = { path, at: Date.now(), id: current.id };
      const agent = getPageAgent();
      const pageAgent = agent && classifyPath(path).entity === agent.slug ? agent : null;
      track({
        t: "page_view",
        p: path,
        v: current.id,
        n: clip(pageAgent?.name ?? document.title, 200),
        ...(document.referrer && !document.referrer.startsWith(window.location.origin) ? { src: clip(document.referrer, 300) } : {}),
      });
    };
    const titleTimer = setTimeout(sendView, 400);

    return () => {
      clearTimeout(titleTimer);
      sendView();
      leave(current);
    };
    // Новый просмотр — только при смене пути; query-фильтры на месте — не переход
  }, [pathname]);

  useEffect(() => {
    const onVisibility = () => {
      const current = view.current;
      if (!current) return;
      if (document.visibilityState === "hidden") {
        leave(current);
        flush();
      } else if (current.visibleSince === null) {
        current.visibleSince = Date.now();
      }
    };
    const onPageHide = () => {
      if (view.current) leave(view.current);
      flush();
    };
    const onScroll = () => {
      const current = view.current;
      if (!current) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / max) * 100));
      if (pct > current.maxScroll) current.maxScroll = pct;
    };
    const heartbeat = setInterval(() => {
      const current = view.current;
      if (!current || document.visibilityState !== "visible") return;
      leave(current);
      current.visibleSince = Date.now();
    }, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(heartbeat);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ===== Клики: «Подробнее», «Перейти», промокоды, внешние ссылки =====
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      const a = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol)) return;
      const card = a.closest("[data-ms-agent]");
      const ctx = card ? cardContext(card) : null;

      if (url.origin === window.location.origin) {
        const target = agentFromHref(url.pathname);
        if (!target) return;
        const sameCard = ctx && ctx.s === target.section && ctx.e === target.slug;
        track({
          t: "detail_click",
          s: target.section,
          e: target.slug,
          n: sameCard ? ctx.n : undefined,
          src: ctx?.src ?? defaultSource(window.location.pathname),
          pos: sameCard ? ctx.pos : undefined,
          v: linkLabel(a),
        });
        return;
      }

      // Ниже — уход на другой сайт: отправляем очередь сразу, не дожидаясь таймера.
      const href = clip(url.host + url.pathname, 200);
      queueMicrotask(flush);
      if (ctx) {
        track({ t: "outbound_click", s: ctx.s, e: ctx.e, n: ctx.n, src: ctx.src, pos: ctx.pos, v: href });
        return;
      }
      // На карточке агента переход к нему — только кнопки AgentSiteLink (сайт и промокоды).
      // Прочие внешние ссылки страницы (соцсети, источники) — просто внешние клики.
      const pageAgent = getPageAgent();
      const info = classifyPath(window.location.pathname);
      const cta = a.closest("[data-ms-cta]")?.getAttribute("data-ms-cta");
      if (cta && pageAgent && info.pageType === "agent" && info.entity === pageAgent.slug) {
        track({
          t: "outbound_click",
          s: pageAgent.section,
          e: pageAgent.slug,
          n: pageAgent.name,
          src: cta === "promo" ? "promo" : "detail",
          v: href,
        });
        return;
      }
      track({ t: "external_click", v: href, n: linkLabel(a) });
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  // ===== Показы карточек =====
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          if (entry.isIntersecting) {
            if (timers.has(el)) continue;
            timers.set(
              el,
              setTimeout(() => {
                timers.delete(el);
                if (!el.isConnected || !isVisible(el)) return;
                const ctx = cardContext(el);
                // Один показ агента на просмотр страницы и место: повторная прокрутка — не новый показ.
                const key = `${ctx.s}:${ctx.e}:${ctx.src}`;
                if (seen.current.has(key)) return;
                seen.current.add(key);
                track({ t: "impression", ...ctx });
              }, IMPRESSION_MS),
            );
          } else {
            const t = timers.get(el);
            if (t) clearTimeout(t);
            timers.delete(el);
          }
        }
      },
      { threshold: 0.5 },
    );
    const observed = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("[data-ms-agent]").forEach((el) => {
        if (observed.has(el)) return;
        observed.add(el);
        io.observe(el);
      });
    };
    scan();
    // Карточки появляются при навигации, пагинации и фильтрах — следим за DOM.
    let pending = false;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return null;
}
