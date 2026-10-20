"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { overview } from "@/cms/server/stats/overview";
import { BarList, LineChart, LineSeries } from "./charts";
import {
  DEVICE_TITLES,
  fmtBucket,
  fmtDuration,
  fmtInt,
  fmtPct,
  fmtRange,
  sectionTitle,
  share,
  SOURCE_TYPE_TITLES,
} from "./format";
import { Kpi, Panel, ReportState, Segmented } from "./parts";
import { STATS_BASE } from "./stats-layout";
import { StatsTable } from "./stats-table";
import { useStats, useStatsQuery } from "./use-stats";

type Overview = Awaited<ReturnType<typeof overview>>;
type Metric = "visitors" | "sessions" | "pageviews" | "impressions" | "detail" | "outbound";

const METRICS: { value: Metric; label: string; color: string }[] = [
  { value: "visitors", label: "Посетители", color: "#F6FF5F" },
  { value: "sessions", label: "Визиты", color: "#7dd3fc" },
  { value: "pageviews", label: "Просмотры", color: "#c4b5fd" },
  { value: "impressions", label: "Показы карточек", color: "#94a3b8" },
  { value: "detail", label: "«Подробнее»", color: "#fdba74" },
  { value: "outbound", label: "Переходы к агентам", color: "#6ee7b7" },
];

