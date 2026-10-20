import { isStatSection, StatSection } from "@/shared/analytics/classify";

/** Часовой пояс отчётов: сутки и часы считаются по Москве. */
export const STATS_TZ = "Europe/Moscow";

export type SourceType = "search" | "social" | "direct" | "referral" | "utm";
export const SOURCE_TYPES: SourceType[] = ["search", "social", "direct", "referral", "utm"];

/** Тип источника визита — по UTM и referrer первого просмотра. */
export const SOURCE_TYPE_SQL = (alias: string) => `case
  when ${alias}.utm_source is not null then 'utm'
  when ${alias}.referrer_host is null then 'direct'
  when ${alias}.referrer_host ~* '(^|\\.)(yandex|ya|google|bing|mail|go\\.mail|duckduckgo|yahoo|rambler)\\.' then 'search'
  when ${alias}.referrer_host ~* '(^|\\.)(t\\.me|telegram|web\\.telegram|vk\\.com|vk\\.ru|m\\.vk\\.com|ok\\.ru|instagram|facebook|twitter|x\\.com|youtube|dzen|vc\\.ru|pikabu|tiktok|whatsapp|reddit|habr)' then 'social'
  else 'referral' end`;

/** Параметры, общие для всех отчётов. */
export interface StatsFilters {
  from: string;
  to: string;
  device: string | null;
  sourceType: SourceType | null;
  section: StatSection | null;
  includeStaff: boolean;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: STATS_TZ }).format(new Date());
const shiftDate = (date: string, days: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
export const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000) + 1;

export function parseFilters(params: URLSearchParams): StatsFilters {
  let to = params.get("to") ?? "";
  let from = params.get("from") ?? "";
  if (!DATE.test(to)) to = today();
  if (!DATE.test(from)) from = shiftDate(to, -29);
  if (from > to) [from, to] = [to, from];
  // Больше двух лет за раз не считаем — защита от случайно тяжёлых запросов.
  if (daysBetween(from, to) > 731) from = shiftDate(to, -730);
  const device = params.get("device");
  const sourceType = params.get("source") as SourceType | null;
  const section = params.get("section");
  return {
    from,
    to,
    device: device && ["desktop", "mobile", "tablet"].includes(device) ? device : null,
    sourceType: sourceType && SOURCE_TYPES.includes(sourceType) ? sourceType : null,
    section: isStatSection(section) ? section : null,
    includeStaff: params.get("staff") === "1",
  };
}

/** Тот же по длине период непосредственно перед выбранным — для сравнения. */
export function previousPeriod(f: StatsFilters): StatsFilters {
  const days = daysBetween(f.from, f.to);
  return { ...f, from: shiftDate(f.from, -days), to: shiftDate(f.from, -1) };
}

/** Сборщик SQL с нумерованными параметрами. */
export class Sql {
  params: unknown[] = [];
  p(value: unknown): string {
    this.params.push(value);
    return `$${this.params.length}`;
  }
}

/**
 * Условие «событие попадает в отчёт»: период, сотрудники, устройство и
 * тип источника визита. `alias` — псевдоним таблицы ms_events в запросе.
 */
export function eventScope(q: Sql, f: StatsFilters, alias = "e", opts: { section?: boolean } = {}): string {
  const tz = q.p(STATS_TZ);
  const parts = [
    `${alias}.ts >= (${q.p(f.from)}::date)::timestamp at time zone ${tz}`,
    `${alias}.ts < (${q.p(f.to)}::date + 1)::timestamp at time zone ${tz}`,
  ];
  if (!f.includeStaff) parts.push(`not ${alias}.is_staff`);
  if (f.device) parts.push(`${alias}.device = ${q.p(f.device)}`);
  if (f.sourceType) {
    // Источник — свойство визита: берём визиты, первый просмотр которых пришёл из него.
    parts.push(`${alias}.session_id in (
      select s.session_id from (
        select distinct on (session_id) session_id, referrer_host, utm_source
        from ms_events where type = 'page_view' and ts >= ((${q.p(f.from)}::date) - 1)::timestamp at time zone ${tz}
          and ts < (${q.p(f.to)}::date + 1)::timestamp at time zone ${tz}
        order by session_id, ts
      ) s where ${SOURCE_TYPE_SQL("s")} = ${q.p(f.sourceType)}
    )`);
  }
  if (opts.section && f.section) {
    parts.push(`coalesce(${alias}.section, ${alias}.page_section) = ${q.p(f.section)}`);
  }
  return parts.join(" and ");
}

/** Шаг графика: часы для 1–2 дней, недели для длинных периодов, иначе дни. */
export function granularity(f: StatsFilters): "hour" | "day" | "week" {
  const days = daysBetween(f.from, f.to);
  if (days <= 2) return "hour";
  if (days > 120) return "week";
  return "day";
}

export const num = (v: unknown) => (v === null || v === undefined ? 0 : Number(v));
export const ratio = (a: number, b: number) => (b > 0 ? a / b : null);
