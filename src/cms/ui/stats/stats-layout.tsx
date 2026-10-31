"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { CMS_BASE } from "@/cms/config/paths";
import { STAT_SECTION_KEYS } from "@/shared/analytics/classify";
import { cn } from "@/shared/lib";
import { DateRangePicker } from "./date-range";
import { DEVICE_TITLES, sectionTitle, SOURCE_TYPE_TITLES } from "./format";
import { useStats, useStatsQuery } from "./use-stats";

export const STATS_BASE = `${CMS_BASE}/stats`;

const TABS = [
  { href: "", label: "Обзор" },
  { href: "/agents", label: "Агенты" },
  { href: "/exchange", label: "Обменники" },
  { href: "/funnel", label: "Воронка" },
  { href: "/filters", label: "Фильтры" },
  { href: "/pages", label: "Страницы" },
  { href: "/sources", label: "Источники" },
  { href: "/blog", label: "Блог" },
  { href: "/events", label: "Цели и ссылки" },
  { href: "/sessions", label: "Визиты" },
];

function Select({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border bg-secondary px-3 text-sm outline-none focus:border-primary/60 sm:w-auto",
        value ? "border-primary/50 text-primary" : "border-transparent",
      )}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="inline-flex h-9 min-w-0 cursor-pointer items-center gap-2 rounded-lg bg-secondary px-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[hsl(var(--primary))]" />
      {children}
    </label>
  );
}

function LiveBadge() {
  const { data } = useStats<{ visitors: number }>("realtime", {}, { refetchInterval: 30_000 });
  if (!data) return null;
  return (
    <Link href={`${STATS_BASE}/sessions`} className="inline-flex h-9 min-w-0 items-center gap-2 whitespace-nowrap rounded-lg bg-secondary px-3 text-sm" title="Посетители за последние 5 минут">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      <span className="truncate">Сейчас на сайте:</span> <span className="tabular-nums font-medium">{data.visitors}</span>
    </Link>
  );
}

function Toolbar() {
  const { query, update } = useStatsQuery();
  return (
    <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap [&>*:first-child]:col-span-2">
      <DateRangePicker from={query.from} to={query.to} onChange={(from, to) => update({ from, to })} />
      <Select
        label="Все разделы"
        value={query.section}
        onChange={(v) => update({ section: v })}
        options={STAT_SECTION_KEYS.map((k) => ({ value: k, label: sectionTitle(k) }))}
      />
      <Select
        label="Все устройства"
        value={query.device}
        onChange={(v) => update({ device: v })}
        options={Object.entries(DEVICE_TITLES).map(([value, label]) => ({ value, label }))}
      />
      <Select
        label="Все источники"
        value={query.source}
        onChange={(v) => update({ source: v })}
        options={Object.entries(SOURCE_TYPE_TITLES).map(([value, label]) => ({ value, label }))}
      />
      <Toggle checked={query.compare} onChange={(v) => update({ compare: v ? null : "0" })}>
        <span className="truncate">Сравнить с прошлым</span>
      </Toggle>
      <Toggle checked={query.staff} onChange={(v) => update({ staff: v })}>
        <span className="truncate" title="Визиты с браузеров, где входили в CMS">С сотрудниками</span>
      </Toggle>
      <LiveBadge />
    </div>
  );
}

function Tabs() {
  const pathname = usePathname();
  const { shared } = useStatsQuery();
  return (
    <nav className="-mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 pb-1" aria-label="Отчёты статистики">
      {TABS.map((t) => {
        const href = `${STATS_BASE}${t.href}`;
        const active = t.href ? pathname === href || pathname.startsWith(`${href}/`) : pathname === STATS_BASE;
        return (
          <Link
            key={t.href}
            href={shared ? `${href}?${shared}` : href}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-sm transition-colors",
              active ? "bg-primary/15 font-medium text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Статистика</h1>
        <p className="text-sm text-muted-foreground">
          Собственная статистика сайта: показы и клики по агентам, фильтры, страницы, источники и визиты. Время — московское.
        </p>
      </div>
      <Suspense>
        <Tabs />
        <Toolbar />
        {children}
      </Suspense>
    </div>
  );
}
