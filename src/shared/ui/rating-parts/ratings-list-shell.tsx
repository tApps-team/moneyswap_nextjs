"use client";

import { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { SortableHeader, SortState } from "../sort-chips";

interface RatingsListShellProps<K extends string> {
  /** Классы grid-сетки строки — общие для шапки и строк таблицы. */
  grid: string;
  /** Минимальная ширина таблицы: ниже неё включается горизонтальный скролл внутри контейнера. */
  minWidth: string;
  headers: { label: string; sortKey?: K }[];
  sort?: SortState<K> | null;
  onSort?: (key: K) => void;
  /** Строки десктопной таблицы. */
  rows: ReactNode;
  /** Карточки мобильной версии. */
  cards: ReactNode;
}

/**
 * Каркас списка рейтинга: на lg+ — таблица со скроллом внутри своего контейнера,
 * ниже — карточки. Разметка повторяет списки eSIM и виртуальных карт.
 */
export function RatingsListShell<K extends string>({
  grid,
  minWidth,
  headers,
  sort = null,
  onSort,
  rows,
  cards,
}: RatingsListShellProps<K>) {
  return (
    <>
      <div className="hidden lg:block overflow-x-auto rounded-[20px] border border-new-grey/60 bg-new-dark-grey scrollbar-thin scrollbar-thumb-new-light-grey scrollbar-track-transparent">
        <div style={{ minWidth }}>
          <div
            className={cn(
              grid,
              "px-5 py-4 text-2xs text-light-gray uppercase tracking-wide bg-new-grey/30",
            )}
          >
            {headers.map((header, index) => (
              <SortableHeader
                key={`${header.label}-${index}`}
                label={header.label}
                sortKey={header.sortKey}
                sort={sort}
                onSort={onSort}
              />
            ))}
          </div>

          <div className="divide-y divide-white/[0.06] pt-3">{rows}</div>
        </div>
      </div>

      <div className="lg:hidden grid gap-4 min-w-0">{cards}</div>
    </>
  );
}
