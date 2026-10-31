import { series } from "./overview";
import { eventScope, num, previousPeriod, Sql, StatsFilters } from "./query";
import { entityNames, run } from "./run";

/** Сводка обменной части: направления, переходы к обменникам, конверсия. */
async function exchangeKpis(f: StatsFilters) {
  const q = new Sql();
  const scope = eventScope(q, f);
  const [r] = await run(
    q,
    `with ev as (select * from ms_events e where ${scope}),
     dir as (select distinct session_id from ev where type = 'page_view' and page_type = 'exchange' and valute_from is not null)
     select
       (select count(*) from ev where type = 'page_view' and page_type = 'exchange' and valute_from is not null) as direction_views,
       (select count(distinct visitor_id) from ev where type = 'page_view' and page_type = 'exchange' and valute_from is not null) as direction_visitors,
       (select count(*) from dir) as direction_sessions,
       (select count(distinct (valute_from, valute_to, coalesce(city, ''))) from ev where type = 'page_view' and valute_from is not null) as directions,
       (select count(*) from ev where type = 'page_view' and page_type = 'agent' and page_section = 'exchangers') as exchanger_views,
       (select count(*) from ev where type = 'impression' and section = 'exchangers') as impressions,
       (select count(*) from ev where type = 'outbound_click' and section = 'exchangers') as outbound,
       (select count(distinct (visitor_id, entity)) from ev where type = 'outbound_click' and section = 'exchangers') as outbound_unique,
       (select count(distinct session_id) from ev where type = 'outbound_click' and section = 'exchangers' and session_id in (select session_id from dir)) as converted_sessions`,
  );
  return {
    directionViews: num(r.direction_views),
    directionVisitors: num(r.direction_visitors),
    directionSessions: num(r.direction_sessions),
    directions: num(r.directions),
    exchangerViews: num(r.exchanger_views),
    impressions: num(r.impressions),
    outbound: num(r.outbound),
    outboundUnique: num(r.outbound_unique),
    convertedSessions: num(r.converted_sessions),
  };
}

/**
 * Направления: какие пары и города смотрят и сколько из них уходит к обменникам.
 * Переход относится к направлению, на странице которого был сделан.
 */
async function directionsTable(f: StatsFilters) {
  const q = new Sql();
  const scope = eventScope(q, f);
  const rows = await run(
    q,
    `with ev as (
       select * from ms_events e where ${scope} and valute_from is not null
         and (type in ('page_view','impression','filter','sort') or (type = 'outbound_click' and section = 'exchangers'))
     ),
     agg as (
       select valute_from, valute_to, coalesce(city, '') as city, max(segment) as segment,
         count(*) filter (where type = 'page_view') as views,
         count(distinct visitor_id) filter (where type = 'page_view') as visitors,
         count(distinct session_id) filter (where type = 'page_view') as sessions,
         count(*) filter (where type = 'outbound_click') as outbound,
         count(distinct visitor_id) filter (where type = 'outbound_click') as outbound_visitors,
         count(distinct session_id) filter (where type = 'outbound_click') as converted,
         count(distinct entity) filter (where type = 'impression') as exchangers_shown
       from ev group by 1, 2, 3
     ),
     top as (
       select distinct on (valute_from, valute_to, coalesce(city, '')) valute_from, valute_to, coalesce(city, '') as city,
         entity, count(*) over (partition by valute_from, valute_to, coalesce(city, ''), entity) as clicks
       from ev where type = 'outbound_click'
       order by valute_from, valute_to, coalesce(city, ''), clicks desc
     )
     select agg.*, top.entity as top_exchanger, top.clicks as top_clicks
     from agg left join top using (valute_from, valute_to, city)
     order by views desc limit 2000`,
  );
  return rows.map((r) => ({
    from: String(r.valute_from),
    to: String(r.valute_to),
    city: r.city ? String(r.city) : null,
    segment: String(r.segment ?? "noncash"),
    views: num(r.views),
    visitors: num(r.visitors),
    sessions: num(r.sessions),
    outbound: num(r.outbound),
    outboundVisitors: num(r.outbound_visitors),
    converted: num(r.converted),
    exchangersShown: num(r.exchangers_shown),
    topExchanger: r.top_exchanger ? String(r.top_exchanger) : null,
    topClicks: num(r.top_clicks),
  }));
}

