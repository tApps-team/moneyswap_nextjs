"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { VcList } from "@/widgets/vc/vc-list";
import { VirtualCard } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { LocalPagination, MultiSelectFilter } from "@/shared/ui";
import {
  EMPTY_VC_FILTER,
  VcFilterState,
  VcSort,
  VcSortKey,
  collectVcPlatforms,
  filterVirtualCards,
  isVcFilterActive,
  sortVirtualCards,
} from "../lib/filter";

const PAGE_SIZE = 10;

/** Колонки сортировки для мобильного ряда (на десктопе — заголовки таблицы). */
const SORT_OPTIONS: { key: VcSortKey; label: string }[] = [
  { key: "issuance", label: "Выпуск карты" },
  { key: "topup", label: "Комиссия пополнения" },
];

interface VcExplorerProps {
  cards: VirtualCard[];
}

export const VcExplorer: FC<VcExplorerProps> = ({ cards }) => {
  const [filter, setFilter] = useState<VcFilterState>(EMPTY_VC_FILTER);
  const [sort, setSort] = useState<VcSort | null>(null);
  const [page, setPage] = useState(1);

  const platformOptions = useMemo(() => collectVcPlatforms(cards), [cards]);

  const filtered = useMemo(() => filterVirtualCards(cards, filter), [cards, filter]);
  const sorted = useMemo(() => sortVirtualCards(filtered, sort), [filtered, sort]);
  const active = isVcFilterActive(filter);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page],
  );

  // Любое изменение фильтра или сортировки возвращает на первую страницу.
  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  // Клик по заголовку колонки: asc → desc → сброс.
  const handleSort = (key: VcSortKey) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const reset = () => {
    setFilter(EMPTY_VC_FILTER);
    setSort(null);
  };

  return (
    <div className="grid gap-6 min-w-0">
      {/* Панель фильтров */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <MultiSelectFilter
          label="Сервисы"
          searchPlaceholder="Поиск сервиса"
          options={platformOptions}
          selected={filter.platforms}
          onChange={(platforms) => setFilter((f) => ({ ...f, platforms }))}
          variant="icon"
        />

        {/* Поиск по названию агента */}
        <div className="flex items-center gap-2 h-12 w-full md:flex-1 px-4 rounded-[14px] border border-new-grey/60 bg-new-dark-grey transition-colors focus-within:border-new-light-grey">
          <input
            value={filter.search}
            onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            placeholder="Поиск по названию"
            className="w-full bg-transparent text-base lg:text-sm text-white placeholder:text-light-gray outline-none"
          />
          <Search className="w-4 h-4 text-light-gray shrink-0" />
        </div>

        {active && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 h-12 px-1 self-start md:self-auto text-sm text-light-gray transition-colors hover:text-yellow-main"
          >
            Сбросить
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Сортировка — мобильная (на десктопе через заголовки таблицы) */}
      <div className="flex items-center gap-2 min-w-0 overflow-x-auto lg:hidden scrollbar-thin scrollbar-thumb-new-light-grey scrollbar-track-transparent">
        {SORT_OPTIONS.map(({ key, label }) => {
          const activeSort = sort?.key === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSort(key)}
              className={cn(
                "flex items-center gap-1.5 h-10 px-3 shrink-0 whitespace-nowrap rounded-[12px] border text-sm transition-colors",
                activeSort
                  ? "border-yellow-main/70 bg-yellow-main/10 text-yellow-main"
                  : "border-new-grey/60 bg-new-dark-grey text-light-gray",
              )}
            >
              {label}
              {activeSort ? (
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

      {/* Список карт */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-center py-10 bg-new-dark-grey rounded-[20px] border border-new-grey/60">
          <p className="text-light-gray">
            {active ? "По выбранным фильтрам карты не найдены" : "В этой категории пока нет сервисов"}
          </p>
          {active && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-yellow-main hover:opacity-80"
            >
              Сбросить фильтры
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <VcList cards={visible} sort={sort} onSort={handleSort} />
      )}

      {totalPages > 1 && (
        <LocalPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};
