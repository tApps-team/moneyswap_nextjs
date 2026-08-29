"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { MfoList } from "@/widgets/microloans/mfo-list";
import {
  MICROLOAN_AMOUNT_OPTIONS,
  MICROLOAN_DURATION_OPTIONS,
  MICROLOAN_FIRST_LOAN_OPTIONS,
  MICROLOAN_LIMIT_OPTIONS,
  MICROLOAN_TERM_OPTIONS,
  MICROLOAN_VERIFICATION_OPTIONS,
  Microloan,
  MicroloanAmountType,
  MicroloanDurationType,
  MicroloanFirstLoanType,
  MicroloanLimitType,
  MicroloanTermType,
  MicroloanVerificationStatus,
} from "@/entities/strapi";
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
  EMPTY_MFO_FILTER,
  MfoFilterState,
  MfoSort,
  MfoSortKey,
  collectMfoChannels,
  filterMicroloans,
  isMfoFilterActive,
  keepPresent,
  sortMicroloans,
  countMfoFilters,
} from "../lib/filter";

const PAGE_SIZE = 10;

/** Колонки сортировки для мобильного ряда (на десктопе — заголовки таблицы). */
const SORT_OPTIONS: { key: MfoSortKey; label: string }[] = [
  { key: "rate", label: "Ставка" },
  { key: "limit", label: "Лимит" },
  { key: "term", label: "Срок" },
  { key: "rating", label: "Рейтинг" },
];

interface MfoExplorerProps {
  loans: Microloan[];
}

export const MfoExplorer: FC<MfoExplorerProps> = ({ loans }) => {
  const [filter, setFilter] = useState<MfoFilterState>(EMPTY_MFO_FILTER);
  const [sort, setSort] = useState<MfoSort | null>(null);
  const [page, setPage] = useState(1);

  const channelOptions = useMemo(() => collectMfoChannels(loans), [loans]);
  const amountOptions = useMemo(
    () => keepPresent(MICROLOAN_AMOUNT_OPTIONS, loans.map((loan) => loan.loan_amount_type)),
    [loans],
  );
  const termOptions = useMemo(
    () => keepPresent(MICROLOAN_TERM_OPTIONS, loans.map((loan) => loan.loan_term_type)),
    [loans],
  );
  const firstLoanOptions = useMemo(
    () => keepPresent(MICROLOAN_FIRST_LOAN_OPTIONS, loans.map((loan) => loan.first_loan_type)),
    [loans],
  );
  const verificationOptions = useMemo(
    () =>
      keepPresent(MICROLOAN_VERIFICATION_OPTIONS, loans.map((loan) => loan.verification_status)),
    [loans],
  );
  const limitOptions = useMemo(
    () => keepPresent(MICROLOAN_LIMIT_OPTIONS, loans.map((loan) => loan.loan_limit_type)),
    [loans],
  );
  const durationOptions = useMemo(
    () => keepPresent(MICROLOAN_DURATION_OPTIONS, loans.map((loan) => loan.loan_duration_type)),
    [loans],
  );

  const filtered = useMemo(() => filterMicroloans(loans, filter), [loans, filter]);
  const sorted = useMemo(() => sortMicroloans(filtered, sort), [filtered, sort]);
  const active = isMfoFilterActive(filter);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page],
  );

  // Любое изменение фильтра или сортировки возвращает на первую страницу.
  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  const handleSort = (key: MfoSortKey) => setSort((prev) => nextSortState(prev, key));

  const reset = () => {
    setFilter(EMPTY_MFO_FILTER);
    setSort(null);
  };

  return (
    <div className="grid gap-6 min-w-0">
      <FiltersBar
        activeCount={countMfoFilters(filter)}
        canReset={active}
        onReset={reset}
        search={
          <SearchInput
            value={filter.search}
            onChange={(search) => setFilter((f) => ({ ...f, search }))}
            placeholder="Поиск по названию МФО"
          />
        }
      >
        <MultiSelectFilter<MicroloanAmountType>
          label="Сумма займа"
          options={amountOptions}
          selected={filter.amounts}
          onChange={(amounts) => setFilter((f) => ({ ...f, amounts }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter<MicroloanTermType>
          label="Срок займа"
          options={termOptions}
          selected={filter.terms}
          onChange={(terms) => setFilter((f) => ({ ...f, terms }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter<MicroloanFirstLoanType>
          label="Первый займ"
          options={firstLoanOptions}
          selected={filter.firstLoan}
          onChange={(firstLoan) => setFilter((f) => ({ ...f, firstLoan }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter
          label="Получение денег"
          options={channelOptions}
          selected={filter.channels}
          onChange={(channels) => setFilter((f) => ({ ...f, channels }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter<MicroloanLimitType>
          label="Тип лимита"
          options={limitOptions}
          selected={filter.limitTypes}
          onChange={(limitTypes) => setFilter((f) => ({ ...f, limitTypes }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter<MicroloanDurationType>
          label="Тип срока"
          options={durationOptions}
          selected={filter.durationTypes}
          onChange={(durationTypes) => setFilter((f) => ({ ...f, durationTypes }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter<MicroloanVerificationStatus>
          label="Проверка условий"
          options={verificationOptions}
          selected={filter.verification}
          onChange={(verification) => setFilter((f) => ({ ...f, verification }))}
          variant="icon"
          searchable={false}
        />


      </FiltersBar>

      <SortChips options={SORT_OPTIONS} sort={sort} onSort={handleSort} />

      {sorted.length === 0 ? (
        <EmptyResult
          active={active}
          emptyText="В этом разделе пока нет предложений"
          filteredText="По выбранным фильтрам займы не найдены"
          onReset={reset}
        />
      ) : (
        <MfoList loans={visible} sort={sort} onSort={handleSort} />
      )}

      {totalPages > 1 && (
        <LocalPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};
