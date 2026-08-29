"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { CreditsList } from "@/widgets/credits/credits-list";
import { BankCredit, CREDIT_TERM_OPTIONS, CreditTermBucket } from "@/entities/strapi";
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
  CreditsFilterState,
  CreditsSort,
  CreditsSortKey,
  EMPTY_CREDITS_FILTER,
  collectCreditBanks,
  filterCredits,
  isCreditsFilterActive,
  sortCredits,
  countCreditsFilters,
} from "../lib/filter";

const PAGE_SIZE = 10;

/** Колонки сортировки для мобильного ряда (на десктопе — заголовки таблицы). */
const SORT_OPTIONS: { key: CreditsSortKey; label: string }[] = [
  { key: "rate", label: "Ставка" },
  { key: "amount", label: "Сумма" },
  { key: "term", label: "Срок" },
  { key: "rating", label: "Рейтинг" },
];

interface CreditsExplorerProps {
  credits: BankCredit[];
}

export const CreditsExplorer: FC<CreditsExplorerProps> = ({ credits }) => {
  const [filter, setFilter] = useState<CreditsFilterState>(EMPTY_CREDITS_FILTER);
  const [sort, setSort] = useState<CreditsSort | null>(null);
  const [page, setPage] = useState(1);

  const bankOptions = useMemo(() => collectCreditBanks(credits), [credits]);

  const filtered = useMemo(() => filterCredits(credits, filter), [credits, filter]);
  const sorted = useMemo(() => sortCredits(filtered, sort), [filtered, sort]);
  const active = isCreditsFilterActive(filter);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page],
  );

  // Любое изменение фильтра или сортировки возвращает на первую страницу.
  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  const handleSort = (key: CreditsSortKey) => setSort((prev) => nextSortState(prev, key));

  const reset = () => {
    setFilter(EMPTY_CREDITS_FILTER);
    setSort(null);
  };

  return (
    <div className="grid gap-6 min-w-0">
      <FiltersBar
        activeCount={countCreditsFilters(filter)}
        canReset={active}
        onReset={reset}
        search={
          <SearchInput
            value={filter.search}
            onChange={(search) => setFilter((f) => ({ ...f, search }))}
            placeholder="Поиск по банку или продукту"
          />
        }
      >
        <MultiSelectFilter
          label="Банк"
          searchPlaceholder="Поиск банка"
          options={bankOptions}
          selected={filter.banks}
          onChange={(banks) => setFilter((f) => ({ ...f, banks }))}
          variant="icon"
        />
        <MultiSelectFilter<CreditTermBucket>
          label="Срок кредита"
          options={CREDIT_TERM_OPTIONS}
          selected={filter.terms}
          onChange={(terms) => setFilter((f) => ({ ...f, terms }))}
          variant="icon"
          searchable={false}
        />

        <div className="flex items-center h-12 w-full md:w-auto lg:min-w-[240px] px-4 rounded-[14px] border border-new-grey/60 bg-new-dark-grey transition-colors focus-within:border-new-light-grey">
          <input
            inputMode="numeric"
            value={filter.minAmount}
            onChange={(e) =>
              setFilter((f) => ({ ...f, minAmount: e.target.value.replace(/[^\d]/g, "") }))
            }
            placeholder="Нужная сумма, ₽"
            className="w-full min-w-0 bg-transparent text-base lg:text-sm text-white placeholder:text-light-gray outline-none"
          />
        </div>


      </FiltersBar>

      <SortChips options={SORT_OPTIONS} sort={sort} onSort={handleSort} />

      {sorted.length === 0 ? (
        <EmptyResult
          active={active}
          emptyText="В этом разделе пока нет предложений"
          filteredText="По выбранным фильтрам кредиты не найдены"
          onReset={reset}
        />
      ) : (
        <CreditsList credits={visible} sort={sort} onSort={handleSort} />
      )}

      {totalPages > 1 && (
        <LocalPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};
