"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AgentRow } from "@/cms/server/stats/agents";
import type { exchangeReport } from "@/cms/server/stats/exchange";
import { AGENT_COLUMNS } from "./agents-page";
import { BarList, LineChart } from "./charts";
import { CLICK_SOURCE_TITLES, fmtBucket, fmtInt, fmtPct, pageTypeTitle, share } from "./format";
import { Kpi, Panel, ReportState, Segmented } from "./parts";
import { STATS_BASE } from "./stats-layout";
import { StatsTable } from "./stats-table";
import { useStats, useStatsQuery } from "./use-stats";

type Report = Awaited<ReturnType<typeof exchangeReport>>;

/** Коды валют и городов приходят из адреса в нижнем регистре: «cashrub» → «CASHRUB». */
export const code = (v: string | null | undefined) => (v ? v.toUpperCase() : "—");
const SEGMENT_TITLES: Record<string, string> = { cash: "Наличные", noncash: "Безналичные" };
export const pairLabel = (from: string, to: string, city?: string | null) =>
  `${code(from)} → ${code(to)}${city ? ` · ${code(city)}` : ""}`;

type Metric = "views" | "outbound";

/** Где нажали на обменника — словами обменной части, а не рейтингов. */
function placeLabel(pageType: string, source: string) {
  if (pageType === "exchange") return "Таблица обменников в направлении";
  if (pageType === "agent") return source === "similar" ? "Похожие на странице обменника" : "Страница обменника";
  if (pageType === "section_list") return "Рейтинг обменников";
  if (pageType === "home") return "Главная";
  if (pageType === "hub") return "Хаб направления";
  return `${pageTypeTitle(pageType)} · ${CLICK_SOURCE_TITLES[source] ?? source}`;
}

