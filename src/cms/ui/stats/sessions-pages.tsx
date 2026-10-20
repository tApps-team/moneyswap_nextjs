"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { sessionDetail, sessionsList, visitorDetail } from "@/cms/server/stats/sessions";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { BarList } from "./charts";
import {
  CLICK_SOURCE_TITLES,
  DEVICE_TITLES,
  EVENT_TITLES,
  fmtDateTime,
  fmtDuration,
  fmtInt,
  fmtTime,
  GOAL_TITLES,
  pageTypeTitle,
  sectionTitle,
  SORT_TITLES,
  SOURCE_TYPE_TITLES,
} from "./format";
import { Kpi, Panel, ReportState, Segmented } from "./parts";
import { STATS_BASE } from "./stats-layout";
import { useStats, useStatsQuery } from "./use-stats";

type SessionsData = Awaited<ReturnType<typeof sessionsList>>;
type SessionData = NonNullable<Awaited<ReturnType<typeof sessionDetail>>>;
type VisitorData = NonNullable<Awaited<ReturnType<typeof visitorDetail>>>;

const shortId = (id: string) => id.slice(0, 8);

export function SessionsPage() {
  const router = useRouter();
  const { params, update, shared } = useStatsQuery();
  const outbound = params.get("outbound") ?? "";
  const agent = params.get("agent") ?? "";
  const path = params.get("path") ?? "";
  const sort = params.get("sort") ?? "started";
  const page = Number(params.get("page") ?? 1);
  const [pathDraft, setPathDraft] = useState(path);
  useEffect(() => setPathDraft(path), [path]);

  const { data, isLoading, error, isFetching } = useStats<SessionsData>("sessions", { outbound, agent, path, sort, page });

  return (
    <Panel title="Визиты" hint="Каждый визит анонимен: случайный id браузера, без имён и IP. Нажмите на визит — откроется его хронология">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Segmented
          value={outbound || "all"}
          onChange={(v) => update({ outbound: v === "all" ? null : v, page: null })}
          options={[
            { value: "all", label: "Все визиты" },
            { value: "yes", label: "С переходом к агенту" },
            { value: "no", label: "Без перехода" },
          ]}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ path: pathDraft.trim() || null, page: null });
          }}
          className="relative min-w-[200px] flex-1"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={pathDraft}
            onChange={(e) => setPathDraft(e.target.value)}
            placeholder="Заходили на адрес, например /ved/agents"
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary/60"
          />
        </form>
        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value === "started" ? null : e.target.value, page: null })}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          aria-label="Сортировка"
        >
          <option value="started">Сначала новые</option>
          <option value="duration">Самые долгие</option>
          <option value="views">Больше всего страниц</option>
          <option value="outbound">Больше всего переходов</option>
        </select>
        {agent && (
          <button
            type="button"
            onClick={() => update({ agent: null, page: null })}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary/15 px-3 text-sm text-primary"
          >
            Агент: {agent.split(":").slice(1).join(":")} <X className="size-3.5" />
          </button>
        )}
      </div>

      {!data ? (
        <ReportState isLoading={isLoading} error={error} />
      ) : !data.sessions.length ? (
        <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">Визитов с такими условиями нет</p>
      ) : (
        <div className={cn("grid gap-2 transition-opacity", isFetching && "opacity-60")}>
          {data.sessions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => router.push(`${STATS_BASE}/sessions/${s.id}?${shared}`)}
              className="grid min-w-0 gap-2 rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary/40 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-center"
            >
              <div className="grid text-sm">
                <span className="tabular-nums">{fmtDateTime(s.started)}</span>
                <span className="text-xs text-muted-foreground">
                  {DEVICE_TITLES[s.device] ?? s.device}
                  {s.os ? ` · ${s.os}` : ""}
                </span>
              </div>
              <div className="grid min-w-0 gap-0.5 text-sm">
                <span className="truncate">
                  {s.entry ?? "—"}
                  {s.exit && s.exit !== s.entry ? <span className="text-muted-foreground"> → {s.exit}</span> : null}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {SOURCE_TYPE_TITLES[s.sourceType] ?? s.sourceType}
                  {s.utm ? ` · ${s.utm}` : s.referrer ? ` · ${s.referrer}` : ""} · посетитель {shortId(s.visitor)}
                  {s.returning ? " · вернувшийся" : " · новый"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="rounded-md bg-secondary px-2 py-0.5">{fmtInt(s.views)} стр.</span>
                <span className="rounded-md bg-secondary px-2 py-0.5">{fmtDuration(s.durationMs)}</span>
                {s.filters > 0 && <span className="rounded-md bg-secondary px-2 py-0.5">фильтры {s.filters}</span>}
                {s.detail > 0 && <span className="rounded-md bg-secondary px-2 py-0.5">«Подробнее» {s.detail}</span>}
                {s.outbound > 0 && <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-emerald-300">переходы {s.outbound}</span>}
              </div>
            </button>
          ))}
          <div className="flex items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
            <span>Визитов: {fmtInt(data.total)}</span>
            <div className="flex items-center gap-2">
              <Button type="button" size="icon" variant="ghost" className="size-8" disabled={page <= 1} onClick={() => update({ page: page - 1 > 1 ? page - 1 : null })} aria-label="Назад">
                <ChevronLeft className="size-4" />
              </Button>
              <span className="tabular-nums">
                {page} / {Math.max(1, Math.ceil(data.total / data.pageSize))}
              </span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8"
                disabled={page >= Math.ceil(data.total / data.pageSize)}
                onClick={() => update({ page: page + 1 })}
                aria-label="Вперёд"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

/** Строка хронологии: что произошло, понятными словами. */
function describe(e: SessionData["events"][number]): { title: string; detail?: string; tone?: string } {
  const agent = e.name ?? e.entity ?? "";
  const where = e.source ? CLICK_SOURCE_TITLES[e.source] ?? e.source : "";
  switch (e.type) {
    case "page_view":
      return { title: e.name ? `${pageTypeTitle(e.pageType)}: ${e.name}` : pageTypeTitle(e.pageType), detail: e.path };
    case "page_leave":
      return { title: "Ушёл со страницы", detail: `на экране ${fmtDuration(e.num)} · прокрутил ${e.num2 ?? 0}%`, tone: "text-muted-foreground" };
    case "impression":
      return { title: `Увидел карточку «${agent}»`, detail: `${sectionTitle(e.section)} · ${where}${e.position ? ` · позиция ${e.position}` : ""}`, tone: "text-muted-foreground" };
    case "detail_click":
      return { title: `«Подробнее»: ${agent}`, detail: `${where}${e.value ? ` · нажал «${e.value}»` : ""}${e.position ? ` · позиция ${e.position}` : ""}`, tone: "text-amber-300" };
    case "outbound_click":
      return { title: `Перешёл к агенту «${agent}»`, detail: `${where}${e.value ? ` · ${e.value}` : ""}`, tone: "text-emerald-300" };
    case "external_click":
      return { title: `Внешняя ссылка: ${e.value ?? ""}`, detail: e.name ?? undefined };
    case "filter":
      return {
        title: e.source === "reset" ? "Сбросил фильтры" : `${e.source === "remove" ? "Убрал" : "Выбрал"} в фильтре «${e.name}»: ${e.value}`,
        detail: e.num !== null ? `агентов в списке: ${e.num}` : undefined,
        tone: "text-sky-300",
      };
    case "sort":
      return { title: `Сортировка: ${SORT_TITLES[e.name ?? ""] ?? e.name}${e.value ? (e.value === "asc" ? " ↑" : " ↓") : ""}`, tone: "text-sky-300" };
    case "paginate":
      return { title: `Открыл страницу списка ${e.num}`, tone: "text-sky-300" };
    case "goal":
      return { title: GOAL_TITLES[e.name ?? ""] ?? e.name ?? "Цель" };
    default:
      return { title: EVENT_TITLES[e.type] ?? e.type };
  }
}

export function SessionPage({ id }: { id: string }) {
  const { shared } = useStatsQuery();
  const { data, isLoading, error } = useStats<SessionData>("session", { id });
  const [showAll, setShowAll] = useState(false);
  if (!data) return <ReportState isLoading={isLoading} error={error} />;
  const events = showAll ? data.events : data.events.filter((e) => e.type !== "impression" && e.type !== "page_leave");
  const start = data.events[0]?.ts;
  const end = data.events[data.events.length - 1]?.ts;

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <div className="grid gap-1">
        <Link href={`${STATS_BASE}/sessions?${shared}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Все визиты
        </Link>
        <h2 className="text-xl font-semibold">Визит {start ? fmtDateTime(start) : ""}</h2>
        <p className="text-sm text-muted-foreground">
          {DEVICE_TITLES[data.device] ?? data.device}
          {data.os ? ` · ${data.os}` : ""}
          {data.browser ? ` · ${data.browser}` : ""}
          {data.utm ? ` · UTM: ${data.utm}` : data.referrer ? ` · пришёл с ${data.referrer}` : " · прямой заход"}
          {data.staff ? " · сотрудник" : ""} ·{" "}
          <Link href={`${STATS_BASE}/visitors/${data.visitor}?${shared}`} className="text-primary hover:underline">
            посетитель {shortId(data.visitor)}
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Длительность" value={start && end ? fmtDuration(Date.parse(end) - Date.parse(start)) : "—"} />
        <Kpi label="Страниц" value={fmtInt(data.events.filter((e) => e.type === "page_view").length)} />
        <Kpi label="«Подробнее»" value={fmtInt(data.events.filter((e) => e.type === "detail_click").length)} />
        <Kpi label="Переходы к агентам" value={fmtInt(data.events.filter((e) => e.type === "outbound_click").length)} />
      </div>
      <Panel
        title="Хронология"
        actions={
          <Segmented
            value={showAll ? "all" : "main"}
            onChange={(v) => setShowAll(v === "all")}
            options={[
              { value: "main", label: "Основное" },
              { value: "all", label: "Всё, вместе с показами" },
            ]}
          />
        }
      >
        <ol className="relative grid gap-3 border-l border-border pl-5">
          {events.map((e, i) => {
            const d = describe(e);
            return (
              <li key={i} className="relative grid gap-0.5">
                <span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full border-2 border-card bg-muted-foreground" />
                <span className="text-xs tabular-nums text-muted-foreground">{fmtTime(e.ts)}</span>
                <span className={cn("break-words text-sm", d.tone)}>{d.title}</span>
                {d.detail && <span className="break-all text-xs text-muted-foreground">{d.detail}</span>}
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}

export function VisitorPage({ id }: { id: string }) {
  const { shared } = useStatsQuery();
  const router = useRouter();
  const { data, isLoading, error } = useStats<VisitorData>("visitor", { id });
  const sessions = useStats<SessionsData>("sessions", { visitor: id, pageSize: 100, from: "2000-01-01" });
  if (!data) return <ReportState isLoading={isLoading} error={error} />;

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <div className="grid gap-1">
        <Link href={`${STATS_BASE}/sessions?${shared}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Все визиты
        </Link>
        <h2 className="text-xl font-semibold">Посетитель {shortId(data.id)}</h2>
        <p className="text-sm text-muted-foreground">
          {DEVICE_TITLES[data.device] ?? data.device}
          {data.os ? ` · ${data.os}` : ""}
          {data.browser ? ` · ${data.browser}` : ""} · впервые {fmtDateTime(data.firstSeen)} · последний раз {fmtDateTime(data.lastSeen)}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Kpi label="Визиты" value={fmtInt(data.sessions)} />
        <Kpi label="Просмотры" value={fmtInt(data.views)} />
        <Kpi label="Переходы к агентам" value={fmtInt(data.outbound)} />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
        <Panel title="Агенты, которыми интересовался">
          <BarList
            items={data.agents.map((a) => ({
              key: `${a.section}:${a.slug}`,
              label: `${a.name} · ${sectionTitle(a.section)}`,
              value: a.outbound,
              extra: `«Подробнее» ${a.detail}`,
              onClick: () => router.push(`${STATS_BASE}/agents/${a.section}/${encodeURIComponent(a.slug)}?${shared}`),
            }))}
            empty="К агентам не переходил"
          />
        </Panel>
        <Panel title="Все визиты посетителя">
          {!sessions.data ? (
            <ReportState isLoading={sessions.isLoading} error={sessions.error} />
          ) : (
            <div className="grid grid-cols-[minmax(0,1fr)] gap-1.5">
              {sessions.data.sessions.map((s) => (
                <Link key={s.id} href={`${STATS_BASE}/sessions/${s.id}?${shared}`} className="flex min-w-0 items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-sm hover:bg-secondary">
                  <span className="shrink-0 tabular-nums">{fmtDateTime(s.started)}</span>
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{s.entry}</span>
                  <span className="shrink-0 text-xs">
                    {s.views} стр.{s.outbound ? <span className="text-emerald-300"> · переходы {s.outbound}</span> : null}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
