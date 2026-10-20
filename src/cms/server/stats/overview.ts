import { STAT_SECTION_KEYS } from "@/shared/analytics/classify";
import { eventScope, granularity, num, previousPeriod, SOURCE_TYPE_SQL, Sql, STATS_TZ, StatsFilters } from "./query";
import { entityNames, run } from "./run";

export interface Kpis {
  visitors: number;
  newVisitors: number;
  sessions: number;
  pageviews: number;
  avgSessionMs: number;
  bounces: number;
  impressions: number;
  detail: number;
  detailUnique: number;
  agentViews: number;
  outbound: number;
  outboundUnique: number;
  outboundSessions: number;
}

/** Ключевые показатели периода. Уникальные клики — как в Метрике: разные посетители по агенту. */
export async function kpis(f: StatsFilters): Promise<Kpis> {
  const q = new Sql();
  const scope = eventScope(q, f, "e", { section: true });
  const start = `(${q.p(f.from)}::date)::timestamp at time zone ${q.p(STATS_TZ)}`;
  const [r] = await run(
    q,
    `with ev as (select * from ms_events e where ${scope}),
     sess as (
       select session_id,
         count(*) filter (where type = 'page_view') as views,
         count(*) filter (where type in ('detail_click','outbound_click','external_click','filter','sort','paginate','goal')) as actions,
         coalesce(sum(num) filter (where type = 'page_leave'), 0) as dur,
         bool_or(type = 'outbound_click') as converted
       from ev group by session_id
     ),
     firsts as (
       select visitor_id, min(ts) as first_ts from ms_events
       where visitor_id in (select distinct visitor_id from ev) group by visitor_id
     )
     select
       (select count(distinct visitor_id) from ev) as visitors,
       (select count(*) from firsts where first_ts >= ${start}) as new_visitors,
       (select count(*) from sess where views > 0) as sessions,
       (select count(*) from ev where type = 'page_view') as pageviews,
       (select avg(dur) from sess where views > 0) as avg_dur,
       (select count(*) from sess where views = 1 and actions = 0 and dur < 15000) as bounces,
       (select count(*) from ev where type = 'impression') as impressions,
       (select count(*) from ev where type = 'detail_click') as detail,
       (select count(distinct (visitor_id, section, entity)) from ev where type = 'detail_click') as detail_unique,
       (select count(*) from ev where type = 'page_view' and page_type = 'agent') as agent_views,
       (select count(*) from ev where type = 'outbound_click') as outbound,
       (select count(distinct (visitor_id, section, entity)) from ev where type = 'outbound_click') as outbound_unique,
       (select count(*) from sess where converted) as outbound_sessions`,
  );
  return {
    visitors: num(r.visitors),
    newVisitors: num(r.new_visitors),
    sessions: num(r.sessions),
    pageviews: num(r.pageviews),
    avgSessionMs: num(r.avg_dur),
    bounces: num(r.bounces),
    impressions: num(r.impressions),
    detail: num(r.detail),
    detailUnique: num(r.detail_unique),
    agentViews: num(r.agent_views),
    outbound: num(r.outbound),
    outboundUnique: num(r.outbound_unique),
    outboundSessions: num(r.outbound_sessions),
  };
}

export interface SeriesPoint {
  bucket: string;
  visitors: number;
  sessions: number;
  pageviews: number;
  impressions: number;
  detail: number;
  outbound: number;
  outboundUnique: number;
}

/** Динамика по часам/дням/неделям, пустые промежутки — нулями. */
export async function series(f: StatsFilters, extra?: (q: Sql) => string): Promise<{ step: string; points: SeriesPoint[] }> {
  const step = granularity(f);
  const q = new Sql();
  const scope = eventScope(q, f, "e", { section: true });
  const tz = q.p(STATS_TZ);
  const g = q.p(step);
  const more = extra ? ` and ${extra(q)}` : "";
  const rows = await run(
    q,
    `with b as (
       select generate_series(
         date_trunc(${g}, (${q.p(f.from)}::date)::timestamp),
         date_trunc(${g}, (${q.p(f.to)}::date + 1)::timestamp - interval '1 second'),
         ('1 ' || ${g})::interval
       ) as bucket
     ),
     x as (
       select date_trunc(${g}, e.ts at time zone ${tz}) as bucket,
         count(distinct visitor_id) as visitors,
         count(distinct session_id) filter (where type = 'page_view') as sessions,
         count(*) filter (where type = 'page_view') as pageviews,
         count(*) filter (where type = 'impression') as impressions,
         count(*) filter (where type = 'detail_click') as detail,
         count(*) filter (where type = 'outbound_click') as outbound,
         count(distinct (visitor_id, section, entity)) filter (where type = 'outbound_click') as outbound_unique
       from ms_events e where ${scope}${more} group by 1
     )
     select to_char(b.bucket, 'YYYY-MM-DD"T"HH24:MI') as bucket, x.visitors, x.sessions, x.pageviews,
       x.impressions, x.detail, x.outbound, x.outbound_unique
     from b left join x using (bucket) order by b.bucket`,
  );
  return {
    step,
    points: rows.map((r) => ({
      bucket: String(r.bucket),
      visitors: num(r.visitors),
      sessions: num(r.sessions),
      pageviews: num(r.pageviews),
      impressions: num(r.impressions),
      detail: num(r.detail),
      outbound: num(r.outbound),
      outboundUnique: num(r.outbound_unique),
    })),
  };
}

