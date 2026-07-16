"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { VedAgentsList } from "@/widgets/ved/ved-agents-list";
import { VedAgent } from "@/entities/strapi";
import { cn } from "@/shared/lib";
import { LocalPagination, MultiSelectFilter } from "@/shared/ui";
import {
  EMPTY_VED_FILTER,
  VedFilterState,
  VedSort,
  VedSortKey,
  collectCountries,
  collectCurrencies,
  filterVedAgents,
  isVedFilterActive,
  sortVedAgents,
} from "../lib/filter";

const PAGE_SIZE = 10;

interface VedAgentsExplorerProps {
  agents: VedAgent[];
}

/** Колонки сортировки для мобильного ряда (на десктопе — заголовки таблицы). */
const SORT_OPTIONS: { key: VedSortKey; label: string }[] = [
  { key: "commission", label: "Комиссия" },
  { key: "limitFrom", label: "Лимит перевода" },
];

export const VedAgentsExplorer: FC<VedAgentsExplorerProps> = ({ agents }) => {
  const [filter, setFilter] = useState<VedFilterState>(EMPTY_VED_FILTER);
  const [sort, setSort] = useState<VedSort | null>(null);
  const [page, setPage] = useState(1);

  const countryOptions = useMemo(() => collectCountries(agents), [agents]);
  const currencyOptions = useMemo(() => collectCurrencies(agents), [agents]);

  const filtered = useMemo(() => filterVedAgents(agents, filter), [agents, filter]);
  const sorted = useMemo(() => sortVedAgents(filtered, sort), [filtered, sort]);
  const active = isVedFilterActive(filter);

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
  const handleSort = (key: VedSortKey) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const reset = () => {
    setFilter(EMPTY_VED_FILTER);
    setSort(null);
  };

  return (
    <div className="grid gap-6 min-w-0">
      {/* Панель фильтров */}
      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3">
        <MultiSelectFilter
          label="Страна"
          searchPlaceholder="Поиск страны"
          options={countryOptions}
          selected={filter.countries}
          onChange={(countries) => setFilter((f) => ({ ...f, countries }))}
          variant="flag"
        />

        <MultiSelectFilter
          label="Валюта платежа"
          searchPlaceholder="Поиск валюты"
          options={currencyOptions}
          selected={filter.currencies}
          onChange={(currencies) => setFilter((f) => ({ ...f, currencies }))}
          variant="code"
        />

        <div className="flex items-center h-12 w-full md:w-auto lg:min-w-[300px] px-4 rounded-[14px] border border-new-grey/60 bg-new-dark-grey transition-colors focus-within:border-new-light-grey">
          <input
            inputMode="numeric"
            value={filter.amount}
            onChange={(e) =>
              setFilter((f) => ({ ...f, amount: e.target.value.replace(/[^\d]/g, "") }))
            }
            placeholder="Сумма перевода, USD"
            className="w-full bg-transparent text-base lg:text-sm text-white placeholder:text-light-gray outline-none"
          />
        </div>

        {active && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 h-12 px-3 self-start md:self-auto text-sm text-light-gray transition-colors hover:text-yellow-main"
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

      {/* Список агентов */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-center py-10 bg-new-dark-grey rounded-[20px] border border-new-grey/60">
          <p className="text-light-gray">
            {active ? "По выбранным фильтрам агенты не найдены" : "Агенты пока не добавлены"}
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
        <VedAgentsList agents={visible} sort={sort} onSort={handleSort} />
      )}

      {totalPages > 1 && (
        <LocalPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};
