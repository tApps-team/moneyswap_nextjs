import { StatSection } from "@/shared/analytics/classify";
import { kpis, series } from "./overview";
import { eventScope, num, previousPeriod, SOURCE_TYPE_SQL, Sql, StatsFilters } from "./query";
import { entityNames, run } from "./run";

export interface AgentRow {
  section: string;
  slug: string;
  name: string;
  impressions: number;
  impressionsUnique: number;
  avgPosition: number | null;
  detail: number;
  detailUnique: number;
  views: number;
  viewsUnique: number;
  outbound: number;
  outboundUnique: number;
  outboundList: number;
  outboundDetail: number;
  outboundPromo: number;
  prevOutbound: number;
}

/** Агентские события по (раздел, slug) за период. */
async function agentCounters(f: StatsFilters, only?: { section: string; slug: string }) {
  const q = new Sql();
  const scope = eventScope(q, f, "e", { section: true });
  const filter = only ? ` and section = ${q.p(only.section)} and entity = ${q.p(only.slug)}` : "";
  const rows = await run(
    q,
    `select section, entity,
       count(*) filter (where type = 'impression') as impressions,
       count(distinct visitor_id) filter (where type = 'impression') as impressions_u,
       avg(position) filter (where type = 'impression' and position is not null) as avg_pos,
       count(*) filter (where type = 'detail_click') as detail,
       count(distinct visitor_id) filter (where type = 'detail_click') as detail_u,
       count(*) filter (where type = 'outbound_click') as outbound,
       count(distinct visitor_id) filter (where type = 'outbound_click') as outbound_u,
       count(*) filter (where type = 'outbound_click' and source = 'detail') as out_detail,
       count(*) filter (where type = 'outbound_click' and source = 'promo') as out_promo
     from ms_events e
     where ${scope} and entity is not null and type in ('impression','detail_click','outbound_click')${filter}
     group by 1, 2`,
  );
  return rows;
}

/** Просмотры карточек агентов. */
async function agentViews(f: StatsFilters, only?: { section: string; slug: string }) {
  const q = new Sql();
  const scope = eventScope(q, f, "e", { section: true });
  const filter = only ? ` and page_section = ${q.p(only.section)} and page_entity = ${q.p(only.slug)}` : "";
  return run(
    q,
    `select page_section as section, page_entity as entity, count(*) as views, count(distinct visitor_id) as views_u
     from ms_events e where ${scope} and type = 'page_view' and page_type = 'agent'${filter}
     group by 1, 2`,
  );
}

export async function agentsTable(f: StatsFilters, only?: { section: string; slug: string }): Promise<AgentRow[]> {
  const prev = previousPeriod(f);
  const [counters, views, prevCounters] = await Promise.all([
    agentCounters(f, only),
    agentViews(f, only),
    agentCounters(prev, only),
  ]);
  const rows = new Map<string, AgentRow>();
  const row = (section: string, slug: string) => {
    const key = `${section}:${slug}`;
    let r = rows.get(key);
    if (!r) {
      r = {
        section,
        slug,
        name: slug,
        impressions: 0,
        impressionsUnique: 0,
        avgPosition: null,
        detail: 0,
        detailUnique: 0,
        views: 0,
        viewsUnique: 0,
        outbound: 0,
        outboundUnique: 0,
        outboundList: 0,
        outboundDetail: 0,
        outboundPromo: 0,
        prevOutbound: 0,
      };
      rows.set(key, r);
    }
    return r;
  };
  for (const c of counters) {
    const r = row(String(c.section), String(c.entity));
    r.impressions = num(c.impressions);
    r.impressionsUnique = num(c.impressions_u);
    r.avgPosition = c.avg_pos === null ? null : Number(c.avg_pos);
    r.detail = num(c.detail);
    r.detailUnique = num(c.detail_u);
    r.outbound = num(c.outbound);
    r.outboundUnique = num(c.outbound_u);
    r.outboundDetail = num(c.out_detail);
    r.outboundPromo = num(c.out_promo);
    r.outboundList = r.outbound - r.outboundDetail - r.outboundPromo;
  }
  for (const v of views) {
    if (!v.section || !v.entity) continue;
    const r = row(String(v.section), String(v.entity));
    r.views = num(v.views);
    r.viewsUnique = num(v.views_u);
  }
  for (const c of prevCounters) {
    const r = rows.get(`${c.section}:${c.entity}`);
    if (r) r.prevOutbound = num(c.outbound);
  }
  const names = await entityNames(Array.from(new Set(Array.from(rows.values()).map((r) => r.section))));
  rows.forEach((r) => {
    r.name = names.get(`${r.section}:${r.slug}`) ?? r.slug;
  });
  return Array.from(rows.values()).sort((a, b) => b.outbound - a.outbound || b.detail - a.detail || b.impressions - a.impressions);
}

