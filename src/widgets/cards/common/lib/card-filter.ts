import {
  Bank,
  CARD_CATEGORY_OPTIONS,
  CardBonus,
  CardCategory,
  CardFeature,
  CardPaymentSystem,
  CreditCard,
  DebitCard,
} from "@/entities/strapi";
import { MultiSelectOption } from "@/shared/ui";

type AnyCard = DebitCard | CreditCard;

/** Базовый набор фильтров, общий для дебетовых и кредитных карт. */
export interface BaseCardFilterState {
  banks: number[];
  features: number[];
  bonuses: number[];
  paymentSystems: number[];
  categories: CardCategory[];
  search: string;
}

export const EMPTY_BASE_CARD_FILTER: BaseCardFilterState = {
  banks: [],
  features: [],
  bonuses: [],
  paymentSystems: [],
  categories: [],
  search: "",
};

const sortByTitle = <T extends { title: string }>(items: T[]) =>
  items.sort((a, b) => a.title.localeCompare(b.title, "ru"));

export function collectCardBanks(cards: AnyCard[]): MultiSelectOption[] {
  const map = new Map<number, Bank>();
  cards.forEach((card) => card.bank && map.set(card.bank.id, card.bank));
  return sortByTitle(Array.from(map.values())).map((bank) => ({
    id: bank.id,
    title: bank.title,
    icon: bank.logo ?? undefined,
  }));
}

export function collectCardFeatures(cards: AnyCard[]): MultiSelectOption[] {
  const map = new Map<number, CardFeature>();
  cards.forEach((card) => card.features.forEach((feature) => map.set(feature.id, feature)));
  return sortByTitle(Array.from(map.values())).map((feature) => ({
    id: feature.id,
    title: feature.title,
    icon: feature.icon ?? undefined,
  }));
}

export function collectCardBonuses(cards: AnyCard[]): MultiSelectOption[] {
  const map = new Map<number, CardBonus>();
  cards.forEach((card) => card.bonuses.forEach((bonus) => map.set(bonus.id, bonus)));
  return sortByTitle(Array.from(map.values())).map((bonus) => ({
    id: bonus.id,
    title: bonus.title,
    icon: bonus.icon ?? undefined,
  }));
}

export function collectCardPaymentSystems(cards: AnyCard[]): MultiSelectOption[] {
  const map = new Map<number, CardPaymentSystem>();
  cards.forEach((card) => card.payment_systems.forEach((system) => map.set(system.id, system)));
  return sortByTitle(Array.from(map.values())).map((system) => ({
    id: system.id,
    title: system.title,
    icon: system.icon ?? undefined,
  }));
}

/** Категории оставляем только те, что реально встречаются в выдаче. */
export function collectCardCategories(cards: AnyCard[]): MultiSelectOption<CardCategory>[] {
  const present = new Set(cards.map((card) => card.card_category).filter(Boolean));
  return CARD_CATEGORY_OPTIONS.filter((option) => present.has(option.id));
}

export function isBaseCardFilterActive(filter: BaseCardFilterState): boolean {
  return (
    filter.banks.length > 0 ||
    filter.features.length > 0 ||
    filter.bonuses.length > 0 ||
    filter.paymentSystems.length > 0 ||
    filter.categories.length > 0 ||
    filter.search.trim() !== ""
  );
}

/** Общая часть фильтрации: банк, особенности, бонусы, платёжная система, категория, поиск. */
export function matchesBaseCardFilter(card: AnyCard, filter: BaseCardFilterState): boolean {
  if (filter.banks.length > 0 && !(card.bank && filter.banks.includes(card.bank.id))) {
    return false;
  }

  // Особенности выбираются «и»: карта должна иметь все отмеченные.
  if (
    filter.features.length > 0 &&
    !filter.features.every((id) => card.features.some((feature) => feature.id === id))
  ) {
    return false;
  }

  if (
    filter.bonuses.length > 0 &&
    !card.bonuses.some((bonus) => filter.bonuses.includes(bonus.id))
  ) {
    return false;
  }

  if (
    filter.paymentSystems.length > 0 &&
    !card.payment_systems.some((system) => filter.paymentSystems.includes(system.id))
  ) {
    return false;
  }

  if (
    filter.categories.length > 0 &&
    !(card.card_category && filter.categories.includes(card.card_category))
  ) {
    return false;
  }

  const query = filter.search.trim().toLowerCase();
  if (query) {
    const haystack = `${card.name} ${card.bank?.title ?? ""}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  return true;
}

/** Сколько фильтров выбрано — для бейджа на кнопке «Фильтры» (поиск не считаем). */
export function countBaseCardFilters(filter: BaseCardFilterState): number {
  return (
    filter.banks.length +
    filter.features.length +
    filter.bonuses.length +
    filter.paymentSystems.length +
    filter.categories.length
  );
}
