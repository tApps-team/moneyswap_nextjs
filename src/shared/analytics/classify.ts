/**
 * Разбор адреса страницы сайта: какой это тип страницы, раздел и запись.
 *
 * Классифицирует сервер при приёме событий — так отчёты не зависят от того,
 * что прислал браузер, а правило одно на всех. Файл без зависимостей:
 * его импортируют и сборщик событий, и отчёты CMS.
 */

/** Разделы-рейтинги — совпадают с RatingSectionKey. */
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

  for (const key of STAT_SECTION_KEYS) {
    const s = STAT_SECTIONS[key];
    if (path === s.list) return page("section_list", key);
    const slug = slugAfter(path, s.detail);
    if (slug) return page("agent", key, slug);
  }

  if (path === "/blog") return page("blog");
  const article = slugAfter(path, "/blog/article/");
  if (article) return page("article", null, article);
  const category = slugAfter(path, "/blog/category/");
  if (category) return page("blog_category", null, category);
  const tag = slugAfter(path, "/blog/tag/");
  if (tag) return page("blog_tag", null, tag);

  if (path === "/exchange" || path.startsWith("/exchange/")) return page("exchange", null, path.slice("/exchange/".length) || null);
  if (path === "/crypto-exchangers") return page("exchangers");
  const exchanger = slugAfter(path, "/crypto-exchangers/");
  if (exchanger) return page("exchanger", null, exchanger.replace(/^exchanger-/, ""));
  if (path === "/blacklist" || path.startsWith("/blacklist/")) return page("blacklist", null, slugAfter(path, "/blacklist/"));
  if (INFO.some((p) => path === p || path.startsWith(`${p}/`))) return page("info");
  return page("other");
}

/** Страница агента по ссылке: для кликов «Подробнее» из списков, хабов и похожих. */
export function agentFromHref(href: string): { section: StatSection; slug: string } | null {
  const info = classifyPath(href);
  return info.pageType === "agent" && info.section && info.entity ? { section: info.section, slug: info.entity } : null;
}
