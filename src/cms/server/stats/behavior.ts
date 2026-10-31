import { STAT_SECTION_KEYS } from "@/shared/analytics/classify";
import { eventScope, num, Sql, StatsFilters } from "./query";
import { run } from "./run";

/**
 * Воронка раздела по визитам: открыли раздел → увидели карточки →
 * открыли карточку → перешли к агенту. Визит считается на шаге, если
 * в нём было хотя бы одно такое событие в этом разделе.
 */
export async function funnel(f: StatsFilters) {
  const q = new Sql();
  const scope = eventScope(q, f);
  const sectionCond = f.section ? ` and coalesce(section, page_section) = ${q.p(f.section)}` : "";
  const rows = await run(
    q,
    `with ev as (
       select * from ms_events e where ${scope} and coalesce(section, page_section) is not null${sectionCond}
     ),
     s as (
       select session_id, coalesce(section, page_section) as sec,
         bool_or(type = 'page_view' and page_type in ('section_list','section_main','exchange')) as list_view,
         bool_or(type = 'impression') as impression,
         bool_or(type = 'detail_click' or (type = 'page_view' and page_type = 'agent')) as detail,
         bool_or(type = 'page_view' and page_type = 'agent') as agent_view,
         bool_or(type = 'outbound_click') as outbound,
         bool_or(type = 'outbound_click' and source not in ('detail','promo')) as outbound_list,
         bool_or(type = 'outbound_click' and source in ('detail','promo')) as outbound_detail,
         bool_or(type = 'filter') as filtered
       from ev group by 1, 2
     )
     select coalesce(sec, 'all') as sec,
       count(distinct session_id) as sessions,
       count(distinct session_id) filter (where list_view) as list_view,
       count(distinct session_id) filter (where impression) as impression,
       count(distinct session_id) filter (where detail) as detail,
       count(distinct session_id) filter (where agent_view) as agent_view,
       count(distinct session_id) filter (where outbound) as outbound,
       count(distinct session_id) filter (where outbound_list) as outbound_list,
       count(distinct session_id) filter (where outbound_detail) as outbound_detail,
       count(distinct session_id) filter (where filtered) as filtered,
       count(distinct session_id) filter (where filtered and outbound) as filtered_outbound,
       count(distinct session_id) filter (where not filtered and outbound) as unfiltered_outbound
     from s group by grouping sets ((sec), ())`,
  );
  const map = new Map(rows.map((r) => [String(r.sec), r]));
  const shape = (key: string) => {
    const r = map.get(key) ?? {};
    return {
      section: key,
      sessions: num(r.sessions),
      listView: num(r.list_view),
      impression: num(r.impression),
      detail: num(r.detail),
      agentView: num(r.agent_view),
      outbound: num(r.outbound),
      outboundList: num(r.outbound_list),
      outboundDetail: num(r.outbound_detail),
      filtered: num(r.filtered),
      filteredOutbound: num(r.filtered_outbound),
      unfilteredOutbound: num(r.unfiltered_outbound),
    };
  };
  return {
    total: shape("all"),
    sections: (f.section ? [f.section] : STAT_SECTION_KEYS).map(shape),
  };
}

/**
 * Фильтры рейтингов: что выбирают, сколько находится, что ведёт к переходу.
 * «Пустые» выборы (0 результатов) — прямой сигнал, каких агентов не хватает.
 */
export async function filtersReport(f: StatsFilters) {
  const base = (q: Sql, alias = "e") => {
    const scope = eventScope(q, f, alias);
    return f.section ? `${scope} and ${alias}.page_section = ${q.p(f.section)}` : scope;
  };

  const q1 = new Sql();
  const q2 = new Sql();
  const q3 = new Sql();
  const q4 = new Sql();
  const q5 = new Sql();

  const [values, names, sorts, pages, reach] = await Promise.all([
    run(
      q1,
      `with fl as (select * from ms_events e where ${base(q1)} and type = 'filter' and source = 'add'),
       conv as (
         select fl.page_section, fl.name, fl.value, count(distinct fl.session_id) as sessions
         from fl where exists (
           select 1 from ms_events o where o.session_id = fl.session_id and o.type = 'outbound_click'
             and o.section = fl.page_section and o.ts > fl.ts
         ) group by 1, 2, 3
       )
       select fl.page_section as section, fl.name, fl.value,
         count(*) as adds, count(distinct fl.session_id) as sessions, count(distinct fl.visitor_id) as visitors,
         avg(fl.num) as avg_results, count(*) filter (where fl.num = 0) as zero,
         coalesce(max(conv.sessions), 0) as converted
       from fl left join conv on conv.page_section = fl.page_section and conv.name = fl.name and conv.value = fl.value
       group by 1, 2, 3 order by adds desc limit 1000`,
    ),
    run(
      q2,
      `select page_section as section, coalesce(name, '') as name,
         count(*) filter (where source = 'add') as adds,
         count(*) filter (where source = 'remove') as removes,
         count(*) filter (where source = 'reset') as resets,
         count(distinct session_id) as sessions
       from ms_events e where ${base(q2)} and type = 'filter' group by 1, 2 order by adds desc`,
    ),
    run(
      q3,
      `select page_section as section, name, coalesce(value, '') as dir, count(*) as uses, count(distinct session_id) as sessions
       from ms_events e where ${base(q3)} and type = 'sort' group by 1, 2, 3 order by uses desc`,
    ),
    run(
      q4,
      `select page_section as section, num as page, count(*) as uses, count(distinct session_id) as sessions
       from ms_events e where ${base(q4)} and type = 'paginate' group by 1, 2 order by 1, 2`,
    ),
    // Доля визитов раздела, где пользовались фильтрами.
    run(
      q5,
      `select page_section as section,
         count(distinct session_id) filter (where type = 'page_view' and page_type = 'section_list') as list_sessions,
         count(distinct session_id) filter (where type = 'filter') as filter_sessions
       from ms_events e where ${base(q5)} and page_section is not null group by 1`,
    ),
  ]);

  return {
    values: values.map((r) => ({
      section: String(r.section),
      name: String(r.name),
      value: String(r.value),
      adds: num(r.adds),
      sessions: num(r.sessions),
      visitors: num(r.visitors),
      avgResults: r.avg_results === null ? null : Number(r.avg_results),
      zero: num(r.zero),
      converted: num(r.converted),
    })),
    names: names.map((r) => ({
      section: String(r.section),
      name: String(r.name),
      adds: num(r.adds),
      removes: num(r.removes),
      resets: num(r.resets),
      sessions: num(r.sessions),
    })),
    sorts: sorts.map((r) => ({ section: String(r.section), key: String(r.name), dir: String(r.dir), uses: num(r.uses), sessions: num(r.sessions) })),
    pages: pages.map((r) => ({ section: String(r.section), page: num(r.page), uses: num(r.uses), sessions: num(r.sessions) })),
    reach: reach.map((r) => ({ section: String(r.section), listSessions: num(r.list_sessions), filterSessions: num(r.filter_sessions) })),
  };
}