/** Подробно об одном агенте. */
export async function agentReport(f: StatsFilters, section: StatSection, slug: string) {
  const only = { section, slug };
  const scoped: StatsFilters = { ...f, section };
  const agentCond = (q: Sql) =>
    `((section = ${q.p(section)} and entity = ${q.p(slug)}) or (page_type = 'agent' and page_section = ${q.p(section)} and page_entity = ${q.p(slug)} and type = 'page_view'))`;

  const q1 = new Sql();
  const s1 = eventScope(q1, f);
  const sec1 = q1.p(section);
  const slug1 = q1.p(slug);

  const [rows, chart, sectionKpis, clickSources, positions, devices, entry, exitAfter, engagement, filtersBefore, traffic] =
    await Promise.all([
      agentsTable(f, only),
      series(scoped, agentCond),
      kpis(scoped),
      // Откуда кликали: место карточки и надпись на ссылке.
      run(
        q1,
        `select type, coalesce(source, 'other') as source, coalesce(value, '') as label, count(*) as clicks,
           count(distinct visitor_id) as visitors
         from ms_events e where ${s1} and section = ${sec1} and entity = ${slug1} and type in ('detail_click','outbound_click')
         group by 1, 2, 3 order by clicks desc`,
      ),
      (async () => {
        const q = new Sql();
        const s = eventScope(q, f);
        return run(
          q,
          `select position,
             count(*) filter (where type = 'impression') as impressions,
             count(*) filter (where type in ('detail_click','outbound_click')) as clicks
           from ms_events e where ${s} and section = ${q.p(section)} and entity = ${q.p(slug)} and position is not null
             and coalesce(source, 'list') = 'list'
           group by 1 order by 1 limit 50`,
        );
      })(),
      (async () => {
        const q = new Sql();
        const s = eventScope(q, f);
        return run(
          q,
          `select device as key,
             count(*) filter (where type = 'page_view') as views,
             count(*) filter (where type = 'outbound_click') as outbound,
             count(*) filter (where type = 'detail_click') as detail
           from ms_events e where ${s} and ${agentCond(q)} group by 1 order by views desc`,
        );
      })(),
      // С какой страницы пришли на карточку агента.
      (async () => {
        const q = new Sql();
        const s = eventScope(q, f);
        return run(
          q,
          `with v as (
             select page_type, page_section, page_entity,
               lag(page_type) over (partition by session_id order by ts) as prev_type,
               lag(page_section) over (partition by session_id order by ts) as prev_section
             from ms_events e where ${s} and type = 'page_view'
           )
           select coalesce(prev_type, 'entry') as key, prev_section as section, count(*) as views
           from v where page_type = 'agent' and page_section = ${q.p(section)} and page_entity = ${q.p(slug)}
           group by 1, 2 order by views desc`,
        );
      })(),
      // Куда ушли с карточки, если не перешли к агенту.
      (async () => {
        const q = new Sql();
        const s = eventScope(q, f);
        return run(
          q,
          `with v as (
             select session_id, page_type, page_section, page_entity, ts,
               lead(page_type) over (partition by session_id order by ts) as next_type,
               lead(page_section) over (partition by session_id order by ts) as next_section,
               lead(page_entity) over (partition by session_id order by ts) as next_entity
             from ms_events e where ${s} and type = 'page_view'
           ),
           mine as (
             select v.* from v where page_type = 'agent' and page_section = ${q.p(section)} and page_entity = ${q.p(slug)}
               and not exists (
                 select 1 from ms_events o where o.session_id = v.session_id and o.type = 'outbound_click'
                   and o.section = v.page_section and o.entity = v.page_entity and o.ts >= v.ts
               )
           )
           select coalesce(next_type, 'exit') as key, next_section as section,
             case when next_type = 'agent' then next_entity end as entity, count(*) as views
           from mine group by 1, 2, 3 order by views desc limit 30`,
        );
      })(),
      // Время и прокрутка карточки: перешедшие против ушедших — «что остановило».
      (async () => {
        const q = new Sql();
        const s = eventScope(q, f);
        return run(
          q,
          `with v as (
             select view_id, session_id, ts from ms_events e
             where ${s} and type = 'page_view' and page_type = 'agent' and page_section = ${q.p(section)} and page_entity = ${q.p(slug)}
           ),
           l as (
             select view_id, sum(num) as dur, max(num2) as scroll from ms_events
             where type = 'page_leave' and view_id in (select view_id from v) group by view_id
           ),
           c as (
             select v.view_id, exists (
               select 1 from ms_events o where o.session_id = v.session_id and o.type = 'outbound_click'
                 and o.section = ${q.p(section)} and o.entity = ${q.p(slug)} and o.ts >= v.ts
             ) as converted from v
           )
           select c.converted, count(*) as views, avg(l.dur) as avg_dur,
             percentile_cont(0.5) within group (order by l.dur) as median_dur, avg(l.scroll) as avg_scroll
           from c left join l using (view_id) group by 1`,
        );
      })(),
      // Что выбирали в фильтрах раздела перед переходом к этому агенту.
      (async () => {
        const q = new Sql();
        const s = eventScope(q, f, "o");
        return run(
          q,
          `select fe.name, fe.value, count(distinct fe.session_id) as sessions
           from ms_events o
           join ms_events fe on fe.session_id = o.session_id and fe.type = 'filter' and fe.source = 'add'
             and fe.page_section = o.section and fe.ts < o.ts
           where ${s} and o.type = 'outbound_click' and o.section = ${q.p(section)} and o.entity = ${q.p(slug)}
           group by 1, 2 order by sessions desc limit 25`,
        );
      })(),
      // Источники визитов, в которых открывали карточку или переходили.
      (async () => {
        const q = new Sql();
        const s = eventScope(q, f);
        return run(
          q,
          `with touched as (
             select distinct session_id from ms_events e where ${s} and ${agentCond(q)}
           ),
           src as (
             select distinct on (session_id) session_id, referrer_host, utm_source
             from ms_events where type = 'page_view' and session_id in (select session_id from touched)
             order by session_id, ts
           )
           select ${SOURCE_TYPE_SQL("src")} as key, coalesce(referrer_host, utm_source, '') as host, count(*) as sessions
           from src group by 1, 2 order by sessions desc limit 30`,
        );
      })(),
    ]);

  const engagementBy = (converted: boolean) => {
    const r = engagement.find((x) => Boolean(x.converted) === converted);
    return r
      ? { views: num(r.views), avgMs: num(r.avg_dur), medianMs: num(r.median_dur), avgScroll: num(r.avg_scroll) }
      : { views: 0, avgMs: 0, medianMs: 0, avgScroll: 0 };
  };

  return {
    agent: rows[0] ?? null,
    series: chart,
    sectionKpis,
    clickSources: clickSources.map((r) => ({
      type: String(r.type),
      source: String(r.source),
      label: String(r.label),
      clicks: num(r.clicks),
      visitors: num(r.visitors),
    })),
    positions: positions.map((r) => ({ position: num(r.position), impressions: num(r.impressions), clicks: num(r.clicks) })),
    devices: devices.map((r) => ({ key: String(r.key), views: num(r.views), outbound: num(r.outbound), detail: num(r.detail) })),
    entry: entry.map((r) => ({ key: String(r.key), section: r.section ? String(r.section) : null, views: num(r.views) })),
    exitAfter: exitAfter.map((r) => ({
      key: String(r.key),
      section: r.section ? String(r.section) : null,
      entity: r.entity ? String(r.entity) : null,
      views: num(r.views),
    })),
    engagement: { converted: engagementBy(true), notConverted: engagementBy(false) },
    filtersBefore: filtersBefore.map((r) => ({ name: String(r.name), value: String(r.value), sessions: num(r.sessions) })),
    traffic: traffic.map((r) => ({ key: String(r.key), host: String(r.host), sessions: num(r.sessions) })),
  };
}
