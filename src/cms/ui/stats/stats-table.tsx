"use client";

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { Hint } from "./parts";

export interface StatsColumn<T> {
  key: string;
  label: string;
  hint?: string;
  /** Значение для сортировки и CSV. */
  value: (row: T) => number | string | null;
  /** Отрисовка ячейки; по умолчанию — значение. */
  render?: (row: T) => ReactNode;
  /** Числовая колонка — выравнивание вправо, сортировка по убыванию первой. */
  numeric?: boolean;
  /** Колонка-название: на мобильном становится заголовком карточки. */
  primary?: boolean;
  className?: string;
}

function toCsv<T>(rows: T[], columns: StatsColumn<T>[]) {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.map((c) => esc(c.label)).join(";")];
  for (const r of rows) lines.push(columns.map((c) => {
    const v = c.value(r);
    // Excel с русской локалью ждёт запятую в дробях.
    return esc(typeof v === "number" ? String(Math.round(v * 1000) / 1000).replace(".", ",") : v);
  }).join(";"));
  return "﻿" + lines.join("\n");
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Таблица отчёта: сортировка по любой колонке, поиск, страницы, выгрузка в CSV.
 * На телефоне строки становятся карточками «подпись — значение».
 */
export function StatsTable<T>({
  rows,
  columns,
  rowKey,
  defaultSort,
  search,
  searchPlaceholder = "Поиск",
  onRowClick,
  exportName,
  pageSize = 25,
  toolbar,
  empty = "Нет данных за выбранный период",
}: {
  rows: T[];
  columns: StatsColumn<T>[];
  rowKey: (row: T) => string;
  defaultSort?: { key: string; dir: "asc" | "desc" };
  search?: (row: T) => string;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  exportName?: string;
  pageSize?: number;
  toolbar?: ReactNode;
  empty?: string;
}) {
  const [sort, setSort] = useState(defaultSort ?? null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return needle && search ? rows.filter((r) => search(r).toLowerCase().includes(needle)) : rows;
  }, [rows, q, search]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = col.value(a);
      const vb = col.value(b);
      if (va === vb) return 0;
      if (va === null || va === undefined) return 1;
      if (vb === null || vb === undefined) return -1;
      return (typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "ru")) * dir;
    });
  }, [filtered, sort, columns]);

  useEffect(() => setPage(1), [q, sort, rows]);
  const pages = Math.max(1, Math.ceil(sorted.length / size));
  const visible = sorted.slice((page - 1) * size, page * size);

  const toggleSort = (c: StatsColumn<T>) =>
    setSort((prev) =>
      prev?.key === c.key ? { key: c.key, dir: prev.dir === "desc" ? "asc" : "desc" } : { key: c.key, dir: c.numeric ? "desc" : "asc" },
    );

  const primary = columns.find((c) => c.primary) ?? columns[0];
  const cell = (c: StatsColumn<T>, r: T) => (c.render ? c.render(r) : (c.value(r) ?? "—"));

  return (
    <div className="grid min-w-0 gap-3">
      {(search || exportName || toolbar) && (
        <div className="flex flex-wrap items-center gap-2">
          {search && (
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary/60"
              />
            </div>
          )}
          {toolbar}
          {exportName && (
            <Button type="button" variant="secondary" size="sm" onClick={() => download(`${exportName}.csv`, toCsv(sorted, columns))} disabled={!sorted.length}>
              <Download className="size-4 mr-1.5" />
              CSV
            </Button>
          )}
        </div>
      )}

      {!sorted.length ? (
        <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <>
          {/* Десктоп и планшет: таблица с горизонтальной прокруткой внутри */}
          <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className={cn("px-3 py-2.5 font-medium", c.numeric ? "text-right" : "text-left", c.className)}>
                      <span className={cn("inline-flex items-center gap-1", c.numeric && "flex-row-reverse")}>
                        <button type="button" onClick={() => toggleSort(c)} className="inline-flex items-center gap-1 whitespace-nowrap hover:text-foreground">
                          {c.label}
                          {sort?.key === c.key && (sort.dir === "desc" ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />)}
                        </button>
                        {c.hint && <Hint text={c.hint} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr
                    key={rowKey(r)}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                    className={cn("border-t border-border", onRowClick && "cursor-pointer hover:bg-secondary/40")}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-3 py-2.5 align-top", c.numeric ? "text-right tabular-nums whitespace-nowrap" : "max-w-[360px]", c.className)}>
                        {cell(c, r)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Телефон: карточки */}
          <div className="grid gap-2 md:hidden">
            {visible.map((r) => (
              <div
                key={rowKey(r)}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={cn("grid min-w-0 gap-2 rounded-lg border border-border p-3", onRowClick && "cursor-pointer active:bg-secondary/40")}
              >
                <div className="min-w-0 break-words font-medium">{cell(primary, r)}</div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                  {columns
                    .filter((c) => c !== primary)
                    .map((c) => (
                      <div key={c.key} className="min-w-0">
                        <dt className="truncate text-muted-foreground">{c.label}</dt>
                        <dd className="min-w-0 break-words tabular-nums">{cell(c, r)}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {sorted.length === rows.length ? `Строк: ${rows.length}` : `Найдено ${sorted.length} из ${rows.length}`}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-8 rounded-md border border-input bg-background px-2"
                aria-label="Строк на странице"
              >
                {[25, 50, 100, 500].map((n) => (
                  <option key={n} value={n}>
                    по {n}
                  </option>
                ))}
              </select>
              {pages > 1 && (
                <>
                  <Button type="button" size="icon" variant="ghost" className="size-8" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Назад">
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="tabular-nums">
                    {page} / {pages}
                  </span>
                  <Button type="button" size="icon" variant="ghost" className="size-8" disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Вперёд">
                    <ChevronRight className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
