"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/lib";

export type SortDir = "asc" | "desc";

export interface SortState<K extends string> {
  key: K;
  dir: SortDir;
}

interface SortChipsProps<K extends string> {
  options: { key: K; label: string }[];
  sort: SortState<K> | null;
  onSort: (key: K) => void;
  className?: string;
}

/**
 * Мобильный ряд сортировки: на десктопе те же колонки сортируются
 * кликом по заголовкам таблицы, поэтому ряд скрыт на lg.
 */
export function SortChips<K extends string>({
  options,
  sort,
  onSort,
  className,
}: SortChipsProps<K>) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 min-w-0 overflow-x-auto lg:hidden scrollbar-thin scrollbar-thumb-new-light-grey scrollbar-track-transparent",
        className,
      )}
    >
      {options.map(({ key, label }) => {
        const active = sort?.key === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSort(key)}
            className={cn(
              "flex items-center gap-1.5 h-10 px-3 shrink-0 whitespace-nowrap rounded-[12px] border text-sm transition-colors",
              active
                ? "border-yellow-main/70 bg-yellow-main/10 text-yellow-main"
                : "border-new-grey/60 bg-new-dark-grey text-light-gray",
            )}
          >
            {label}
            {active ? (
              sort?.dir === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 shrink-0" />
              )
            ) : (
              <ArrowUpDown className="w-3.5 h-3.5 shrink-0 opacity-50" />
            )}
          </button>
        );
      })}
    </div>
  );
}

interface SortableHeaderProps<K extends string> {
  label: string;
  sortKey?: K;
  sort: SortState<K> | null;
  onSort?: (key: K) => void;
}

/** Заголовок колонки десктопной таблицы: сортируемый — кнопкой, обычный — текстом. */
export function SortableHeader<K extends string>({
  label,
  sortKey,
  sort,
  onSort,
}: SortableHeaderProps<K>) {
  if (!sortKey || !onSort) {
    return <span className="truncate">{label}</span>;
  }

  const active = sort?.key === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(
        "flex items-center gap-1 uppercase text-left transition-colors hover:text-white min-w-0",
        active && "text-yellow-main",
      )}
    >
      <span className="truncate">{label}</span>
      {active ? (
        sort?.dir === "asc" ? (
          <ArrowUp className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <ArrowDown className="w-3.5 h-3.5 shrink-0" />
        )
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 shrink-0 opacity-50" />
      )}
    </button>
  );
}

/** Переключение направления по клику: asc → desc → сброс. */
export function nextSortState<K extends string>(
  prev: SortState<K> | null,
  key: K,
): SortState<K> | null {
  if (prev?.key !== key) return { key, dir: "asc" };
  if (prev.dir === "asc") return { key, dir: "desc" };
  return null;
}
