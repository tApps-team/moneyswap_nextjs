"use client";

import { useState } from "react";
import type { sourcesBreakdown, devicesBreakdown } from "@/cms/server/stats/overview";
import type { blogReport, eventsReport, PageRow } from "@/cms/server/stats/pages";
import { BarList, LineChart } from "./charts";
import {
  DEVICE_TITLES,
  fmtBucket,
  fmtDuration,
  fmtInt,
  fmtPct,
  GOAL_TITLES,
  pageTypeTitle,
  sectionTitle,
  share,
  SOURCE_TYPE_TITLES,
} from "./format";
import { Kpi, Panel, ReportState, Segmented } from "./parts";
import { StatsColumn, StatsTable } from "./stats-table";
import { useStats, useStatsQuery } from "./use-stats";

/**
 * Адреса присылает браузер посетителя — ссылкой делаем только обычный путь сайта.
 * «//чужой.сайт» и прочее показываются текстом, а не ведут наружу из CMS.
 */
const isSitePath = (path: string) => /^\/(?!\/)[^\s\\]*$/.test(path);

const pageColumns = (group: "type" | "path" | "entity"): StatsColumn<PageRow>[] => [
  {
    key: "key",
    label: group === "type" ? "Тип страницы" : "Страница",
    primary: true,
    value: (r) => (group === "type" ? pageTypeTitle(r.key) : r.key),
    render: (r) =>
      group === "type" ? (
        <span className="font-medium">{pageTypeTitle(r.key)}</span>
      ) : (
        <span className="grid min-w-0">
          <a href={isSitePath(r.key) ? r.key : undefined} target="_blank" rel="noopener noreferrer" className="break-all font-medium hover:text-primary" onClick={(e) => e.stopPropagation()}>
            {r.title && r.pageType !== "section_list" && r.pageType !== "home" ? r.title : r.key}
          </a>
          <span className="break-all text-xs text-muted-foreground">
            {pageTypeTitle(r.pageType)}
            {r.section ? ` · ${sectionTitle(r.section)}` : ""}
            {r.title && r.pageType !== "section_list" && r.pageType !== "home" ? ` · ${r.key}` : ""}
          </span>
        </span>
      ),
  },
  { key: "views", label: "Просмотры", numeric: true, value: (r) => r.views, render: (r) => fmtInt(r.views) },
  { key: "visitors", label: "Посетители", numeric: true, value: (r) => r.visitors, render: (r) => fmtInt(r.visitors) },
  { key: "avgMs", label: "Время", numeric: true, hint: "Среднее время, пока страница была на экране", value: (r) => r.avgMs, render: (r) => fmtDuration(r.avgMs) },
  { key: "avgScroll", label: "Прокрутка", numeric: true, hint: "Средняя глубина прокрутки страницы", value: (r) => r.avgScroll, render: (r) => `${Math.round(r.avgScroll)}%` },
  { key: "entries", label: "Входы", numeric: true, hint: "С этой страницы начинались визиты", value: (r) => r.entries, render: (r) => fmtInt(r.entries) },
  { key: "exits", label: "Выходы", numeric: true, hint: "Последняя страница визита — на ней с сайта ушли", value: (r) => r.exits, render: (r) => fmtInt(r.exits) },
  { key: "exitRate", label: "Доля выходов", numeric: true, value: (r) => share(r.exits, r.views), render: (r) => fmtPct(share(r.exits, r.views)) },
  { key: "bounces", label: "Отказы", numeric: true, hint: "Визит из одной этой страницы короче 15 секунд", value: (r) => share(r.bounces, r.entries), render: (r) => fmtPct(share(r.bounces, r.entries)) },
];

export function PagesPage() {
  const { query } = useStatsQuery();
  const [group, setGroup] = useState<"path" | "type">("path");
  const { data, isLoading, error } = useStats<{ rows: PageRow[] }>("pages", { group });

  return (
    <Panel
      title="Страницы сайта"
      hint="Где проводят время, откуда начинают и где заканчивают визиты"
      actions={
        <Segmented
          value={group}
          onChange={setGroup}
          options={[
            { value: "path", label: "По адресам" },
            { value: "type", label: "По типам страниц" },
          ]}
        />
      }
    >
      {!data ? (
        <ReportState isLoading={isLoading} error={error} />
      ) : (
        <StatsTable
          rows={data.rows}
          columns={pageColumns(group)}
          rowKey={(r) => r.key}
          defaultSort={{ key: "views", dir: "desc" }}
          search={(r) => `${r.key} ${r.title ?? ""} ${pageTypeTitle(r.pageType)}`}
          searchPlaceholder="Адрес или название"
          exportName={`страницы_${query.from}_${query.to}`}
        />
      )}
    </Panel>
  );
}

