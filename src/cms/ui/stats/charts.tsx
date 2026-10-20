"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/lib";
import { fmtInt, fmtPct } from "./format";

/** Ширина контейнера — графики рисуются в пикселях, чтобы текст не растягивался. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

export interface LineSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
  /** Пунктир — для прошлого периода. */
  dashed?: boolean;
}

/** «Красивый» верх шкалы: 1, 2, 2.5, 5 × 10ⁿ. */
function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

export function LineChart({
  labels,
  series,
  height = 260,
  format = fmtInt,
}: {
  labels: string[];
  series: LineSeries[];
  height?: number;
  format?: (v: number) => string;
}) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { top: 12, right: 12, bottom: 28, left: 44 };
  const w = Math.max(width - pad.left - pad.right, 10);
  const h = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(0, ...series.flatMap((s) => s.values)));
  const n = labels.length;
  const x = (i: number) => pad.left + (n <= 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v: number) => pad.top + h - (v / max) * h;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  // Подписи по оси X — не чаще, чем помещаются.
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(w / 70))));

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - pad.left;
    const i = Math.round((px / w) * (n - 1));
    setHover(i >= 0 && i < n ? i : null);
  };

  return (
    <div ref={ref} className="relative w-full min-w-0 select-none">
      {width > 0 && (
        <svg width={width} height={height} onMouseMove={onMove} onMouseLeave={() => setHover(null)} className="block">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + w} y1={y(t)} y2={y(t)} className="stroke-border" strokeDasharray={t ? "3 4" : undefined} />
              <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
                {format(t)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            i % labelEvery === 0 ? (
              <text key={i} x={x(i)} y={height - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                {l.split(",")[0]}
              </text>
            ) : null,
          )}
          {series.map((s) => {
            const d = s.values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
            const area = `${d}L${x(n - 1).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z`;
            return (
              <g key={s.key}>
                {!s.dashed && <path d={area} fill={s.color} opacity={0.08} />}
                <path d={d} fill="none" stroke={s.color} strokeWidth={s.dashed ? 1.5 : 2} strokeDasharray={s.dashed ? "4 4" : undefined} opacity={s.dashed ? 0.7 : 1} />
              </g>
            );
          })}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + h} className="stroke-muted-foreground/40" />
              {series.map((s) => (
                <circle key={s.key} cx={x(hover)} cy={y(s.values[hover] ?? 0)} r={3.5} fill={s.color} />
              ))}
            </g>
          )}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-lg border border-border bg-background/95 px-3 py-2 text-xs shadow-xl"
          style={{ left: Math.min(Math.max(x(hover) - 75, 0), Math.max(width - 190, 0)) }}
        >
          <p className="mb-1 font-medium">{labels[hover]}</p>
          {series.map((s) => (
            <p key={s.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="inline-block size-2 rounded-full" style={{ background: s.color, opacity: s.dashed ? 0.6 : 1 }} />
                {s.label}
              </span>
              <span className="tabular-nums">{format(s.values[hover] ?? 0)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/** Горизонтальные полосы — «топ» чего-либо: подпись, значение, доля. */
export function BarList({
  items,
  format = fmtInt,
  empty = "Нет данных за период",
  limit,
}: {
  items: { key: string; label: ReactNode; value: number; extra?: ReactNode; href?: string; onClick?: () => void }[];
  format?: (v: number) => string;
  empty?: string;
  limit?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const max = Math.max(1, ...items.map((i) => i.value));
  const visible = limit && !expanded ? items.slice(0, limit) : items;
  if (!items.length) return <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="grid gap-1.5">
      {visible.map((item) => {
        const body = (
          <>
            <span className="absolute inset-y-0 left-0 rounded-md bg-primary/10" style={{ width: `${(item.value / max) * 100}%` }} />
            <span className="relative min-w-0 flex-1 truncate">{item.label}</span>
            {item.extra && <span className="relative shrink-0 text-xs text-muted-foreground">{item.extra}</span>}
            <span className="relative shrink-0 tabular-nums font-medium">{format(item.value)}</span>
          </>
        );
        const cls = "relative flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm min-w-0";
        return item.onClick ? (
          <button key={item.key} type="button" onClick={item.onClick} className={cn(cls, "text-left hover:bg-secondary")}>
            {body}
          </button>
        ) : (
          <div key={item.key} className={cls}>
            {body}
          </div>
        );
      })}
      {limit && items.length > limit && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="justify-self-start px-2.5 text-xs text-primary hover:underline">
          {expanded ? "Свернуть" : `Показать все (${items.length})`}
        </button>
      )}
    </div>
  );
}

/** Воронка: шаги с абсолютом, долей от первого шага и потерей к предыдущему. */
export function Funnel({ steps }: { steps: { label: string; value: number; hint?: string }[] }) {
  const first = steps[0]?.value || 0;
  return (
    <div className="grid gap-2">
      {steps.map((s, i) => {
        const prev = i ? steps[i - 1].value : null;
        const lost = prev !== null && prev > 0 ? 1 - s.value / prev : null;
        return (
          <div key={s.label} className="grid gap-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate" title={s.hint}>
                {s.label}
              </span>
              <span className="shrink-0 tabular-nums">
                <span className="font-semibold">{fmtInt(s.value)}</span>
                <span className="ml-2 text-xs text-muted-foreground">{fmtPct(first ? s.value / first : null)}</span>
              </span>
            </div>
            <div className="h-7 overflow-hidden rounded-md bg-secondary">
              <div className="h-full rounded-md bg-primary/70 transition-[width]" style={{ width: `${first ? (s.value / first) * 100 : 0}%` }} />
            </div>
            {lost !== null && lost > 0 && <p className="text-[11px] text-muted-foreground">−{fmtPct(lost)} к предыдущему шагу</p>}
          </div>
        );
      })}
    </div>
  );
}

/** Мини-график для карточки показателя. */
export function Sparkline({ values, color = "hsl(var(--primary))" }: { values: number[]; color?: string }) {
  const path = useMemo(() => {
    if (values.length < 2) return "";
    const max = Math.max(1, ...values);
    return values.map((v, i) => `${i ? "L" : "M"}${((i / (values.length - 1)) * 100).toFixed(2)},${(28 - (v / max) * 26).toFixed(2)}`).join("");
  }, [values]);
  if (!path) return null;
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full">
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
