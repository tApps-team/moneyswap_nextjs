"use client";

import { useMemo, useState } from "react";
import type { filtersReport, funnel } from "@/cms/server/stats/behavior";
import { BarList, Funnel } from "./charts";
import { fmtDec, fmtInt, fmtPct, sectionTitle, share, SORT_TITLES } from "./format";
import { Kpi, Panel, ReportState, Segmented } from "./parts";
import { StatsTable } from "./stats-table";
import { useStats, useStatsQuery } from "./use-stats";

type FunnelData = Awaited<ReturnType<typeof funnel>>;
type FiltersData = Awaited<ReturnType<typeof filtersReport>>;

export function FunnelPage() {
  const { query } = useStatsQuery();
  const { data, isLoading, error } = useStats<FunnelData>("funnel");
  if (!data) return <ReportState isLoading={isLoading} error={error} />;
  const t = data.total;

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel
          title={query.section ? `Воронка: ${sectionTitle(query.section)}` : "Воронка рейтингов"}
          hint="По визитам: визит засчитывается на шаге, если в нём было такое событие"
        >
          <Funnel
            steps={[
              { label: "Визиты в разделах рейтингов", value: t.sessions },
              { label: "Видели карточки агентов", value: t.impression },
              { label: "Открыли карточку агента", value: t.detail },
              { label: "Перешли к агенту", value: t.outbound },
            ]}
          />
        </Panel>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          <Kpi label="Переходы прямо из списка" value={fmtInt(t.outboundList)} sub="визитов, где «Перейти» нажали в списке" />
          <Kpi label="Переходы с карточки агента" value={fmtInt(t.outboundDetail)} sub="визитов, где перешли после «Подробнее»" />
          <Kpi
            label="Конверсия с фильтрами"
            value={fmtPct(share(t.filteredOutbound, t.filtered))}
            sub={`${fmtInt(t.filtered)} визитов пользовались фильтрами`}
            hint="Доля визитов с переходом среди тех, кто выбирал что-то в фильтрах"
          />
          <Kpi
            label="Конверсия без фильтров"
            value={fmtPct(share(t.unfilteredOutbound, t.sessions - t.filtered))}
            sub={`${fmtInt(t.sessions - t.filtered)} визитов без фильтров`}
          />
        </div>
      </div>

      <Panel title="Воронка по разделам" hint="Проценты — от визитов раздела">
        <StatsTable
          rows={data.sections}
          rowKey={(r) => r.section}
          defaultSort={{ key: "sessions", dir: "desc" }}
          exportName={`воронка_${query.from}_${query.to}`}
          columns={[
            { key: "section", label: "Раздел", primary: true, value: (r) => sectionTitle(r.section) },
            { key: "sessions", label: "Визиты", numeric: true, value: (r) => r.sessions, render: (r) => fmtInt(r.sessions) },
            {
              key: "impression",
              label: "Видели карточки",
              numeric: true,
              value: (r) => share(r.impression, r.sessions),
              render: (r) => `${fmtInt(r.impression)} · ${fmtPct(share(r.impression, r.sessions))}`,
            },
            {
              key: "detail",
              label: "Открыли карточку",
              numeric: true,
              value: (r) => share(r.detail, r.sessions),
              render: (r) => `${fmtInt(r.detail)} · ${fmtPct(share(r.detail, r.sessions))}`,
            },
            {
              key: "outbound",
              label: "Перешли",
              numeric: true,
              value: (r) => share(r.outbound, r.sessions),
              render: (r) => <span className="font-semibold">{`${fmtInt(r.outbound)} · ${fmtPct(share(r.outbound, r.sessions))}`}</span>,
            },
            {
              key: "lost",
              label: "Открыли, но не перешли",
              numeric: true,
              hint: "Визиты, где открыли карточку агента, но не ушли ни к одному агенту — главная зона роста",
              value: (r) => Math.max(0, r.detail - r.outboundDetail),
              render: (r) => fmtInt(Math.max(0, r.detail - r.outboundDetail)),
            },
            { key: "filtered", label: "С фильтрами", numeric: true, value: (r) => share(r.filtered, r.sessions), render: (r) => fmtPct(share(r.filtered, r.sessions)) },
          ]}
        />
      </Panel>
    </div>
  );
}