/** Разделы-рейтинги: посещаемость списка, показы, клики, переходы. */
export async function sectionsBreakdown(f: StatsFilters) {
  const q = new Sql();
  const scope = eventScope(q, f);
  const rows = await run(
    q,
    `select coalesce(section, page_section) as section,
       count(distinct session_id) filter (where type = 'page_view') as sessions,
       count(*) filter (where type = 'page_view' and page_type in ('section_list','section_main')) as list_views,
       count(*) filter (where type = 'page_view' and page_type = 'agent') as agent_views,
       count(*) filter (where type = 'impression') as impressions,
       count(*) filter (where type = 'detail_click') as detail,
       count(*) filter (where type = 'outbound_click') as outbound,
       count(distinct (visitor_id, entity)) filter (where type = 'outbound_click') as outbound_unique,
       count(*) filter (where type = 'filter' and source = 'add') as filters
     from ms_events e
     where ${scope} and coalesce(section, page_section) is not null
     group by 1`,
  );
  const map = new Map(rows.map((r) => [String(r.section), r]));
  return STAT_SECTION_KEYS.map((key) => {
    const r = map.get(key) ?? {};
    return {
      section: key,
      sessions: num(r.sessions),
      listViews: num(r.list_views),
      agentViews: num(r.agent_views),
      impressions: num(r.impressions),
      detail: num(r.detail),
      outbound: num(r.outbound),
      outboundUnique: num(r.outbound_unique),
      filters: num(r.filters),
    };
  });
}

/** Визиты по источникам: тип, площадка, конверсия в переход к агенту. */
export async function sourcesBreakdown(f: StatsFilters, by: "type" | "host" | "utm" = "type", limit = 100) {
  const q = new Sql();
  const scope = eventScope(q, f, "e", { section: true });
  const key =
    by === "type"
      ? `${SOURCE_TYPE_SQL("s")}`
      : by === "host"
        ? `coalesce(s.referrer_host, '')`
        : `concat_ws(' / ', coalesce(s.utm_source, '—'), coalesce(s.utm_medium, '—'), coalesce(s.utm_campaign, '—'))`;
  const where = by === "utm" ? "where s.utm_source is not null" : by === "host" ? "where s.referrer_host is not null" : "";
  const rows = await run(
    q,
    `with ev as (select * from ms_events e where ${scope}),
     s as (
       select distinct on (session_id) session_id, visitor_id, referrer_host, utm_source, utm_medium, utm_campaign
       from ev where type = 'page_view' order by session_id, ts
     ),
     m as (
       select session_id,
         count(*) filter (where type = 'page_view') as views,
         count(*) filter (where type = 'outbound_click') as outbound,
         coalesce(sum(num) filter (where type = 'page_leave'), 0) as dur
       from ev group by session_id
     )
     select ${key} as key,
       count(*) as sessions,
       count(distinct s.visitor_id) as visitors,
       sum(m.views) as pageviews,
       avg(m.dur) as avg_dur,
       count(*) filter (where m.outbound > 0) as converted,
       sum(m.outbound) as outbound
     from s join m using (session_id) ${where}
     group by 1 order by sessions desc limit ${q.p(limit)}`,
  );
  return rows.map((r) => ({
    key: String(r.key),
    sessions: num(r.sessions),
    visitors: num(r.visitors),
    pageviews: num(r.pageviews),
    avgSessionMs: num(r.avg_dur),
    converted: num(r.converted),
    outbound: num(r.outbound),
  }));
}

/** Визиты по устройствам, ОС или браузерам. */
export async function devicesBreakdown(f: StatsFilters, by: "device" | "os" | "browser" = "device") {
  const q = new Sql();
  const scope = eventScope(q, f, "e", { section: true });
  const rows = await run(
    q,
    `select coalesce(${by}, '—') as key, count(distinct session_id) as sessions, count(distinct visitor_id) as visitors,
       count(*) filter (where type = 'outbound_click') as outbound
     from ms_events e where ${scope} group by 1 order by sessions desc`,
  );
  return rows.map((r) => ({ key: String(r.key), sessions: num(r.sessions), visitors: num(r.visitors), outbound: num(r.outbound) }));
}

/** Лидеры по переходам — для обзора. */
export async function topAgents(f: StatsFilters, limit = 10) {
  const q = new Sql();
  const scope = eventScope(q, f, "e", { section: true });
  const rows = await run(
    q,
    `select section, entity,
       count(*) filter (where type = 'outbound_click') as outbound,
       count(distinct visitor_id) filter (where type = 'outbound_click') as outbound_unique,
       count(*) filter (where type = 'detail_click') as detail
     from ms_events e where ${scope} and entity is not null and type in ('outbound_click','detail_click')
     group by 1, 2 order by outbound desc, detail desc limit ${q.p(limit)}`,
  );
  const names = await entityNames(Array.from(new Set(rows.map((r) => String(r.section)))));
  return rows.map((r) => ({
    section: String(r.section),
    slug: String(r.entity),
    name: names.get(`${r.section}:${r.entity}`) ?? String(r.entity),
    outbound: num(r.outbound),
    outboundUnique: num(r.outbound_unique),
    detail: num(r.detail),
  }));
}

export async function overview(f: StatsFilters) {
  const [current, previous, chart, previousChart, sections, sources, devices, agents] = await Promise.all([
    kpis(f),
    kpis(previousPeriod(f)),
    series(f),
    series(previousPeriod(f)),
    sectionsBreakdown(f),
    sourcesBreakdown(f, "type"),
    devicesBreakdown(f),
    topAgents(f),
  ]);
  return {
    kpis: current,
    previous,
    previousRange: { from: previousPeriod(f).from, to: previousPeriod(f).to },
    series: chart,
    previousSeries: previousChart,
    sections,
    sources,
    devices,
    agents,
  };
}