/** Разрезы по одной колонке направления: валюта «отдаю», «получаю», город, тип обмена. */
async function directionBreakdown(f: StatsFilters, column: "valute_from" | "valute_to" | "city" | "segment") {
  const q = new Sql();
  const scope = eventScope(q, f);
  const rows = await run(
    q,
    `select ${column} as key,
       count(*) filter (where type = 'page_view') as views,
       count(distinct visitor_id) filter (where type = 'page_view') as visitors,
       count(*) filter (where type = 'outbound_click' and section = 'exchangers') as outbound
     from ms_events e where ${scope} and ${column} is not null and type in ('page_view','outbound_click')
     group by 1 order by views desc limit 300`,
  );
  return rows.map((r) => ({ key: String(r.key), views: num(r.views), visitors: num(r.visitors), outbound: num(r.outbound) }));
}

/** Откуда уходят к обменникам: таблица направления, главная, страница обменника… */
async function outboundSources(f: StatsFilters) {
  const q = new Sql();
  const scope = eventScope(q, f);
  const rows = await run(
    q,
    `select page_type, coalesce(source, 'other') as source, count(*) as clicks, count(distinct visitor_id) as visitors
     from ms_events e where ${scope} and section = 'exchangers' and type = 'outbound_click'
     group by 1, 2 order by clicks desc`,
  );
  const detail = new Sql();
  const dscope = eventScope(detail, f);
  const detailRows = await run(
    detail,
    `select page_type, coalesce(source, 'other') as source, count(*) as clicks
     from ms_events e where ${dscope} and section = 'exchangers' and type = 'detail_click'
     group by 1, 2 order by clicks desc`,
  );
  return {
    outbound: rows.map((r) => ({ pageType: String(r.page_type), source: String(r.source), clicks: num(r.clicks), visitors: num(r.visitors) })),
    detail: detailRows.map((r) => ({ pageType: String(r.page_type), source: String(r.source), clicks: num(r.clicks) })),
  };
}

export async function exchangeReport(f: StatsFilters) {
  const [kpis, previous, chart, directions, from, to, cities, segments, sources] = await Promise.all([
    exchangeKpis(f),
    exchangeKpis(previousPeriod(f)),
    series(f, (q) => `(valute_from is not null or section = ${q.p("exchangers")} or page_section = ${q.p("exchangers")})`),
    directionsTable(f),
    directionBreakdown(f, "valute_from"),
    directionBreakdown(f, "valute_to"),
    directionBreakdown(f, "city"),
    directionBreakdown(f, "segment"),
    outboundSources(f),
  ]);
  const names = await entityNames(["exchangers"]);
  return {
    kpis,
    previous,
    series: chart,
    directions: directions.map((d) => ({
      ...d,
      topExchangerName: d.topExchanger ? names.get(`exchangers:${d.topExchanger}`) ?? `#${d.topExchanger}` : null,
    })),
    from,
    to,
    cities,
    segments,
    sources,
  };
}

/** Для страницы одного обменника: по каким направлениям к нему переходили. */
export async function exchangerDirections(f: StatsFilters, slug: string) {
  const q = new Sql();
  const scope = eventScope(q, f);
  const rows = await run(
    q,
    `select valute_from, valute_to, coalesce(city, '') as city,
       count(*) filter (where type = 'outbound_click') as outbound,
       count(*) filter (where type = 'impression') as impressions,
       avg(position) filter (where type = 'impression') as avg_pos
     from ms_events e where ${scope} and section = 'exchangers' and entity = ${q.p(slug)} and valute_from is not null
       and type in ('outbound_click','impression')
     group by 1, 2, 3 order by outbound desc, impressions desc limit 200`,
  );
  return rows.map((r) => ({
    from: String(r.valute_from),
    to: String(r.valute_to),
    city: r.city ? String(r.city) : null,
    outbound: num(r.outbound),
    impressions: num(r.impressions),
    avgPosition: r.avg_pos === null ? null : Number(r.avg_pos),
  }));
}