type SourceRow = Awaited<ReturnType<typeof sourcesBreakdown>>[number];
type DeviceRow = Awaited<ReturnType<typeof devicesBreakdown>>[number];
type SourcesData = { types: SourceRow[]; hosts: SourceRow[]; utm: SourceRow[]; devices: DeviceRow[]; os: DeviceRow[]; browsers: DeviceRow[] };

const sourceColumns = (label: string, title: (k: string) => string): StatsColumn<SourceRow>[] => [
  { key: "key", label, primary: true, value: (r) => title(r.key) },
  { key: "sessions", label: "Визиты", numeric: true, value: (r) => r.sessions, render: (r) => fmtInt(r.sessions) },
  { key: "visitors", label: "Посетители", numeric: true, value: (r) => r.visitors, render: (r) => fmtInt(r.visitors) },
  { key: "depth", label: "Глубина", numeric: true, hint: "Просмотров страниц на визит", value: (r) => share(r.pageviews, r.sessions), render: (r) => (share(r.pageviews, r.sessions) ?? 0).toFixed(1).replace(".", ",") },
  { key: "avg", label: "Время визита", numeric: true, value: (r) => r.avgSessionMs, render: (r) => fmtDuration(r.avgSessionMs) },
  { key: "outbound", label: "Переходы к агентам", numeric: true, value: (r) => r.outbound, render: (r) => fmtInt(r.outbound) },
  { key: "conv", label: "Конверсия", numeric: true, hint: "Доля визитов с переходом к агенту", value: (r) => share(r.converted, r.sessions), render: (r) => <span className="font-semibold">{fmtPct(share(r.converted, r.sessions))}</span> },
];

export function SourcesPage() {
  const { query } = useStatsQuery();
  const { data, isLoading, error } = useStats<SourcesData>("sources");
  const [view, setView] = useState<"hosts" | "utm">("hosts");
  if (!data) return <ReportState isLoading={isLoading} error={error} />;

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <Panel title="Источники визитов" hint="По первому просмотру визита: UTM-метки, затем сайт, с которого пришли">
        <StatsTable
          rows={data.types}
          rowKey={(r) => r.key}
          defaultSort={{ key: "sessions", dir: "desc" }}
          columns={sourceColumns("Источник", (k) => SOURCE_TYPE_TITLES[k] ?? k)}
          exportName={`источники_${query.from}_${query.to}`}
        />
      </Panel>
      <Panel
        title={view === "hosts" ? "Сайты, с которых пришли" : "Рекламные кампании (UTM)"}
        actions={
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "hosts", label: "Сайты" },
              { value: "utm", label: "UTM-метки" },
            ]}
          />
        }
      >
        <StatsTable
          rows={view === "hosts" ? data.hosts : data.utm}
          rowKey={(r) => r.key}
          defaultSort={{ key: "sessions", dir: "desc" }}
          search={(r) => r.key}
          columns={sourceColumns(view === "hosts" ? "Сайт" : "Источник / канал / кампания", (k) => k)}
          exportName={`${view === "hosts" ? "сайты" : "utm"}_${query.from}_${query.to}`}
          empty={view === "utm" ? "Визитов с UTM-метками за период не было" : undefined}
        />
      </Panel>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-3">
        {(
          [
            ["Устройства", data.devices, (k: string) => DEVICE_TITLES[k] ?? k],
            ["Операционные системы", data.os, (k: string) => k],
            ["Браузеры", data.browsers, (k: string) => k],
          ] as const
        ).map(([title, rows, label]) => (
          <Panel key={title} title={title}>
            <BarList items={rows.map((r) => ({ key: r.key, label: label(r.key), value: r.sessions, extra: `переходов ${fmtInt(r.outbound)}` }))} />
          </Panel>
        ))}
      </div>
    </div>
  );
}

type BlogData = Awaited<ReturnType<typeof blogReport>>;

