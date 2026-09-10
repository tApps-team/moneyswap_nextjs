"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { PsList } from "@/widgets/payment-services/ps-list";
import { PaymentService } from "@/entities/strapi";
import {
  EmptyResult,
  FiltersBar,
  LocalPagination,
  MultiSelectFilter,
  SearchInput,
  SortChips,
  nextSortState,
} from "@/shared/ui";
import {
  EMPTY_PS_FILTER,
  PsFilterState,
  PsSort,
  PsSortKey,
  collectPsCurrencies,
  collectPsGames,
  collectPsPaymentSystems,
  collectPsServices,
  filterPaymentServices,
  isPsFilterActive,
  sortPaymentServices,
  countPsFilters,
} from "../lib/filter";

const PAGE_SIZE = 10;

/** Колонки сортировки для мобильного ряда (на десктопе — заголовки таблицы). */
const SORT_OPTIONS: { key: PsSortKey; label: string }[] = [
  { key: "commission", label: "Комиссия" },
  { key: "platforms", label: "Сервисы и игры" },
  { key: "rating", label: "Рейтинг" },
];

interface PsExplorerProps {
  services: PaymentService[];
}

export const PsExplorer: FC<PsExplorerProps> = ({ services }) => {
  const [filter, setFilter] = useState<PsFilterState>(EMPTY_PS_FILTER);
  const [sort, setSort] = useState<PsSort | null>(null);
  const [page, setPage] = useState(1);

  const serviceOptions = useMemo(() => collectPsServices(services), [services]);
  const gameOptions = useMemo(() => collectPsGames(services), [services]);
  const paymentOptions = useMemo(() => collectPsPaymentSystems(services), [services]);
  const currencyOptions = useMemo(() => collectPsCurrencies(services), [services]);

  const filtered = useMemo(() => filterPaymentServices(services, filter), [services, filter]);
  const sorted = useMemo(() => sortPaymentServices(filtered, sort), [filtered, sort]);
  const active = isPsFilterActive(filter);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page],
  );

  // Любое изменение фильтра или сортировки возвращает на первую страницу.
  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  const handleSort = (key: PsSortKey) => setSort((prev) => nextSortState(prev, key));

  const reset = () => {
    setFilter(EMPTY_PS_FILTER);
    setSort(null);
  };

  return (
    <div className="grid gap-6 min-w-0">
      <FiltersBar
        activeCount={countPsFilters(filter)}
        canReset={active}
        onReset={reset}
        search={
          <SearchInput
            value={filter.search}
            onChange={(search) => setFilter((f) => ({ ...f, search }))}
            placeholder="Поиск по названию"
          />
        }
      >
        <MultiSelectFilter
          label="Сервисы"
          searchPlaceholder="Поиск сервиса"
          options={serviceOptions}
          selected={filter.services}
          onChange={(services) => setFilter((f) => ({ ...f, services }))}
          variant="icon"
        />
        <MultiSelectFilter
          label="Игры"
          searchPlaceholder="Поиск игры"
          options={gameOptions}
          selected={filter.games}
          onChange={(games) => setFilter((f) => ({ ...f, games }))}
          variant="icon"
        />
        <MultiSelectFilter
          label="Способ оплаты"
          searchPlaceholder="Поиск способа"
          options={paymentOptions}
          selected={filter.paymentSystems}
          onChange={(paymentSystems) => setFilter((f) => ({ ...f, paymentSystems }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter
          label="Валюты"
          searchPlaceholder="Поиск валюты"
          options={currencyOptions}
          selected={filter.currencies}
          onChange={(currencies) => setFilter((f) => ({ ...f, currencies }))}
          variant="code"
        />


      </FiltersBar>

      <SortChips options={SORT_OPTIONS} sort={sort} onSort={handleSort} />

      {sorted.length === 0 ? (
        <EmptyResult
          active={active}
          emptyText="В этом разделе пока нет сервисов"
          filteredText="По выбранным фильтрам сервисы не найдены"
          onReset={reset}
        />
      ) : (
        <PsList services={visible} sort={sort} onSort={handleSort} />
      )}

      {totalPages > 1 && (
        <LocalPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};
