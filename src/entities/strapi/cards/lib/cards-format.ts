import { parseBigInteger, parseLastNumeric, parseNumeric } from "../../lib/numeric";
import { CardCategory, CreditCard, DebitCard } from "../api/cards-dto";

const cardCategoryMap: Record<CardCategory, string> = {
  classic: "Классическая",
  electronic: "Электронная",
  gold: "Золотая",
  premium: "Премиальная",
  virtual: "Виртуальная",
};

export const CARD_CATEGORY_OPTIONS: { id: CardCategory; title: string }[] = (
  Object.keys(cardCategoryMap) as CardCategory[]
).map((id) => ({ id, title: cardCategoryMap[id] }));

export function formatCardCategory(category: CardCategory | null): string {
  return category ? (cardCategoryMap[category] ?? category) : "—";
}

/** Кэшбэк в процентах для сортировки: «до 16.5%» → 16.5. */
export function getCashbackValue(card: DebitCard | CreditCard): number | null {
  return parseNumeric(card.cashback);
}

/** Процент на остаток: «Нет» и «—» считаем отсутствующим значением. */
export function getPercentOnBalanceValue(card: DebitCard): number | null {
  if (!card.percent_on_balance || /^нет$/i.test(card.percent_on_balance.trim())) return null;
  return parseNumeric(card.percent_on_balance);
}

/** Кредитный лимит числом: сначала явное поле, потом разбор строки. */
export function getCreditLimitValue(card: CreditCard): number | null {
  return parseBigInteger(card.credit_limit_value) ?? parseLastNumeric(card.credit_limit);
}

/** Ставка по кредитке: «29.9%–61.9%» → 29.9 (нижняя граница). */
export function getCardRateValue(card: CreditCard): number | null {
  return parseNumeric(card.rate);
}

/** Стоимость обслуживания числом: «Бесплатно» → 0. */
export function getServiceCostValue(card: DebitCard | CreditCard): number | null {
  if (!card.service_cost) return null;
  if (/бесплатн/i.test(card.service_cost)) return 0;
  return parseNumeric(card.service_cost);
}

/** Группы льготного периода — как фильтр у конкурента. */
export type GracePeriodBucket = "30" | "60" | "90" | "120" | "180";

export const GRACE_PERIOD_OPTIONS: { id: GracePeriodBucket; title: string }[] = [
  { id: "30", title: "от 30 дней" },
  { id: "60", title: "от 60 дней" },
  { id: "90", title: "от 90 дней" },
  { id: "120", title: "от 120 дней" },
  { id: "180", title: "от 180 дней" },
];

/** Карта попадает в группу, если её грейс не меньше порога. */
export function matchesGracePeriod(card: CreditCard, buckets: GracePeriodBucket[]): boolean {
  if (!buckets.length) return true;
  const days = card.grace_period_days ?? parseNumeric(card.grace_period);
  if (days == null) return false;
  return buckets.some((bucket) => days >= Number(bucket));
}

export function formatCardRating(rating: number | null): string {
  return rating ? rating.toFixed(1) : "—";
}
