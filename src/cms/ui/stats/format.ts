import { PAGE_TYPE_TITLES, PageType, STAT_SECTIONS } from "@/shared/analytics/classify";

const intFmt = new Intl.NumberFormat("ru-RU");
const pctFmt = new Intl.NumberFormat("ru-RU", { style: "percent", maximumFractionDigits: 1 });
const decFmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

export const fmtInt = (v: number | null | undefined) => (v === null || v === undefined ? "—" : intFmt.format(Math.round(v)));
export const fmtDec = (v: number | null | undefined) => (v === null || v === undefined ? "—" : decFmt.format(v));
export const fmtPct = (v: number | null | undefined) => (v === null || v === undefined || !Number.isFinite(v) ? "—" : pctFmt.format(v));
export const share = (a: number, b: number) => (b > 0 ? a / b : null);

/** «1 мин 20 с», «45 с», «2 ч 5 мин». */
export function fmtDuration(ms: number | null | undefined): string {
  if (!ms || ms < 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} с`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} мин ${s % 60} с`;
  return `${Math.floor(m / 60)} ч ${m % 60} мин`;
}

const dateTimeFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Moscow",
});
const timeFmt = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Moscow" });
export const fmtDateTime = (iso: string) => dateTimeFmt.format(new Date(iso));
export const fmtTime = (iso: string) => timeFmt.format(new Date(iso));

const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
/** Подпись точки графика: «18 окт», «18 окт, 14:00» для почасового. */
export function fmtBucket(bucket: string, step: string): string {
  const [date, time] = bucket.split("T");
  const [, m, d] = date.split("-").map(Number);
  const label = `${d} ${MONTHS_SHORT[m - 1]}`;
  return step === "hour" ? `${label}, ${time}` : step === "week" ? `нед. с ${label}` : label;
}
/** «1 окт — 18 окт 2026». */
export function fmtRange(from: string, to: string): string {
  const one = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return { y, label: `${d} ${MONTHS_SHORT[m - 1]}` };
  };
  const a = one(from);
  const b = one(to);
  if (from === to) return `${a.label} ${a.y}`;
  return a.y === b.y ? `${a.label} — ${b.label} ${b.y}` : `${a.label} ${a.y} — ${b.label} ${b.y}`;
}

export const sectionTitle = (key: string | null | undefined) =>
  key ? (STAT_SECTIONS as Record<string, { title: string }>)[key]?.title ?? key : "—";
export const pageTypeTitle = (key: string | null | undefined) =>
  key ? PAGE_TYPE_TITLES[key as PageType] ?? key : "—";

export const SOURCE_TYPE_TITLES: Record<string, string> = {
  search: "Поисковые системы",
  social: "Соцсети и мессенджеры",
  direct: "Прямые заходы",
  referral: "Переходы с сайтов",
  utm: "Реклама и рассылки (UTM)",
};
export const DEVICE_TITLES: Record<string, string> = { desktop: "Компьютер", mobile: "Смартфон", tablet: "Планшет" };

/** Где был клик по агенту. */
export const CLICK_SOURCE_TITLES: Record<string, string> = {
  list: "Список рейтинга",
  detail: "Карточка агента",
  promo: "Промокод на карточке",
  similar: "Похожие на карточке",
  hub: "Хаб направления",
  home: "Главная",
  blog: "Блог",
  other: "Другое",
};

/** Цели Метрики из обменной части. */
export const GOAL_TITLES: Record<string, string> = {
  select_type_cashless_pc: "Выбор: безналичный обмен",
  select_type_cash_pc: "Выбор: наличный обмен",
  cashless_give_pc: "Безнал: выбрали «Отдаю»",
  cashless_receive_pc: "Безнал: выбрали «Получаю»",
  cash_country_select_pc: "Наличные: выбрали страну",
  cash_give_pc: "Наличные: выбрали «Отдаю»",
  cash_receive_pc: "Наличные: выбрали «Получаю»",
  exchange_redirect_pc: "Переход в обменник",
  reviews_open_pc: "Открыли отзывы",
  review_add_pc: "Добавили отзыв",
};

export const SORT_TITLES: Record<string, string> = {
  commission: "Комиссия",
  limitFrom: "Лимит",
  rating: "Рейтинг",
  reset: "Сброс сортировки",
};

export const EVENT_TITLES: Record<string, string> = {
  page_view: "Просмотр страницы",
  page_leave: "Ушёл со страницы",
  impression: "Показ карточки",
  detail_click: "Клик «Подробнее»",
  outbound_click: "Переход к агенту",
  external_click: "Внешняя ссылка",
  filter: "Фильтр",
  sort: "Сортировка",
  paginate: "Страница списка",
  goal: "Цель",
};

/** Изменение к прошлому периоду: +12% / −5%. */
export function delta(current: number, previous: number): { text: string; tone: "up" | "down" | "flat" } | null {
  if (!previous && !current) return null;
  if (!previous) return { text: "новое", tone: "up" };
  const d = (current - previous) / previous;
  if (Math.abs(d) < 0.005) return { text: "0%", tone: "flat" };
  return { text: `${d > 0 ? "+" : "−"}${decFmt.format(Math.abs(d) * 100)}%`, tone: d > 0 ? "up" : "down" };
}
