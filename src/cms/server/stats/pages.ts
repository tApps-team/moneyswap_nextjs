import { series } from "./overview";
import { eventScope, num, Sql, StatsFilters } from "./query";
import { entityNames, run } from "./run";

export interface PageRow {
  key: string;
  pageType: string;
  section: string | null;
  entity: string | null;
  title: string | null;
  views: number;
  visitors: number;
  avgMs: number;
  avgScroll: number;
  readRate: number;
  entries: number;
  exits: number;
  bounces: number;
}

/**
 * Страницы: просмотры, время, прокрутка, входы и выходы. `group`:
 * type — по типам страниц, path — по адресам, entity — по записям (статьи, агенты).
 */
export async function pagesReport(f: StatsFilters, group: "type" | "path" | "entity" = "path", pageType?: string): Promise<PageRow[]> {
  const q = new Sql();
  const scope = eventScope(q, f, "e", { section: true });
  const typeCond = pageType ? ` and page_type = ${q.p(pageType)}` : "";
  const key =
    group === "type" ? "page_type" : group === "path" ? "split_part(path, '?', 1)" : "coalesce(page_entity, split_part(path, '?', 1))";
  const rows = await run(
    q,
    `with v as (
       select e.*,
         row_number() over (partition by session_id order by ts) as rn,
         row_number() over (partition by session_id order by ts desc) as rn_desc,
         count(*) over (partition by session_id) as session_views
       from ms_events e where ${scope} and type = 'page_view'
     ),
     l as (
       select view_id, sum(num) as dur, max(num2) as scroll from ms_events
       where type = 'page_leave' and view_id in (select view_id from v) group by view_id
     )
     select ${key} as key, min(page_type) as page_type, min(page_section) as section, min(page_entity) as entity,
       max(name) as title,
       count(*) as views, count(distinct visitor_id) as visitors,
       avg(l.dur) as avg_dur, avg(l.scroll) as avg_scroll,
       avg(case when l.scroll >= 75 then 1 else 0 end) as read_rate,
       count(*) filter (where rn = 1) as entries,
       count(*) filter (where rn_desc = 1) as exits,
       count(*) filter (where session_views = 1 and coalesce(l.dur, 0) < 15000) as bounces
     from v left join l using (view_id)
     where true${typeCond}
     group by 1 order by views desc limit 1000`,
  );
  return rows.map((r) => ({
    key: String(r.key),
    pageType: String(r.page_type),
    section: r.section ? String(r.section) : null,
    entity: r.entity ? String(r.entity) : null,
    title: r.title ? String(r.title) : null,
    views: num(r.views),
    visitors: num(r.visitors),
    avgMs: num(r.avg_dur),
    avgScroll: num(r.avg_scroll),
    readRate: num(r.read_rate),
    entries: num(r.entries),
    exits: num(r.exits),
    bounces: num(r.bounces),
  }));
}

/** Блог: статьи с временем чтения, дочитываниями и кликами из текста. */
export async function blogReport(f: StatsFilters) {
  const q = new Sql();
  const scope = eventScope(q, f);
  const [articles, clicks, listings, chart] = await Promise.all([
    pagesReport(f, "entity", "article"),
    run(
      q,
      `select page_entity as entity,
         count(*) filter (where type = 'external_click') as external,
         count(*) filter (where type = 'detail_click') as to_agents,
         count(*) filter (where type = 'outbound_click') as outbound
       from ms_events e where ${scope} and page_type = 'article' group by 1`,
    ),
    (async () => {
      const all = await pagesReport(f, "path");
      return all.filter((p) => ["blog", "blog_category", "blog_tag"].includes(p.pageType));
    })(),
    series(f, (sq) => `page_type in (${sq.p("article")}, ${sq.p("blog")}, ${sq.p("blog_category")}, ${sq.p("blog_tag")})`),
  ]);
  const names = await entityNames(["article"]);
  const clickMap = new Map(clicks.map((c) => [String(c.entity), c]));
  return {
    articles: articles.map((a) => {
      const c = clickMap.get(a.key) ?? {};
      return {
        ...a,
        title: names.get(`article:${a.key}`) ?? a.title ?? a.key,
        external: num(c.external),
        toAgents: num(c.to_agents),
        outbound: num(c.outbound),
      };
    }),
    listings,
    series: chart,
  };
}

/** Цели обмена (дублируются из Метрики) и внешние ссылки без агента. */
export async function eventsReport(f: StatsFilters) {
  const q1 = new Sql();
  const s1 = eventScope(q1, f);
  const q2 = new Sql();
  const s2 = eventScope(q2, f);
  const [goals, external] = await Promise.all([
    run(
      q1,
      `select name, count(*) as hits, count(distinct visitor_id) as visitors, count(distinct session_id) as sessions
       from ms_events e where ${s1} and type = 'goal' group by 1 order by hits desc`,
    ),
    run(
      q2,
      `select split_part(value, '/', 1) as host, page_type, count(*) as clicks, count(distinct visitor_id) as visitors,
         max(value) as example
       from ms_events e where ${s2} and type = 'external_click' group by 1, 2 order by clicks desc limit 300`,
    ),
  ]);
  return {
    goals: goals.map((r) => ({ name: String(r.name), hits: num(r.hits), visitors: num(r.visitors), sessions: num(r.sessions) })),
    external: external.map((r) => ({
      host: String(r.host),
      pageType: String(r.page_type),
      clicks: num(r.clicks),
      visitors: num(r.visitors),
      example: String(r.example),
    })),
  };
}
