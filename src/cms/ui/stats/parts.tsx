"use client";

import { HelpCircle, Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Sparkline } from "./charts";
import { delta } from "./format";
import { StatsError } from "./use-stats";

/** Блок отчёта: заголовок, пояснение, действия. */
export function Panel({
  title,
  hint,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  hint?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div className="grid min-w-0 gap-0.5">
            {title && <h2 className="font-semibold">{title}</h2>}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
          {actions && <div className="flex min-w-0 max-w-full flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/** Подсказка «что это значит» — у каждого показателя. */
export function Hint({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <HelpCircle className="size-3.5 text-muted-foreground/70" tabIndex={0} aria-label={text} />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-60 -translate-x-1/2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-normal normal-case leading-snug tracking-normal text-foreground shadow-xl group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
}

/** Карточка показателя: значение, изменение к прошлому периоду, мини-график. */
export function Kpi({
  label,
  value,
  current,
  previous,
  hint,
  spark,
  invert,
  sub,
}: {
  label: string;
  value: string;
  current?: number;
  previous?: number;
  hint?: string;
  spark?: number[];
  /** Рост — плохо (например, отказы). */
  invert?: boolean;
  sub?: ReactNode;
}) {
  const d = current !== undefined && previous !== undefined ? delta(current, previous) : null;
  const good = d && d.tone !== "flat" ? (d.tone === "up") !== Boolean(invert) : null;
  return (
    <div className="grid min-w-0 content-between gap-2 rounded-xl border border-border bg-card p-4">
      <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
        <span className="min-w-0 truncate">{label}</span>
        {hint && <Hint text={hint} />}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-2xl font-semibold tabular-nums tracking-tight">{value}</span>
        {d && (
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-xs tabular-nums",
              good === null ? "bg-secondary text-muted-foreground" : good ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300",
            )}
            title="К прошлому периоду той же длины"
          >
            {d.text}
          </span>
        )}
      </div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      {spark && <Sparkline values={spark} />}
    </div>
  );
}

/** Состояния загрузки и ошибок отчёта. */
export function ReportState({ isLoading, error }: { isLoading: boolean; error: unknown }) {
  if (error) {
    const e = error as StatsError;
    if (e.code === "disabled") {
      return (
        <Panel title="Статистика ещё не подключена">
          <p className="text-sm text-muted-foreground">
            Сайт не видит базу статистики: на сервере не задана переменная ANALYTICS_DATABASE_URL. Как только её добавят,
            сбор начнётся автоматически, а здесь появятся отчёты.
          </p>
        </Panel>
      );
    }
    return (
      <Panel title="Не удалось построить отчёт">
        <p className="text-sm text-muted-foreground">{e.message}</p>
      </Panel>
    );
  }
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-16 justify-center text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Считаем…
      </div>
    );
  }
  return null;
}

/** Переключатель вариантов — «по типам / по адресам» и т. п. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex max-w-full overflow-x-auto rounded-lg bg-secondary p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "whitespace-nowrap rounded-md px-3 py-1 text-xs transition-colors",
            o.value === value ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
