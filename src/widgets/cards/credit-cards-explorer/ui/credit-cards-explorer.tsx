"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { CreditCardsList } from "@/widgets/cards/credit-cards-list";
import {
  CardCategory,
  CreditCard,
  GRACE_PERIOD_OPTIONS,
  GracePeriodBucket,
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
  collectCardBanks,
  collectCardBonuses,
  collectCardCategories,
  collectCardFeatures,
  collectCardPaymentSystems,
} from "../../common/lib/card-filter";
import {
  CreditCardFilterState,
  CreditCardSort,
  CreditCardSortKey,
  EMPTY_CREDIT_CARD_FILTER,
  filterCreditCards,
  isCreditCardFilterActive,
  sortCreditCards,
  countCreditCardFilters,
} from "../lib/filter";

const PAGE_SIZE = 10;

/** Колонки сортировки для мобильного ряда (на десктопе — заголовки таблицы). */
const SORT_OPTIONS: { key: CreditCardSortKey; label: string }[] = [
  { key: "grace", label: "Льготный период" },
  { key: "limit", label: "Кредитный лимит" },
  { key: "rate", label: "Ставка" },
  { key: "service", label: "Обслуживание" },
  { key: "rating", label: "Рейтинг" },
];

interface CreditCardsExplorerProps {
  cards: CreditCard[];
}

export const CreditCardsExplorer: FC<CreditCardsExplorerProps> = ({ cards }) => {
  const [filter, setFilter] = useState<CreditCardFilterState>(EMPTY_CREDIT_CARD_FILTER);
  const [sort, setSort] = useState<CreditCardSort | null>(null);
  const [page, setPage] = useState(1);

  const bankOptions = useMemo(() => collectCardBanks(cards), [cards]);
  const featureOptions = useMemo(() => collectCardFeatures(cards), [cards]);
  const bonusOptions = useMemo(() => collectCardBonuses(cards), [cards]);
  const paymentOptions = useMemo(() => collectCardPaymentSystems(cards), [cards]);
  const categoryOptions = useMemo(() => collectCardCategories(cards), [cards]);

  const filtered = useMemo(() => filterCreditCards(cards, filter), [cards, filter]);
  const sorted = useMemo(() => sortCreditCards(filtered, sort), [filtered, sort]);
  const active = isCreditCardFilterActive(filter);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page],
  );

  // Любое изменение фильтра или сортировки возвращает на первую страницу.
  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  const handleSort = (key: CreditCardSortKey) => setSort((prev) => nextSortState(prev, key));

  const reset = () => {
    setFilter(EMPTY_CREDIT_CARD_FILTER);
    setSort(null);
  };

  return (
    <div className="grid gap-6 min-w-0">
      <FiltersBar
        activeCount={countCreditCardFilters(filter)}
        canReset={active}
        onReset={reset}
        search={
          <SearchInput
            value={filter.search}
            onChange={(search) => setFilter((f) => ({ ...f, search }))}
            placeholder="Поиск по названию или банку"
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
        <MultiSelectFilter<GracePeriodBucket>
          label="Льготный период"
          options={GRACE_PERIOD_OPTIONS}
          selected={filter.gracePeriods}
          onChange={(gracePeriods) => setFilter((f) => ({ ...f, gracePeriods }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter
          label="Особенности"
          searchPlaceholder="Поиск особенности"
          options={featureOptions}
          selected={filter.features}
          onChange={(features) => setFilter((f) => ({ ...f, features }))}
          variant="icon"
        />
        <MultiSelectFilter
          label="Бонусы"
          options={bonusOptions}
          selected={filter.bonuses}
          onChange={(bonuses) => setFilter((f) => ({ ...f, bonuses }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter
          label="Платёжная система"
          options={paymentOptions}
          selected={filter.paymentSystems}
          onChange={(paymentSystems) => setFilter((f) => ({ ...f, paymentSystems }))}
          variant="icon"
          searchable={false}
        />
        <MultiSelectFilter<CardCategory>
          label="Категория карты"
          options={categoryOptions}
          selected={filter.categories}
          onChange={(categories) => setFilter((f) => ({ ...f, categories }))}
          variant="icon"
          searchable={false}
        />


      </FiltersBar>

      <SortChips options={SORT_OPTIONS} sort={sort} onSort={handleSort} />

      {sorted.length === 0 ? (
        <EmptyResult
          active={active}
          emptyText="В этом разделе пока нет карт"
          filteredText="По выбранным фильтрам карты не найдены"
          onReset={reset}
        />
      ) : (
        <CreditCardsList cards={visible} sort={sort} onSort={handleSort} />
      )}

      {totalPages > 1 && (
        <LocalPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};
