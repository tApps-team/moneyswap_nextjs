"use client";

import { ArrowLeft, ExternalLink, ListTree } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { agentReport } from "@/cms/server/stats/agents";
import { STAT_SECTIONS, StatSection } from "@/shared/analytics/classify";
import { BarList, Funnel, LineChart } from "./charts";
import {
  CLICK_SOURCE_TITLES,
  DEVICE_TITLES,
  fmtBucket,
  fmtDec,
  fmtDuration,
  fmtInt,
  fmtPct,
  pageTypeTitle,
  sectionTitle,
  share,
  SOURCE_TYPE_TITLES,
} from "./format";
import { Kpi, Panel, ReportState, Segmented } from "./parts";
import { STATS_BASE } from "./stats-layout";
import { StatsTable } from "./stats-table";
import { useStats, useStatsQuery } from "./use-stats";

type Report = Awaited<ReturnType<typeof agentReport>>;
type Metric = "impressions" | "detail" | "pageviews" | "outbound";
const METRICS: { value: Metric; label: string; color: string }[] = [
  { value: "outbound", label: "Переходы", color: "#6ee7b7" },
  { value: "detail", label: "«Подробнее»", color: "#fdba74" },
  { value: "pageviews", label: "Просмотры карточки", color: "#c4b5fd" },
  { value: "impressions", label: "Показы", color: "#94a3b8" },
];

