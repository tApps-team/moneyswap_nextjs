"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { fmtRange } from "./format";
import { shiftDate, todayMsk } from "./use-stats";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const monthStart = (date: string) => `${date.slice(0, 7)}-01`;
const addMonths = (date: string, n: number) => {
  const [y, m] = date.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 10);
};
const monthEnd = (date: string) => shiftDate(addMonths(date, 1), -1);

/** Быстрые периоды — то, чем пользуются чаще всего. */
function presets(today: string) {
  const yesterday = shiftDate(today, -1);
  const thisMonth = monthStart(today);
  const lastMonth = addMonths(thisMonth, -1);
  return [
    { label: "Сегодня", from: today, to: today },
    { label: "Вчера", from: yesterday, to: yesterday },
    { label: "7 дней", from: shiftDate(today, -6), to: today },
    { label: "30 дней", from: shiftDate(today, -29), to: today },
    { label: "90 дней", from: shiftDate(today, -89), to: today },
    { label: "Этот месяц", from: thisMonth, to: today },
    { label: "Прошлый месяц", from: lastMonth, to: monthEnd(lastMonth) },
    { label: "Этот год", from: `${today.slice(0, 4)}-01-01`, to: today },
    { label: "За год", from: shiftDate(today, -364), to: today },
  ];
}

function Month({
  start,
  from,
  to,
  hover,
  today,
  onPick,
  onHover,
}: {
  start: string;
  from: string | null;
  to: string | null;
  hover: string | null;
  today: string;
  onPick: (d: string) => void;
  onHover: (d: string | null) => void;
}) {
  const [y, m] = start.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const offset = (first + 6) % 7; // понедельник — первый день
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  // Пока выбран только начальный день, конец подсвечиваем по наведению.
  const end = to ?? hover;
  const [lo, hi] = from && end ? (from <= end ? [from, end] : [end, from]) : [from, from];

  return (
    <div className="grid gap-2">
      <p className="text-center text-sm font-medium">
        {MONTHS[m - 1]} {y}
      </p>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[11px] text-muted-foreground">
            {w}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = iso(y, m - 1, i + 1);
          const disabled = d > today;
          const inRange = lo && hi && d >= lo && d <= hi;
          const edge = d === lo || d === hi;
          return (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => onPick(d)}
              onMouseEnter={() => onHover(d)}
              className={cn(
                "h-8 text-sm tabular-nums transition-colors disabled:opacity-25",
                inRange && !edge && "bg-primary/15",
                edge ? "rounded-md bg-primary font-semibold text-primary-foreground" : "rounded-md hover:bg-secondary",
                d === today && !edge && "ring-1 ring-inset ring-primary/50",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({ from, to, onChange }: { from: string; to: string; onChange: (from: string, to: string) => void }) {
  const today = todayMsk();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<{ from: string | null; to: string | null }>({ from, to });
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState(() => addMonths(monthStart(to), -1));
  const root = useRef<HTMLDivElement>(null);
  const list = useMemo(() => presets(today), [today]);
  const activePreset = list.find((p) => p.from === from && p.to === to);

  useEffect(() => {
    if (!open) return;
    setDraft({ from, to });
    setView(addMonths(monthStart(to), -1));
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, from, to]);

  const pick = (d: string) => {
    if (!draft.from || draft.to) setDraft({ from: d, to: null });
    else setDraft(d < draft.from ? { from: d, to: draft.from } : { from: draft.from, to: d });
  };
  const apply = (f: string, t: string) => {
    onChange(f, t);
    setOpen(false);
  };

  return (
    <div ref={root} className="relative">
      <Button type="button" variant="secondary" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="max-w-full">
        <CalendarDays className="size-4 mr-2 shrink-0" />
        <span className="truncate">{activePreset ? `${activePreset.label}: ` : ""}{fmtRange(from, to)}</span>
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Период"
          className="fixed inset-x-3 top-20 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-border bg-card p-4 shadow-2xl sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-[640px]"
        >
          <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
            <div className="flex flex-wrap gap-1.5 sm:grid sm:content-start sm:gap-1">
              {list.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => apply(p.from, p.to)}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                    p === activePreset ? "bg-primary/15 text-primary" : "bg-secondary sm:bg-transparent hover:bg-secondary",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 min-w-0" onMouseLeave={() => setHover(null)}>
              <div className="flex items-center justify-between">
                <Button type="button" size="icon" variant="ghost" className="size-8" onClick={() => setView((v) => addMonths(v, -1))} aria-label="Раньше">
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {draft.from && !draft.to ? "Выберите последний день" : "Выберите первый день"}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  disabled={addMonths(view, 1) > monthStart(today)}
                  onClick={() => setView((v) => addMonths(v, 1))}
                  aria-label="Позже"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="hidden sm:block">
                  <Month start={view} {...draft} hover={hover} today={today} onPick={pick} onHover={setHover} />
                </div>
                <Month start={addMonths(view, 1)} {...draft} hover={hover} today={today} onPick={pick} onHover={setHover} />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
                <span className="mr-auto text-sm text-muted-foreground">
                  {draft.from ? fmtRange(draft.from, draft.to ?? draft.from) : "—"}
                </span>
                <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
                <Button type="button" size="sm" disabled={!draft.from} onClick={() => draft.from && apply(draft.from, draft.to ?? draft.from)}>
                  Применить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
