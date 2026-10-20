import { ClientEvent, CollectBatch } from "./events";

/**
 * Клиент собственной статистики. Копит события и отправляет пачками
 * на `/api/collect`: раз в несколько секунд и при уходе со страницы.
 *
 * Посетитель и визит анонимны: случайные id в localStorage, без IP, имён и
 * отпечатков браузера. Визит, как в Метрике, заканчивается после 30 минут
 * бездействия — так считаются уникальные и повторные клики.
 */

const ENDPOINT = "/api/collect";
const VISITOR_KEY = "ms_vid";
const SESSION_KEY = "ms_sid";
/** Ставит CMS при входе сотрудника (src/cms/ui/shell). */
export const STAFF_KEY = "ms_staff";
const SESSION_TTL = 30 * 60 * 1000;
const FLUSH_DELAY = 3000;
const MAX_BATCH = 40;

let queue: ClientEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let memoryVisitor: string | null = null;
let memorySession: { id: string; last: number } | null = null;

const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

/** localStorage может быть недоступен (приватный режим, запрет cookies) — тогда живём в памяти. */
function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function storageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* остаёмся на значении в памяти */
  }
}

function visitorId(): string {
  if (memoryVisitor) return memoryVisitor;
  memoryVisitor = storageGet(VISITOR_KEY) ?? uuid();
  storageSet(VISITOR_KEY, memoryVisitor);
  return memoryVisitor;
}

/** Id визита: общий для вкладок, продлевается любым событием. */
function sessionId(now: number): string {
  if (!memorySession) {
    try {
      const saved = JSON.parse(storageGet(SESSION_KEY) ?? "null");
      if (saved && typeof saved.id === "string" && typeof saved.last === "number") memorySession = saved;
    } catch {
      memorySession = null;
    }
  }
  if (!memorySession || now - memorySession.last > SESSION_TTL) memorySession = { id: uuid(), last: now };
  memorySession.last = now;
  storageSet(SESSION_KEY, JSON.stringify(memorySession));
  return memorySession.id;
}

/** Визит, к которому относятся события в очереди: фиксируем при постановке первого. */
let batchSession: string | null = null;

function send(events: ClientEvent[], sid: string) {
  const staff = storageGet(STAFF_KEY) === "1";
  const body = JSON.stringify({ vid: visitorId(), sid, ...(staff ? { st: 1 as const } : {}), events } satisfies CollectBatch);
  try {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.(ENDPOINT, blob)) return;
  } catch {
    /* ниже запасной вариант */
  }
  fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(
    () => {},
  );
}

export function flush() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (!queue.length || !batchSession) return;
  const events = queue;
  const sid = batchSession;
  queue = [];
  batchSession = null;
  for (let i = 0; i < events.length; i += MAX_BATCH) send(events.slice(i, i + MAX_BATCH), sid);
}

/** Поставить событие в очередь. Тихо ничего не делает на сервере и для ботов. */
export function track(event: Omit<ClientEvent, "ts" | "p"> & { p?: string }) {
  if (typeof window === "undefined" || navigator.webdriver) return;
  // Отладка на любом окружении: localStorage.ms_debug = "1" — события пишутся в консоль.
  if (storageGet("ms_debug") === "1") console.info("[ms-stats]", event.t, event);
  const now = Date.now();
  visitorId(); // id посетителя появляется с первым событием, а не с первой отправкой
  const sid = sessionId(now);
  // Визит сменился, пока события ждали отправки, — старые уходят своим пакетом.
  if (batchSession && batchSession !== sid) flush();
  batchSession = sid;
  queue.push({ ...event, ts: now, p: event.p ?? window.location.pathname + window.location.search });
  if (queue.length >= MAX_BATCH) flush();
  else if (!timer) timer = setTimeout(flush, FLUSH_DELAY);
}

/** Короткая строка для отчётов: без переносов и не длиннее limit. */
export const clip = (text: string | null | undefined, limit = 120) =>
  (text ?? "").replace(/\s+/g, " ").trim().slice(0, limit);

/**
 * Выбор в фильтре списка. Число результатов читаем чуть позже — когда
 * список перерисуется и обновит data-ms-total (см. listMark).
 */
export function trackFilter(name: string, value: string, action: "add" | "remove" | "reset") {
  if (typeof window === "undefined") return;
  const p = window.location.pathname + window.location.search;
  setTimeout(() => {
    const total = document.querySelector("[data-ms-list]")?.getAttribute("data-ms-total");
    track({ t: "filter", p, n: clip(name, 80), v: clip(value, 120), src: action, num: total == null ? undefined : Number(total) });
  }, 400);
}