export function AgentPage({ section, slug }: { section: StatSection; slug: string }) {
  const { query, shared } = useStatsQuery();
  const { data, isLoading, error } = useStats<Report>("agent", { section, slug });
  const [metric, setMetric] = useState<Metric>("outbound");
  if (!data) return <ReportState isLoading={isLoading} error={error} />;

  const a = data.agent;
  const back = `${STATS_BASE}/agents?${shared}`;
  if (!a) {
    return (
      <Panel title="За этот период по агенту нет событий">
        <Link href={back} className="text-sm text-primary hover:underline">
          ← Все агенты
        </Link>
      </Panel>
    );
  }
  const m = METRICS.find((x) => x.value === metric) ?? METRICS[0];
  const detailClicks = data.clickSources.filter((c) => c.type === "detail_click");
  const outboundClicks = data.clickSources.filter((c) => c.type === "outbound_click");
  const bySource = (rows: typeof detailClicks) => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.source, (map.get(r.source) ?? 0) + r.clicks));
    return Array.from(map.entries()).sort((x, y) => y[1] - x[1]);
  };
  const labels = new Map<string, number>();
  detailClicks.forEach((r) => labels.set(r.label === a.name ? "Название агента" : r.label || "—", (labels.get(r.label === a.name ? "Название агента" : r.label || "—") ?? 0) + r.clicks));
  const e = data.engagement;
  const sessionsHref = `${STATS_BASE}/sessions?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(shared)), agent: `${section}:${slug}` })}`;

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <Link href={back} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Все агенты
          </Link>
          <h2 className="text-xl font-semibold">{a.name}</h2>
          <p className="text-sm text-muted-foreground">{sectionTitle(section)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={sessionsHref} className="inline-flex h-9 items-center gap-2 rounded-lg bg-secondary px-3 text-sm hover:bg-accent">
            <ListTree className="size-4" /> Визиты с этим агентом
          </Link>
          <a
            href={`${STAT_SECTIONS[section].detail}${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-secondary px-3 text-sm hover:bg-accent"
          >
            <ExternalLink className="size-4" /> На сайте
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Показы" value={fmtInt(a.impressions)} sub={`ср. позиция ${fmtDec(a.avgPosition)}`} />
        <Kpi label="«Подробнее»" value={fmtInt(a.detail)} sub={`уникальных ${fmtInt(a.detailUnique)} · CTR ${fmtPct(share(a.detail + a.outboundList, a.impressions))}`} />
        <Kpi label="Просмотры карточки" value={fmtInt(a.views)} sub={`в переход ${fmtPct(share(a.outboundDetail + a.outboundPromo, a.views))}`} />
        <Kpi
          label="Переходы к агенту"
          value={fmtInt(a.outbound)}
          current={a.outbound}
          previous={query.compare ? a.prevOutbound : undefined}
          sub={`уникальных ${fmtInt(a.outboundUnique)} · повторных ${fmtInt(a.outbound - a.outboundUnique)} · ${fmtPct(share(a.outbound, data.sectionKpis.outbound))} переходов раздела`}
        />
      </div>

      <Panel title="Динамика" actions={<Segmented value={metric} onChange={setMetric} options={METRICS.map(({ value, label }) => ({ value, label }))} />}>
        <LineChart
          labels={data.series.points.map((pt) => fmtBucket(pt.bucket, data.series.step))}
          series={[{ key: metric, label: m.label, color: m.color, values: data.series.points.map((pt) => pt[metric]) }]}
        />
      </Panel>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
        <Panel title="Воронка агента" hint="От показа карточки до перехода на сайт агента">
          <Funnel
            steps={[
              { label: "Показы карточки", value: a.impressions },
              { label: "Клики «Подробнее»", value: a.detail },
              { label: "Просмотры карточки агента", value: a.views },
              { label: "Переходы с карточки", value: a.outboundDetail + a.outboundPromo },
            ]}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Ещё {fmtInt(a.outboundList)} переходов было прямо из списка, минуя карточку.
          </p>
        </Panel>

        <Panel title="Что остановило" hint="Просмотры карточки агента: перешли на сайт против ушедших без перехода">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { title: "Перешли", v: e.converted, tone: "text-emerald-300" },
              { title: "Ушли без перехода", v: e.notConverted, tone: "text-red-300" },
            ].map((x) => (
              <div key={x.title} className="grid gap-1.5 rounded-lg bg-secondary/50 p-3">
                <p className={`font-medium ${x.tone}`}>{x.title}</p>
                <p className="text-xs text-muted-foreground">Просмотров: <span className="text-foreground tabular-nums">{fmtInt(x.v.views)}</span></p>
                <p className="text-xs text-muted-foreground">Время на карточке: <span className="text-foreground">{fmtDuration(x.v.medianMs)}</span> (медиана)</p>
                <p className="text-xs text-muted-foreground">Прокрутили: <span className="text-foreground">{Math.round(x.v.avgScroll)}%</span> страницы</p>
              </div>
            ))}
          </div>
          <p className="mb-2 mt-4 text-xs font-medium text-muted-foreground">Куда ушли с карточки без перехода</p>
          <BarList
            limit={6}
            items={data.exitAfter.map((x) => ({
              key: `${x.key}:${x.section}:${x.entity}`,
              label: x.key === "exit" ? "Закрыли сайт" : `${pageTypeTitle(x.key)}${x.section ? ` · ${sectionTitle(x.section)}` : ""}${x.entity ? ` · ${x.entity}` : ""}`,
              value: x.views,
            }))}
          />
        </Panel>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-3">
        <Panel title="Откуда пришли на карточку">
          <BarList
            items={data.entry.map((x) => ({
              key: `${x.key}:${x.section}`,
              label: x.key === "entry" ? "Сразу на карточку (вход на сайт)" : `${pageTypeTitle(x.key)}${x.section ? ` · ${sectionTitle(x.section)}` : ""}`,
              value: x.views,
            }))}
          />
        </Panel>
        <Panel title="Где нажимали «Подробнее»" hint="Место карточки и надпись на ссылке">
          <BarList items={bySource(detailClicks).map(([k, v]) => ({ key: k, label: CLICK_SOURCE_TITLES[k] ?? k, value: v }))} />
          <p className="mb-2 mt-4 text-xs font-medium text-muted-foreground">По чему кликали</p>
          <BarList items={Array.from(labels.entries()).sort((x, y) => y[1] - x[1]).map(([k, v]) => ({ key: k, label: k, value: v }))} />
        </Panel>
        <Panel title="Откуда переходили к агенту">
          <BarList items={bySource(outboundClicks).map(([k, v]) => ({ key: k, label: CLICK_SOURCE_TITLES[k] ?? k, value: v }))} />
        </Panel>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
        <Panel title="Что выбирали в фильтрах перед переходом" hint="Фильтры раздела в тех же визитах, до клика на этого агента">
          <BarList
            limit={10}
            empty="Перед переходами фильтрами не пользовались"
            items={data.filtersBefore.map((x) => ({ key: `${x.name}:${x.value}`, label: `${x.name}: ${x.value}`, value: x.sessions }))}
          />
        </Panel>
        <Panel title="Позиция в списке" hint="Как часто кликают в зависимости от места карточки">
          <StatsTable
            rows={data.positions}
            rowKey={(r) => String(r.position)}
            pageSize={25}
            defaultSort={{ key: "position", dir: "asc" }}
            columns={[
              { key: "position", label: "Позиция", primary: true, value: (r) => r.position },
              { key: "impressions", label: "Показы", numeric: true, value: (r) => r.impressions, render: (r) => fmtInt(r.impressions) },
              { key: "clicks", label: "Клики", numeric: true, value: (r) => r.clicks, render: (r) => fmtInt(r.clicks) },
              { key: "ctr", label: "CTR", numeric: true, value: (r) => share(r.clicks, r.impressions), render: (r) => fmtPct(share(r.clicks, r.impressions)) },
            ]}
            empty="Нет показов в списках"
          />
        </Panel>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
        <Panel title="Источники визитов" hint="Визиты, в которых видели или открывали этого агента">
          <BarList
            limit={8}
            items={data.traffic.map((x) => ({
              key: `${x.key}:${x.host}`,
              label: `${SOURCE_TYPE_TITLES[x.key] ?? x.key}${x.host ? ` · ${x.host}` : ""}`,
              value: x.sessions,
            }))}
          />
        </Panel>
        <Panel title="Устройства">
          <StatsTable
            rows={data.devices}
            rowKey={(r) => r.key}
            columns={[
              { key: "key", label: "Устройство", primary: true, value: (r) => DEVICE_TITLES[r.key] ?? r.key },
              { key: "views", label: "Просмотры карточки", numeric: true, value: (r) => r.views, render: (r) => fmtInt(r.views) },
              { key: "detail", label: "«Подробнее»", numeric: true, value: (r) => r.detail, render: (r) => fmtInt(r.detail) },
              { key: "outbound", label: "Переходы", numeric: true, value: (r) => r.outbound, render: (r) => fmtInt(r.outbound) },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