export function FiltersPage() {
  const { query } = useStatsQuery();
  const { data, isLoading, error } = useStats<FiltersData>("filters");
  const [view, setView] = useState<"values" | "zero">("values");
  const zero = useMemo(() => (data?.values ?? []).filter((v) => v.zero > 0).sort((a, b) => b.zero - a.zero), [data]);
  if (!data) return <ReportState isLoading={isLoading} error={error} />;

  const totalAdds = data.names.reduce((s, n) => s + n.adds, 0);
  const resets = data.names.reduce((s, n) => s + n.resets, 0);
  const listSessions = data.reach.reduce((s, r) => s + r.listSessions, 0);
  const filterSessions = data.reach.reduce((s, r) => s + r.filterSessions, 0);
  const named = data.names.filter((n) => n.name !== "Все фильтры");

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Выборов в фильтрах" value={fmtInt(totalAdds)} />
        <Kpi label="Визитов с фильтрами" value={fmtPct(share(filterSessions, listSessions))} sub={`${fmtInt(filterSessions)} из ${fmtInt(listSessions)} визитов в списках`} />
        <Kpi label="Пустых выборов" value={fmtInt(zero.reduce((s, v) => s + v.zero, 0))} hint="Выбор, после которого в списке не осталось ни одного агента" />
        <Kpi label="Сбросов фильтров" value={fmtInt(resets)} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
        <Panel title="Какими фильтрами пользуются">
          <BarList
            limit={12}
            items={named.map((n) => ({
              key: `${n.section}:${n.name}`,
              label: (
                <>
                  {n.name} <span className="text-xs text-muted-foreground">· {sectionTitle(n.section)}</span>
                </>
              ),
              value: n.adds,
              extra: `${fmtInt(n.sessions)} виз.`,
            }))}
          />
        </Panel>
        <Panel title="Сортировка и страницы списка">
          <BarList
            limit={8}
            empty="Сортировкой не пользовались"
            items={data.sorts.map((s) => ({
              key: `${s.section}:${s.key}:${s.dir}`,
              label: `${SORT_TITLES[s.key] ?? s.key}${s.dir ? (s.dir === "asc" ? " ↑" : " ↓") : ""} · ${sectionTitle(s.section)}`,
              value: s.uses,
            }))}
          />
          <p className="mb-2 mt-4 text-xs font-medium text-muted-foreground">Открывали страницы списка дальше первой</p>
          <BarList
            empty="Дальше первой страницы не листали"
            items={data.pages.map((pg) => ({ key: `${pg.section}:${pg.page}`, label: `${sectionTitle(pg.section)} · стр. ${pg.page}`, value: pg.sessions }))}
          />
        </Panel>
      </div>

      <Panel
        title={view === "values" ? "Значения фильтров" : "Ищут, но не находят"}
        hint={
          view === "values"
            ? "Что выбирают, сколько агентов остаётся и как часто после этого переходят к агенту"
            : "Выборы, после которых список оказался пустым: каких агентов не хватает"
        }
        actions={
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "values", label: "Все значения" },
              { value: "zero", label: `Пустые (${zero.length})` },
            ]}
          />
        }
      >
        <StatsTable
          rows={view === "values" ? data.values : zero}
          rowKey={(r) => `${r.section}:${r.name}:${r.value}`}
          defaultSort={view === "values" ? { key: "adds", dir: "desc" } : { key: "zero", dir: "desc" }}
          search={(r) => `${r.name} ${r.value} ${sectionTitle(r.section)}`}
          searchPlaceholder="Найти страну, валюту, банк…"
          exportName={`фильтры_${query.from}_${query.to}`}
          columns={[
            {
              key: "value",
              label: "Значение",
              primary: true,
              value: (r) => r.value,
              render: (r) => (
                <span className="grid">
                  <span className="font-medium">{r.value}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.name} · {sectionTitle(r.section)}
                  </span>
                </span>
              ),
            },
            { key: "adds", label: "Выбрали", numeric: true, value: (r) => r.adds, render: (r) => fmtInt(r.adds) },
            { key: "visitors", label: "Посетители", numeric: true, value: (r) => r.visitors, render: (r) => fmtInt(r.visitors) },
            { key: "avgResults", label: "Агентов в выдаче", numeric: true, hint: "Сколько агентов в среднем оставалось в списке после выбора", value: (r) => r.avgResults, render: (r) => fmtDec(r.avgResults) },
            { key: "zero", label: "Пусто", numeric: true, hint: "Сколько раз после выбора список был пуст", value: (r) => r.zero, render: (r) => (r.zero ? <span className="text-red-300">{fmtInt(r.zero)}</span> : "—") },
            {
              key: "conv",
              label: "Затем перешли",
              numeric: true,
              hint: "Доля визитов, в которых после этого выбора был переход к агенту этого раздела",
              value: (r) => share(r.converted, r.sessions),
              render: (r) => fmtPct(share(r.converted, r.sessions)),
            },
          ]}
          empty={view === "zero" ? "Пустых выборов не было — всё, что искали, нашлось" : undefined}
        />
      </Panel>
    </div>
  );
}
