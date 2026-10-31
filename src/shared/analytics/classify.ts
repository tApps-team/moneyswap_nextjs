/**
 * Разбор адреса страницы сайта: какой это тип страницы, раздел и запись.
 *
 * Классифицирует сервер при приёме событий — так отчёты не зависят от того,
 * что прислал браузер, а правило одно на всех. Файл без зависимостей:
 * его импортируют и сборщик событий, и отчёты CMS.
 */

/**
 * Разделы статистики: рейтинги (совпадают с RatingSectionKey) и обменники.
 * У обменников «список» — их рейтинг, а основная витрина — страницы
 * направлений /exchange/…, они тоже относятся к этому разделу.
 */
export const STAT_SECTIONS = {
  // Списки ВЭД и виртуальных карт живут на главных разделов: /ved/agents и
  // /virtual-cards/cards — только редиректы туда, а карточки остаются глубже.
  ved: { title: "ВЭД", list: "/ved", detail: "/ved/agents/" },
  "virtual-cards": { title: "Виртуальные карты", list: "/virtual-cards", detail: "/virtual-cards/cards/" },
  esim: { title: "eSIM", list: "/esim", detail: "/esim/" },
  "payment-services": { title: "Оплата сервисов", list: "/payment-services", detail: "/payment-services/" },
  "debit-cards": { title: "Дебетовые карты", list: "/debit-cards", detail: "/debit-cards/" },
  "credit-cards": { title: "Кредитные карты", list: "/credit-cards", detail: "/credit-cards/" },
  credits: { title: "Кредиты", list: "/credits", detail: "/credits/" },
  microloans: { title: "Займы", list: "/microloans", detail: "/microloans/" },
  exchangers: { title: "Обменники", list: "/crypto-exchangers", detail: "/crypto-exchangers/" },
} as const;

export type StatSection = keyof typeof STAT_SECTIONS;
export const STAT_SECTION_KEYS = Object.keys(STAT_SECTIONS) as StatSection[];
export const isStatSection = (v: unknown): v is StatSection =>
  typeof v === "string" && Object.prototype.hasOwnProperty.call(STAT_SECTIONS, v);

/** Тип страницы — первый разрез почти всех отчётов. */
export type PageType =
  | "home"
  | "hub"
  | "section_main"
  | "section_list"
  | "agent"
  | "blog"
  | "article"
  | "blog_category"
  | "blog_tag"
  | "exchange"
  | "exchangers"
  | "exchanger"
  | "blacklist"
  | "info"
  | "other";

export const PAGE_TYPE_TITLES: Record<PageType, string> = {
  home: "Главная",
  hub: "Хаб направления",
  section_main: "Главная раздела",
  section_list: "Список рейтинга",
  agent: "Карточка агента",
  blog: "Блог",
  article: "Статья",
  blog_category: "Категория блога",
  blog_tag: "Тег блога",
  exchange: "Направление обмена",
  exchangers: "Список обменников",
  exchanger: "Обменник",
  blacklist: "Чёрный список",
  info: "Информационная",
  other: "Другое",
};

export interface PageInfo {
  pageType: PageType;
  section: StatSection | null;
  entity: string | null;
}

const HUBS = ["/crypto-services", "/abroad-services", "/cards-services"];
const INFO = ["/about", "/for-partners", "/help", "/contacts", "/terms", "/privacy", "/pricing-policy", "/sitemap", "/questions", "/blacklist-terms"];

/** Один сегмент slug после префикса: «/esim/airalo» → «airalo», «/esim/a/b» → null. */
function slugAfter(path: string, prefix: string): string | null {
  if (!path.startsWith(prefix)) return null;
  const rest = path.slice(prefix.length);
  return rest && !rest.includes("/") ? decodeURIComponent(rest) : null;
}

export function classifyPath(rawPath: string): PageInfo {
  const path = (rawPath.split(/[?#]/)[0] || "/").replace(/\/+$/, "") || "/";
  const page = (pageType: PageType, section: StatSection | null = null, entity: string | null = null): PageInfo => ({
    pageType,
    section,
    entity,
  });

  if (path === "/") return page("home");
  if (HUBS.includes(path)) return page("hub");

  // Старые адреса списков ведут редиректом на /ved и /virtual-cards.
  if (path === "/ved/agents") return page("section_list", "ved");
  if (path === "/virtual-cards/cards") return page("section_list", "virtual-cards");
  if (path === "/ved/exchange" || path.startsWith("/ved/exchange/")) return page("section_main", "ved", slugAfter(path, "/ved/exchange/"));

  // Направления обмена: «/exchange/BTC-to-CASHRUB» — витрина обменников.
  if (path === "/exchange" || path.startsWith("/exchange/")) {
    return page("exchange", "exchangers", path.slice("/exchange/".length).toLowerCase() || null);
  }

  for (const key of STAT_SECTION_KEYS) {
    const s = STAT_SECTIONS[key];
    if (path === s.list) return page("section_list", key);
    const slug = slugAfter(path, s.detail);
    // Страница обменника — «/crypto-exchangers/exchanger-1446», в статистике это просто 1446.
    if (slug) return page("agent", key, key === "exchangers" ? slug.replace(/^exchanger-/, "") : slug);
  }

  if (path === "/blog") return page("blog");
  const article = slugAfter(path, "/blog/article/");
  if (article) return page("article", null, article);
  const category = slugAfter(path, "/blog/category/");
  if (category) return page("blog_category", null, category);
  const tag = slugAfter(path, "/blog/tag/");
  if (tag) return page("blog_tag", null, tag);

  if (path === "/blacklist" || path.startsWith("/blacklist/")) return page("blacklist", null, slugAfter(path, "/blacklist/"));
  if (INFO.some((p) => path === p || path.startsWith(`${p}/`))) return page("info");
  return page("other");
}

/** Страница агента по ссылке: для кликов «Подробнее» из списков, хабов и похожих. */
export function agentFromHref(href: string): { section: StatSection; slug: string } | null {
  const info = classifyPath(href);
  return info.pageType === "agent" && info.section && info.entity ? { section: info.section, slug: info.entity } : null;
}

export interface DirectionInfo {
  /** Коды валют в нижнем регистре, как в адресе: «btc», «cashrub». */
  from: string;
  to: string;
  /** Код города для наличного обмена: «msk». */
  city: string | null;
  segment: "cash" | "noncash";
}

/** Пара валют и город из адреса направления: «/exchange/BTC-to-CASHRUB?city=msk». */
export function parseDirection(rawPath: string): DirectionInfo | null {
  const [pathname, query = ""] = rawPath.split("#")[0].split("?");
  const slug = pathname.replace(/\/+$/, "").match(/^\/exchange\/([^/]+)$/)?.[1];
  if (!slug) return null;
  const [from, to] = decodeURIComponent(slug).toLowerCase().split("-to-");
  if (!from || !to) return null;
  const params = new URLSearchParams(query);
  const city = params.get("city")?.toLowerCase().slice(0, 60) || null;
  const segment = city || params.get("direction") === "cash" || from.startsWith("cash") || to.startsWith("cash") ? "cash" : "noncash";
  return { from: from.slice(0, 40), to: to.slice(0, 40), city, segment };
}