export function BlogPage() {
  const { query } = useStatsQuery();
  const { data, isLoading, error } = useStats<BlogData>("blog");
  if (!data) return <ReportState isLoading={isLoading} error={error} />;
  const views = data.articles.reduce((s, a) => s + a.views, 0);
  const read = data.articles.reduce((s, a) => s + a.readRate * a.views, 0);
  const external = data.articles.reduce((s, a) => s + a.external + a.toAgents, 0);

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Просмотры статей" value={fmtInt(views)} />
        <Kpi label="Статей с просмотрами" value={fmtInt(data.articles.length)} />
        <Kpi label="Дочитывания" value={fmtPct(share(read, views))} hint="Доля просмотров, где прокрутили статью хотя бы на 75%" />
        <Kpi label="Клики из статей" value={fmtInt(external)} sub="на внешние ссылки и к агентам" />
      </div>
      <Panel title="Просмотры блога">
        <LineChart
          labels={data.series.points.map((pt) => fmtBucket(pt.bucket, data.series.step))}
          series={[{ key: "pv", label: "Просмотры", color: "#c4b5fd", values: data.series.points.map((pt) => pt.pageviews) }]}
        />
      </Panel>
      <Panel title="Статьи">
        <StatsTable
          rows={data.articles}
          rowKey={(r) => r.key}
          defaultSort={{ key: "views", dir: "desc" }}
          search={(r) => `${r.title} ${r.key}`}
          searchPlaceholder="Найти статью"
          exportName={`статьи_${query.from}_${query.to}`}
          columns={[
            {
              key: "title",
              label: "Статья",
              primary: true,
              value: (r) => r.title,
              render: (r) => (
                <a href={`/blog/article/${r.key}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary">
                  {r.title}
                </a>
              ),
            },
            { key: "views", label: "Просмотры", numeric: true, value: (r) => r.views, render: (r) => fmtInt(r.views) },
            { key: "visitors", label: "Читатели", numeric: true, value: (r) => r.visitors, render: (r) => fmtInt(r.visitors) },
            { key: "avgMs", label: "Время чтения", numeric: true, value: (r) => r.avgMs, render: (r) => fmtDuration(r.avgMs) },
            { key: "readRate", label: "Дочитали", numeric: true, hint: "Прокрутили хотя бы на 75%", value: (r) => r.readRate, render: (r) => fmtPct(r.readRate) },
            { key: "entries", label: "Входы", numeric: true, hint: "Визиты, начавшиеся с этой статьи — обычно из поиска", value: (r) => r.entries, render: (r) => fmtInt(r.entries) },
            { key: "external", label: "Внешние клики", numeric: true, value: (r) => r.external, render: (r) => fmtInt(r.external) },
            { key: "toAgents", label: "К агентам", numeric: true, value: (r) => r.toAgents + r.outbound, render: (r) => fmtInt(r.toAgents + r.outbound) },
          ]}
        />
      </Panel>
      <Panel title="Список блога, категории и теги">
        <StatsTable rows={data.listings} rowKey={(r) => r.key} defaultSort={{ key: "views", dir: "desc" }} columns={pageColumns("path")} />
      </Panel>
    </div>
  );
}

type EventsData = Awaited<ReturnType<typeof eventsReport>>;

export function EventsPage() {
  const { query } = useStatsQuery();
  const { data, isLoading, error } = useStats<EventsData>("events");
  if (!data) return <ReportState isLoading={isLoading} error={error} />;
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <Panel title="Обменная часть" hint="Действия в мониторинге обменников — те же цели, что уходят в Метрику">
        <StatsTable
          rows={data.goals}
          rowKey={(r) => r.name}
          defaultSort={{ key: "hits", dir: "desc" }}
          exportName={`цели_${query.from}_${query.to}`}
          columns={[
            { key: "name", label: "Действие", primary: true, value: (r) => GOAL_TITLES[r.name] ?? r.name },
            { key: "hits", label: "Срабатывания", numeric: true, value: (r) => r.hits, render: (r) => fmtInt(r.hits) },
            { key: "visitors", label: "Посетители", numeric: true, value: (r) => r.visitors, render: (r) => fmtInt(r.visitors) },
            { key: "sessions", label: "Визиты", numeric: true, value: (r) => r.sessions, render: (r) => fmtInt(r.sessions) },
          ]}
          empty="За период действий в обменной части не было"
        />
      </Panel>
      <Panel title="Внешние ссылки" hint="Клики по ссылкам на другие сайты, кроме переходов к агентам: Telegram, обменники, источники в статьях">
        <StatsTable
          rows={data.external}
          rowKey={(r) => `${r.host}:${r.pageType}`}
          defaultSort={{ key: "clicks", dir: "desc" }}
          search={(r) => r.host}
          exportName={`внешние_ссылки_${query.from}_${query.to}`}
          columns={[
            { key: "host", label: "Куда", primary: true, value: (r) => r.host, render: (r) => <span className="grid"><span className="font-medium">{r.host}</span><span className="break-all text-xs text-muted-foreground">{r.example}</span></span> },
            { key: "page", label: "Откуда", value: (r) => pageTypeTitle(r.pageType) },
            { key: "clicks", label: "Клики", numeric: true, value: (r) => r.clicks, render: (r) => fmtInt(r.clicks) },
            { key: "visitors", label: "Посетители", numeric: true, value: (r) => r.visitors, render: (r) => fmtInt(r.visitors) },
          ]}
        />
      </Panel>
    </div>
  );
}
