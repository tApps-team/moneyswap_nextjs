"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { EsimList } from "@/widgets/esim/esim-list";
import { Esim } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { LocalPagination, MultiSelectFilter, Switch } from "@/shared/ui";
import {
  EMPTY_ESIM_FILTER,
  EsimFilterState,
  EsimSort,
  EsimSortKey,
  collectEsimCountries,
  filterEsims,
  isEsimFilterActive,
  sortEsims,
} from "../lib/filter";

const PAGE_SIZE = 10;

interface EsimExplorerProps {
  services: Esim[];
}

type BoolKey = "sharing" | "calls" | "topUp";

const TOGGLES: { key: BoolKey; label: string }[] = [
  { key: "sharing", label: "Раздача интернета" },
  { key: "calls", label: "Звонки" },
  { key: "topUp", label: "Продление" },
];

/** Колонки сортировки для мобильного ряда (на десктопе — заголовки таблицы). */
const SORT_OPTIONS: { key: EsimSortKey; label: string }[] = [
  { key: "price", label: "Цена за ГБ" },
  { key: "volume", label: "Объём" },
  { key: "period", label: "Срок" },
];

export const EsimExplorer: FC<EsimExplorerProps> = ({ services }) => {
  const [filter, setFilter] = useState<EsimFilterState>(EMPTY_ESIM_FILTER);
  const [sort, setSort] = useState<EsimSort | null>(null);
  const [page, setPage] = useState(1);

  const countryOptions = useMemo(() => collectEsimCountries(services), [services]);

  const filtered = useMemo(() => filterEsims(services, filter), [services, filter]);
  const sorted = useMemo(() => sortEsims(filtered, sort), [filtered, sort]);
  const active = isEsimFilterActive(filter);

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
  const handleSort = (key: EsimSortKey) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const reset = () => {
    setFilter(EMPTY_ESIM_FILTER);
    setSort(null);
  };

  return (
    <div className="grid gap-6 min-w-0">
      {/* Панель фильтров — все элементы в одном ряду */}
      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-x-4 gap-y-3 min-w-0">
        <MultiSelectFilter
          label="Страна"
          searchPlaceholder="Поиск страны"
          options={countryOptions}
          selected={filter.countries}
          onChange={(countries) => setFilter((f) => ({ ...f, countries }))}
          variant="flag"
        />

        <div className="flex items-center h-12 w-full md:w-auto lg:min-w-[300px] px-4 rounded-[14px] border border-new-grey/60 bg-new-dark-grey transition-colors focus-within:border-new-light-grey">
          <input
            inputMode="numeric"
            value={filter.minVolume}
            onChange={(e) =>
              setFilter((f) => ({ ...f, minVolume: e.target.value.replace(/[^\d]/g, "") }))
            }
            placeholder="Мин. объём интернета, ГБ"
            className="w-full bg-transparent text-base lg:text-sm text-white placeholder:text-light-gray outline-none"
          />
        </div>

        {/* Переключатели-условия. На мобильном — горизонтальный скролл,
            на md+ (md:contents) — обычные элементы общего ряда фильтров. */}
        <div className="flex items-center gap-4 min-w-0 overflow-x-auto md:contents scrollbar-thin scrollbar-thumb-new-light-grey scrollbar-track-transparent">
          {TOGGLES.map(({ key, label }) => {
            const checked = filter[key];
            return (
              <label
                key={key}
                className="flex items-center gap-2.5 h-12 shrink-0 cursor-pointer select-none text-sm"
              >
                <Switch
                  checked={checked}
                  onCheckedChange={(value) => setFilter((f) => ({ ...f, [key]: value }))}
                />
                <span
                  className={cn(
                    "whitespace-nowrap transition-colors",
                    checked ? "text-white" : "text-light-gray",
                  )}
                >
                  {label}
                </span>
              </label>
            );
          })}
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

      {/* Список сервисов */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-center py-10 bg-new-dark-grey rounded-[20px] border border-new-grey/60">
          <p className="text-light-gray">
            {active ? "По выбранным фильтрам сервисы не найдены" : "В этой категории пока нет сервисов"}
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
        <EsimList services={visible} sort={sort} onSort={handleSort} />
      )}

      {totalPages > 1 && (
        <LocalPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};