export function ExchangePage() {
  const router = useRouter();
  const { query, shared } = useStatsQuery();
  const { data, isLoading, error } = useStats<Report>("exchange");
  const exchangers = useStats<{ rows: AgentRow[] }>("agents", { section: "exchangers" });
  const [metric, setMetric] = useState<Metric>("views");
  const [segment, setSegment] = useState<"all" | "cash" | "noncash">("all");
  if (!data) return <ReportState isLoading={isLoading} error={error} />;

  const k = data.kpis;
  const p = query.compare ? data.previous : undefined;
  const directions = segment === "all" ? data.directions : data.directions.filter((d) => d.segment === segment);
  const agentHref = (slug: string) => `${STATS_BASE}/agents/exchangers/${encodeURIComponent(slug)}?${shared}`;

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi
          label="Просмотры направлений"
          value={fmtInt(k.directionViews)}
          current={k.directionViews}
          previous={p?.directionViews}
          sub={`${fmtInt(k.directionVisitors)} посетителей · ${fmtInt(k.directions)} разных пар`}
          hint="Открытия страниц обмена вида «/exchange/BTC-to-CASHRUB» — то, какие направления ищут пользователи."
        />
        <Kpi
          label="Переходы к обменникам"
          value={fmtInt(k.outbound)}
          current={k.outbound}
          previous={p?.outbound}
          sub={`уникальных ${fmtInt(k.outboundUnique)} · повторных ${fmtInt(k.outbound - k.outboundUnique)}`}
          hint="Клики, уводящие на сайт обменника: из таблицы направления, с главной, со страницы обменника."
        />
        <Kpi
          label="Конверсия направления"
          value={fmtPct(share(k.convertedSessions, k.directionSessions))}
          current={share(k.convertedSessions, k.directionSessions) ?? 0}
          previous={p ? share(p.convertedSessions, p.directionSessions) ?? 0 : undefined}
          sub={`${fmtInt(k.convertedSessions)} из ${fmtInt(k.directionSessions)} визитов`}
          hint="Доля визитов со страницей направления, в которых перешли к обменнику."
        />
        <Kpi
          label="Страницы обменников"
          value={fmtInt(k.exchangerViews)}
          current={k.exchangerViews}
          previous={p?.exchangerViews}
          sub={`показов в таблицах: ${fmtInt(k.impressions)}`}
        />
      </div>

      <Panel
        title="Динамика обменной части"
        actions={
          <Segmented
            value={metric}
            onChange={setMetric}
            options={[
              { value: "views", label: "Просмотры" },
              { value: "outbound", label: "Переходы" },
            ]}
          />
        }
      >
        <LineChart
          labels={data.series.points.map((pt) => fmtBucket(pt.bucket, data.series.step))}
          series={[
            {
              key: metric,
              label: metric === "views" ? "Просмотры" : "Переходы",
              color: metric === "views" ? "#7dd3fc" : "#6ee7b7",
              values: data.series.points.map((pt) => (metric === "views" ? pt.pageviews : pt.outbound)),
            },
          ]}
        />
      </Panel>

      <Panel
        title="Направления обмена"
        hint="Какие пары валют и города запрашивают, сколько обменников видели и сколько ушло к ним"
        actions={
          <Segmented
            value={segment}
            onChange={setSegment}
            options={[
              { value: "all", label: "Все" },
              { value: "noncash", label: "Безналичные" },
              { value: "cash", label: "Наличные" },
            ]}
          />
        }
      >
        <StatsTable
          rows={directions}
          rowKey={(r) => `${r.from}:${r.to}:${r.city ?? ""}`}
          defaultSort={{ key: "views", dir: "desc" }}
          search={(r) => `${r.from} ${r.to} ${r.city ?? ""} ${r.topExchangerName ?? ""}`}
          searchPlaceholder="Валюта, город или обменник"
          exportName={`направления_${query.from}_${query.to}`}
          columns={[
            {
              key: "pair",
              label: "Направление",
              primary: true,
              value: (r) => pairLabel(r.from, r.to, r.city),
              render: (r) => (
                <span className="grid">
                  <a
                    href={`/exchange/${code(r.from)}-to-${code(r.to)}${r.city ? `?city=${r.city}&direction=cash` : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium hover:text-primary"
                  >
                    {code(r.from)} → {code(r.to)}
                  </a>
                  <span className="text-xs text-muted-foreground">
                    {SEGMENT_TITLES[r.segment] ?? r.segment}
                    {r.city ? ` · ${code(r.city)}` : ""}
                  </span>
                </span>
              ),
            },
            { key: "views", label: "Просмотры", numeric: true, value: (r) => r.views, render: (r) => fmtInt(r.views) },
            { key: "visitors", label: "Посетители", numeric: true, value: (r) => r.visitors, render: (r) => fmtInt(r.visitors) },
            { key: "shown", label: "Обменников видели", numeric: true, hint: "Сколько разных обменников показали в таблице направления", value: (r) => r.exchangersShown, render: (r) => fmtInt(r.exchangersShown) },
            { key: "outbound", label: "Переходы", numeric: true, value: (r) => r.outbound, render: (r) => <span className="font-semibold">{fmtInt(r.outbound)}</span> },
            {
              key: "conv",
              label: "Конверсия",
              numeric: true,
              hint: "Доля визитов на этом направлении, в которых перешли к обменнику",
              value: (r) => share(r.converted, r.sessions),
              render: (r) => fmtPct(share(r.converted, r.sessions)),
            },
            {
              key: "top",
              label: "Чаще всего уходят в",
              value: (r) => r.topExchangerName ?? "",
              render: (r) =>
                r.topExchanger ? (
                  <button type="button" className="text-left hover:text-primary" onClick={(e) => { e.stopPropagation(); router.push(agentHref(r.topExchanger as string)); }}>
                    {r.topExchangerName} <span className="text-xs text-muted-foreground">({fmtInt(r.topClicks)})</span>
                  </button>
                ) : (
                  <span className="text-muted-foreground">—</span>
                ),
            },
          ]}
          empty="За период направления не открывали"
        />
      </Panel>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-3">
        <Panel title="Что отдают" hint="Валюта «Отдаю» в просмотренных направлениях">
          <BarList limit={10} items={data.from.map((r) => ({ key: r.key, label: code(r.key), value: r.views, extra: `переходов ${fmtInt(r.outbound)}` }))} />
        </Panel>
        <Panel title="Что получают" hint="Валюта «Получаю»">
          <BarList limit={10} items={data.to.map((r) => ({ key: r.key, label: code(r.key), value: r.views, extra: `переходов ${fmtInt(r.outbound)}` }))} />
        </Panel>
        <Panel title="Города наличного обмена">
          <BarList
            limit={10}
            empty="Наличные направления с городом не открывали"
            items={data.cities.map((r) => ({ key: r.key, label: code(r.key), value: r.views, extra: `переходов ${fmtInt(r.outbound)}` }))}
          />
          <p className="mb-2 mt-4 text-xs font-medium text-muted-foreground">Наличные и безналичные</p>
          <BarList items={data.segments.map((r) => ({ key: r.key, label: SEGMENT_TITLES[r.key] ?? r.key, value: r.views, extra: `переходов ${fmtInt(r.outbound)}` }))} />
        </Panel>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
        <Panel title="Откуда уходят к обменникам" hint="Страница и место, где нажали на обменника">
          <BarList
            empty="Переходов к обменникам за период не было"
            items={data.sources.outbound.map((r) => ({
              key: `${r.pageType}:${r.source}`,
              label: placeLabel(r.pageType, r.source),
              value: r.clicks,
              extra: `${fmtInt(r.visitors)} чел.`,
            }))}
          />
        </Panel>
        <Panel title="Откуда открывают страницы обменников" hint="Клики, ведущие на страницу обменника на сайте">
          <BarList
            empty="Страницы обменников не открывали"
            items={data.sources.detail.map((r) => ({
              key: `${r.pageType}:${r.source}`,
              label: placeLabel(r.pageType, r.source),
              value: r.clicks,
            }))}
          />
        </Panel>
      </div>

      <Panel title="Обменники" hint="Нажмите на обменника — откроется подробный отчёт: направления, позиции, источники">
        {!exchangers.data ? (
          <ReportState isLoading={exchangers.isLoading} error={exchangers.error} />
        ) : (
          <StatsTable
            rows={exchangers.data.rows.filter((r) => r.section === "exchangers")}
            columns={AGENT_COLUMNS}
            rowKey={(r) => r.slug}
            defaultSort={{ key: "outbound", dir: "desc" }}
            search={(r) => `${r.name} ${r.slug}`}
            searchPlaceholder="Найти обменника"
            exportName={`обменники_${query.from}_${query.to}`}
            onRowClick={(r) => router.push(agentHref(r.slug))}
            empty="За период по обменникам нет событий"
          />
        )}
      </Panel>
    </div>
  );
}