export function OverviewPage() {
  const router = useRouter();
  const { query, shared } = useStatsQuery();
  const { data, isLoading, error } = useStats<Overview>("overview");
  const [metric, setMetric] = useState<Metric>("outbound");

  if (!data) return <ReportState isLoading={isLoading} error={error} />;
  const k = data.kpis;
  const p = query.compare ? data.previous : undefined;
  const spark = (key: Metric) => data.series.points.map((pt) => pt[key]);
  const m = METRICS.find((x) => x.value === metric) ?? METRICS[0];
  const chartSeries: LineSeries[] = [
    { key: "current", label: fmtRange(query.from, query.to), color: m.color, values: spark(metric) },
    ...(query.compare
      ? [{ key: "prev", label: fmtRange(data.previousRange.from, data.previousRange.to), color: m.color, dashed: true, values: data.previousSeries.points.map((pt) => pt[metric]) }]
      : []),
  ];
  const agentHref = (section: string, slug: string) => `${STATS_BASE}/agents/${section}/${encodeURIComponent(slug)}?${shared}`;

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Kpi
          label="Посетители"
          value={fmtInt(k.visitors)}
          current={k.visitors}
          previous={p?.visitors}
          spark={spark("visitors")}
          sub={`новых ${fmtInt(k.newVisitors)} · вернувшихся ${fmtInt(k.visitors - k.newVisitors)}`}
          hint="Разные браузеры за период. Новый — впервые зашёл на сайт в этом периоде."
        />
        <Kpi
          label="Визиты"
          value={fmtInt(k.sessions)}
          current={k.sessions}
          previous={p?.sessions}
          spark={spark("sessions")}
          sub={`${fmtDuration(k.avgSessionMs)} в среднем`}
          hint="Визит заканчивается после 30 минут бездействия — как в Метрике."
        />
        <Kpi
          label="Показы карточек"
          value={fmtInt(k.impressions)}
          current={k.impressions}
          previous={p?.impressions}
          spark={spark("impressions")}
          hint="Карточка агента была на экране хотя бы наполовину дольше 0,6 с. Один агент считается один раз за просмотр страницы."
        />
        <Kpi
          label="Клики «Подробнее»"
          value={fmtInt(k.detail)}
          current={k.detail}
          previous={p?.detail}
          spark={spark("detail")}
          sub={`уникальных ${fmtInt(k.detailUnique)} · CTR ${fmtPct(share(k.detail, k.impressions))}`}
          hint="Переходы на карточку агента: кнопка «Подробнее», название или логотип. CTR — доля от показов."
        />
        <Kpi
          label="Переходы к агентам"
          value={fmtInt(k.outbound)}
          current={k.outbound}
          previous={p?.outbound}
          spark={spark("outbound")}
          sub={`уникальных ${fmtInt(k.outboundUnique)} · повторных ${fmtInt(k.outbound - k.outboundUnique)}`}
          hint="Клики «Перейти», «Оформить», «Получить» и по промокодам — уход на сайт агента. Уникальный — первый клик посетителя по этому агенту за период, остальные — повторные."
        />
        <Kpi
          label="Конверсия визита в переход"
          value={fmtPct(share(k.outboundSessions, k.sessions))}
          current={share(k.outboundSessions, k.sessions) ?? 0}
          previous={p ? share(p.outboundSessions, p.sessions) ?? 0 : undefined}
          sub={`${fmtInt(k.outboundSessions)} визитов с переходом`}
          hint="Доля визитов, в которых был хотя бы один переход к агенту."
        />
        <Kpi
          label="Просмотры страниц"
          value={fmtInt(k.pageviews)}
          current={k.pageviews}
          previous={p?.pageviews}
          sub={`${(k.sessions ? k.pageviews / k.sessions : 0).toFixed(1).replace(".", ",")} на визит`}
        />
        <Kpi
          label="Просмотры карточек агентов"
          value={fmtInt(k.agentViews)}
          current={k.agentViews}
          previous={p?.agentViews}
          sub={`в переход: ${fmtPct(share(k.outbound, k.agentViews))}`}
        />
        <Kpi
          label="Отказы"
          value={fmtPct(share(k.bounces, k.sessions))}
          current={share(k.bounces, k.sessions) ?? 0}
          previous={p ? share(p.bounces, p.sessions) ?? 0 : undefined}
          invert
          hint="Визит из одной страницы короче 15 секунд без единого клика."
        />
        <Kpi
          label="Среднее время визита"
          value={fmtDuration(k.avgSessionMs)}
          current={k.avgSessionMs}
          previous={p?.avgSessionMs}
          hint="Только время, когда вкладка с сайтом была открыта на экране."
        />
      </div>

      <Panel
        title="Динамика"
        hint={query.compare ? "Пунктир — прошлый период той же длины" : undefined}
        actions={<Segmented value={metric} onChange={setMetric} options={METRICS.map(({ value, label }) => ({ value, label }))} />}
      >
        <LineChart labels={data.series.points.map((pt) => fmtBucket(pt.bucket, data.series.step))} series={chartSeries} />
      </Panel>

      <Panel title="Разделы рейтингов" hint="Нажмите на раздел, чтобы открыть его агентов">
        <StatsTable
          rows={data.sections}
          rowKey={(r) => r.section}
          defaultSort={{ key: "outbound", dir: "desc" }}
          onRowClick={(r) => router.push(`${STATS_BASE}/agents?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(shared)), section: r.section })}`)}
          exportName={`разделы_${query.from}_${query.to}`}
          columns={[
            { key: "section", label: "Раздел", primary: true, value: (r) => sectionTitle(r.section) },
            { key: "sessions", label: "Визиты", numeric: true, value: (r) => r.sessions, render: (r) => fmtInt(r.sessions) },
            { key: "listViews", label: "Просмотры списка", numeric: true, value: (r) => r.listViews, render: (r) => fmtInt(r.listViews) },
            { key: "impressions", label: "Показы", numeric: true, value: (r) => r.impressions, render: (r) => fmtInt(r.impressions) },
            { key: "detail", label: "«Подробнее»", numeric: true, value: (r) => r.detail, render: (r) => fmtInt(r.detail) },
            { key: "agentViews", label: "Карточки", numeric: true, value: (r) => r.agentViews, render: (r) => fmtInt(r.agentViews) },
            { key: "outbound", label: "Переходы", numeric: true, value: (r) => r.outbound, render: (r) => fmtInt(r.outbound) },
            { key: "outboundUnique", label: "Уник. переходы", numeric: true, value: (r) => r.outboundUnique, render: (r) => fmtInt(r.outboundUnique) },
            {
              key: "conv",
              label: "Переходы / визиты",
              numeric: true,
              hint: "Сколько переходов к агентам приходится на один визит раздела",
              value: (r) => share(r.outbound, r.sessions),
              render: (r) => fmtPct(share(r.outbound, r.sessions)),
            },
            { key: "filters", label: "Фильтры", numeric: true, value: (r) => r.filters, render: (r) => fmtInt(r.filters) },
          ]}
        />
      </Panel>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-3">
        <Panel title="Лидеры по переходам" hint="Уникальные — в скобках">
          <BarList
            items={data.agents.map((a) => ({
              key: `${a.section}:${a.slug}`,
              label: (
                <>
                  {a.name} <span className="text-xs text-muted-foreground">· {sectionTitle(a.section)}</span>
                </>
              ),
              value: a.outbound,
              extra: `(${fmtInt(a.outboundUnique)})`,
              onClick: () => router.push(agentHref(a.section, a.slug)),
            }))}
          />
        </Panel>
        <Panel title="Источники визитов">
          <BarList
            items={data.sources.map((s) => ({
              key: s.key,
              label: SOURCE_TYPE_TITLES[s.key] ?? s.key,
              value: s.sessions,
              extra: `в переход ${fmtPct(share(s.converted, s.sessions))}`,
            }))}
          />
        </Panel>
        <Panel title="Устройства">
          <BarList
            items={data.devices.map((d) => ({
              key: d.key,
              label: DEVICE_TITLES[d.key] ?? d.key,
              value: d.sessions,
              extra: `переходов ${fmtInt(d.outbound)}`,
            }))}
          />
        </Panel>
      </div>
    </div>
  );
}
