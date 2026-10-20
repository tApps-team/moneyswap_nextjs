"use client";

import { useRouter } from "next/navigation";
import type { AgentRow } from "@/cms/server/stats/agents";
import { cn } from "@/shared/lib";
import { delta, fmtDec, fmtInt, fmtPct, sectionTitle, share } from "./format";
import { Panel, ReportState } from "./parts";
import { STATS_BASE } from "./stats-layout";
import { StatsColumn, StatsTable } from "./stats-table";
import { useStats, useStatsQuery } from "./use-stats";

export function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  const d = delta(current, previous);
  if (!d) return <span className="text-muted-foreground">—</span>;
  return (
    <span className={cn("text-xs tabular-nums", d.tone === "up" ? "text-emerald-300" : d.tone === "down" ? "text-red-300" : "text-muted-foreground")}>
      {d.text}
    </span>
  );
}

const n = (v: number) => fmtInt(v);

export const AGENT_COLUMNS: StatsColumn<AgentRow>[] = [
  {
    key: "name",
    label: "Агент",
    primary: true,
    value: (r) => r.name,
    render: (r) => (
      <span className="grid">
        <span className="font-medium">{r.name}</span>
        <span className="text-xs text-muted-foreground">{sectionTitle(r.section)}</span>
      </span>
    ),
  },
  { key: "impressions", label: "Показы", numeric: true, hint: "Сколько раз карточка была на экране в списках, на хабах и главной", value: (r) => r.impressions, render: (r) => n(r.impressions) },
  {
    key: "avgPosition",
    label: "Ср. позиция",
    numeric: true,
    hint: "Средняя позиция карточки в момент показа (с учётом страниц списка). Чем меньше — тем выше в списке",
    value: (r) => r.avgPosition,
    render: (r) => fmtDec(r.avgPosition),
  },
  { key: "detail", label: "«Подробнее»", numeric: true, hint: "Клики, ведущие на карточку агента на сайте", value: (r) => r.detail, render: (r) => n(r.detail) },
  { key: "ctr", label: "CTR", numeric: true, hint: "«Подробнее» и переходы прямо из списка, делённые на показы", value: (r) => share(r.detail + r.outboundList, r.impressions), render: (r) => fmtPct(share(r.detail + r.outboundList, r.impressions)) },
  { key: "views", label: "Просмотры карточки", numeric: true, value: (r) => r.views, render: (r) => n(r.views) },
  { key: "outbound", label: "Переходы", numeric: true, hint: "Все клики, уводящие на сайт агента", value: (r) => r.outbound, render: (r) => <span className="font-semibold">{n(r.outbound)}</span> },
  { key: "outboundUnique", label: "Уникальные", numeric: true, hint: "Разные посетители, перешедшие к агенту за период", value: (r) => r.outboundUnique, render: (r) => n(r.outboundUnique) },
  { key: "repeat", label: "Повторные", numeric: true, hint: "Переходы сверх первого от того же посетителя", value: (r) => r.outbound - r.outboundUnique, render: (r) => n(r.outbound - r.outboundUnique) },
  { key: "outboundList", label: "Из списка", numeric: true, hint: "«Перейти» прямо в карточке списка, хаба или главной — без открытия карточки агента", value: (r) => r.outboundList, render: (r) => n(r.outboundList) },
  { key: "outboundDetail", label: "С карточки", numeric: true, value: (r) => r.outboundDetail, render: (r) => n(r.outboundDetail) },
  { key: "outboundPromo", label: "Промокод", numeric: true, value: (r) => r.outboundPromo, render: (r) => n(r.outboundPromo) },
  {
    key: "conv",
    label: "Карточка → переход",
    numeric: true,
    hint: "Доля просмотров карточки агента, после которых был переход с неё. Низкая — повод посмотреть, что на карточке останавливает",
    value: (r) => share(r.outboundDetail + r.outboundPromo, r.views),
    render: (r) => fmtPct(share(r.outboundDetail + r.outboundPromo, r.views)),
  },
  {
    key: "trend",
    label: "К прошлому",
    numeric: true,
    hint: "Изменение числа переходов к прошлому периоду той же длины",
    value: (r) => (r.prevOutbound ? (r.outbound - r.prevOutbound) / r.prevOutbound : r.outbound ? Infinity : 0),
    render: (r) => <DeltaBadge current={r.outbound} previous={r.prevOutbound} />,
  },
];

export function AgentsPage() {
  const router = useRouter();
  const { query, shared } = useStatsQuery();
  const { data, isLoading, error } = useStats<{ rows: AgentRow[] }>("agents");
  if (!data) return <ReportState isLoading={isLoading} error={error} />;

  return (
    <Panel
      title={query.section ? `Агенты: ${sectionTitle(query.section)}` : "Агенты всех разделов"}
      hint="Нажмите на агента — откроется подробный отчёт: откуда приходят, что выбирали в фильтрах, где уходят"
    >
      <StatsTable
        rows={data.rows}
        columns={AGENT_COLUMNS}
        rowKey={(r) => `${r.section}:${r.slug}`}
        defaultSort={{ key: "outbound", dir: "desc" }}
        search={(r) => `${r.name} ${r.slug} ${sectionTitle(r.section)}`}
        searchPlaceholder="Найти агента"
        exportName={`агенты_${query.from}_${query.to}`}
        onRowClick={(r) => router.push(`${STATS_BASE}/agents/${r.section}/${encodeURIComponent(r.slug)}?${shared}`)}
        empty="За период по агентам нет событий"
      />
    </Panel>
  );
}
