import { isStatSection } from "@/shared/analytics/classify";
import { eventScope, num, SOURCE_TYPE_SQL, Sql, StatsFilters } from "./query";
import { entityNames, run } from "./run";

export interface SessionFilters {
  agent: { section: string; slug: string } | null;
  outbound: "yes" | "no" | null;
  path: string | null;
  visitor: string | null;
  page: number;
  pageSize: number;
  sort: "started" | "duration" | "views" | "outbound";
}

export function parseSessionFilters(params: URLSearchParams): SessionFilters {
  const [section, ...rest] = (params.get("agent") ?? "").split(":");
  const slug = rest.join(":");
  const outbound = params.get("outbound");
  const visitor = params.get("visitor");
  const sort = params.get("sort");
  return {
    agent: isStatSection(section) && slug ? { section, slug } : null,
    outbound: outbound === "yes" || outbound === "no" ? outbound : null,
    path: params.get("path")?.slice(0, 200) || null,
    visitor: visitor && /^[0-9a-f-]{36}$/i.test(visitor) ? visitor : null,
    page: Math.max(1, Number(params.get("page")) || 1),
    pageSize: Math.min(100, Math.max(10, Number(params.get("pageSize")) || 25)),
    sort: sort === "duration" || sort === "views" || sort === "outbound" ? sort : "started",
  };
}

/** Журнал визитов: кто, когда, откуда, что смотрел и куда перешёл. */
export async function sessionsList(f: StatsFilters, sf: SessionFilters) {
  const q = new Sql();
  const scope = eventScope(q, f, "e", { section: true });
  const conds: string[] = [];
  if (sf.agent) {
    conds.push(`exists (select 1 from ev x where x.session_id = s.session_id and (
      (x.section = ${q.p(sf.agent.section)} and x.entity = ${q.p(sf.agent.slug)}) or
      (x.page_type = 'agent' and x.page_section = ${q.p(sf.agent.section)} and x.page_entity = ${q.p(sf.agent.slug)})))`);
  }
  if (sf.outbound === "yes") conds.push("s.outbound > 0");
  if (sf.outbound === "no") conds.push("s.outbound = 0");
  if (sf.path) conds.push(`exists (select 1 from ev x where x.session_id = s.session_id and x.type = 'page_view' and x.path ilike ${q.p(`%${sf.path}%`)})`);
  if (sf.visitor) conds.push(`s.visitor_id = ${q.p(sf.visitor)}::uuid`);
  const where = conds.length ? `where ${conds.join(" and ")}` : "";
  const order = { started: "s.started desc", duration: "s.dur desc nulls last", views: "s.views desc", outbound: "s.outbound desc, s.started desc" }[sf.sort];

  const rows = await run(
    q,
    `with ev as (select * from ms_events e where ${scope}),
     s as (
       select session_id, (array_agg(visitor_id))[1] as visitor_id, min(ts) as started, max(ts) as ended,
         count(*) filter (where type = 'page_view') as views,
         count(*) filter (where type = 'outbound_click') as outbound,
         count(*) filter (where type = 'detail_click') as detail,
         count(*) filter (where type = 'filter') as filters,
         sum(num) filter (where type = 'page_leave') as dur,
         (array_agg(path order by ts) filter (where type = 'page_view'))[1] as entry,
         (array_agg(path order by ts desc) filter (where type = 'page_view'))[1] as exit,
         max(device) as device, max(os) as os, max(browser) as browser
       from ev group by session_id
     ),
     src as (
       select distinct on (session_id) session_id, referrer_host, utm_source, utm_medium, utm_campaign
       from ev where type = 'page_view' order by session_id, ts
     ),
     filtered as (select s.* from s ${where}),
     page as (
       select filtered.*, src.referrer_host, src.utm_source, src.utm_campaign, ${SOURCE_TYPE_SQL("src")} as source_type,
         count(*) over () as total
       from filtered left join src using (session_id)
       order by ${order.replaceAll("s.", "filtered.")}
       limit ${q.p(sf.pageSize)} offset ${q.p((sf.page - 1) * sf.pageSize)}
     )
     -- «Вернувшийся» считаем только для строк страницы, а не для всех визитов периода.
     select page.*, exists (
       select 1 from ms_events v where v.visitor_id = page.visitor_id and v.ts < page.started
     ) as returning
     from page order by ${order.replaceAll("s.", "page.")}`,
  );
  return {
    total: rows.length ? num(rows[0].total) : 0,
    page: sf.page,
    pageSize: sf.pageSize,
    sessions: rows.map((r) => ({
      id: String(r.session_id),
      visitor: String(r.visitor_id),
      started: (r.started as Date).toISOString(),
      ended: (r.ended as Date).toISOString(),
      durationMs: num(r.dur),
      views: num(r.views),
      detail: num(r.detail),
      outbound: num(r.outbound),
      filters: num(r.filters),
      entry: r.entry ? String(r.entry) : null,
      exit: r.exit ? String(r.exit) : null,
      device: String(r.device),
      os: r.os ? String(r.os) : null,
      browser: r.browser ? String(r.browser) : null,
      sourceType: String(r.source_type),
      referrer: r.referrer_host ? String(r.referrer_host) : null,
      utm: r.utm_source ? [r.utm_source, r.utm_campaign].filter(Boolean).join(" / ") : null,
      returning: Boolean(r.returning),
    })),
  };
}

/** Хронология одного визита — все события по порядку. */
export async function sessionDetail(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const q = new Sql();
  const rows = await run(
    q,
    `select ts, type, path, page_type, page_section, page_entity, section, entity, name, value, source, position, num, num2,
       referrer_host, utm_source, utm_medium, utm_campaign, device, os, browser, visitor_id, is_staff
     from ms_events where session_id = ${q.p(id)}::uuid order by ts, id limit 2000`,
  );
  if (!rows.length) return null;
  const names = await entityNames(Array.from(new Set(rows.map((r) => String(r.section ?? r.page_section ?? "")).filter(Boolean))));
  const first = rows[0];
  return {
    id,
    visitor: String(first.visitor_id),
    device: String(first.device),
    os: first.os ? String(first.os) : null,
    browser: first.browser ? String(first.browser) : null,
    referrer: rows.find((r) => r.referrer_host)?.referrer_host ?? null,
    utm: rows.find((r) => r.utm_source) ? [first.utm_source, first.utm_medium, first.utm_campaign].filter(Boolean).join(" / ") : null,
    staff: Boolean(first.is_staff),
    events: rows.map((r) => ({
      ts: (r.ts as Date).toISOString(),
      type: String(r.type),
      path: String(r.path),
      pageType: String(r.page_type),
      section: r.section ? String(r.section) : r.page_section ? String(r.page_section) : null,
      entity: r.entity ? String(r.entity) : r.page_entity ? String(r.page_entity) : null,
      name: (r.section && r.entity ? names.get(`${r.section}:${r.entity}`) : undefined) ?? (r.name ? String(r.name) : null),
      value: r.value ? String(r.value) : null,
      source: r.source ? String(r.source) : null,
      position: r.position === null ? null : num(r.position),
      num: r.num === null ? null : num(r.num),
      num2: r.num2 === null ? null : num(r.num2),
    })),
  };
}

/** Посетитель: все его визиты, первый заход, переходы. */
export async function visitorDetail(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const q = new Sql();
  const [summary] = await run(
    q,
    `select min(ts) as first_seen, max(ts) as last_seen, count(distinct session_id) as sessions,
       count(*) filter (where type = 'page_view') as views, count(*) filter (where type = 'outbound_click') as outbound,
       max(device) as device, max(os) as os, max(browser) as browser
     from ms_events where visitor_id = ${q.p(id)}::uuid`,
  );
  if (!summary || !summary.first_seen) return null;
  const q2 = new Sql();
  const agents = await run(
    q2,
    `select section, entity, count(*) filter (where type = 'outbound_click') as outbound,
       count(*) filter (where type = 'detail_click') as detail
     from ms_events where visitor_id = ${q2.p(id)}::uuid and entity is not null and type in ('outbound_click','detail_click')
     group by 1, 2 order by outbound desc, detail desc limit 50`,
  );
  const names = await entityNames(Array.from(new Set(agents.map((a) => String(a.section)))));
  return {
    id,
    firstSeen: (summary.first_seen as Date).toISOString(),
    lastSeen: (summary.last_seen as Date).toISOString(),
    sessions: num(summary.sessions),
    views: num(summary.views),
    outbound: num(summary.outbound),
    device: String(summary.device),
    os: summary.os ? String(summary.os) : null,
    browser: summary.browser ? String(summary.browser) : null,
    agents: agents.map((a) => ({
      section: String(a.section),
      slug: String(a.entity),
      name: names.get(`${a.section}:${a.entity}`) ?? String(a.entity),
      outbound: num(a.outbound),
      detail: num(a.detail),
    })),
  };
}

/** Сейчас на сайте: посетители за 5 минут и просмотры по минутам за полчаса. */
export async function realtime(includeStaff: boolean) {
  const staff = includeStaff ? "" : " and not is_staff";
  const q = new Sql();
  const [counts, perMinute, pages] = await Promise.all([
    run(
      q,
      `select count(distinct visitor_id) as visitors, count(*) filter (where type = 'outbound_click') as outbound
       from ms_events where ts > now() - interval '5 minutes'${staff}`,
    ),
    run(
      new Sql(),
      `select to_char(date_trunc('minute', ts at time zone 'Europe/Moscow'), 'HH24:MI') as minute,
         count(*) filter (where type = 'page_view') as views, count(distinct visitor_id) as visitors
       from ms_events where ts > now() - interval '30 minutes'${staff} group by 1 order by 1`,
    ),
    run(
      new Sql(),
      `select path, max(name) as title, count(distinct visitor_id) as visitors from (
         select distinct on (visitor_id) visitor_id, split_part(path, '?', 1) as path, name
         from ms_events where type = 'page_view' and ts > now() - interval '5 minutes'${staff}
         order by visitor_id, ts desc
       ) t group by 1 order by visitors desc limit 15`,
    ),
  ]);
  return {
    visitors: num(counts[0]?.visitors),
    outbound: num(counts[0]?.outbound),
    perMinute: perMinute.map((r) => ({ minute: String(r.minute), views: num(r.views), visitors: num(r.visitors) })),
    pages: pages.map((r) => ({ path: String(r.path), title: r.title ? String(r.title) : null, visitors: num(r.visitors) })),
  };
}
