import { parseBigInteger, parseLastNumeric, parseNumeric } from "../../lib/numeric";
import { BankCredit } from "../api/bank-credit-dto";

/** Ставка числом для сортировки: «22,9–42,1%» → 22.9. */
export function getCreditRateValue(credit: BankCredit): number | null {
  return parseNumeric(credit.rate);
}

/** Максимальная сумма кредита числом. */
export function getCreditAmountValue(credit: BankCredit): number | null {
  return parseBigInteger(credit.amount_limits?.to) ?? parseLastNumeric(credit.amount);
}

/** Минимальная сумма кредита числом — для фильтра «сумма от». */
export function getCreditMinAmountValue(credit: BankCredit): number | null {
  return parseBigInteger(credit.amount_limits?.from) ?? parseNumeric(credit.amount);
}

export function getCreditTermValue(credit: BankCredit): number | null {
  return credit.term_months ?? null;
}

/** Группы срока — фильтр «Срок кредита». */
export type CreditTermBucket = "12" | "36" | "60" | "84" | "120";

export const CREDIT_TERM_OPTIONS: { id: CreditTermBucket; title: string }[] = [
  { id: "12", title: "до 1 года" },
  { id: "36", title: "до 3 лет" },
  { id: "60", title: "до 5 лет" },
  { id: "84", title: "до 7 лет" },
  { id: "120", title: "от 10 лет" },
];

/** Кредит подходит, если его максимальный срок покрывает выбранную группу. */
export function matchesCreditTerm(credit: BankCredit, buckets: CreditTermBucket[]): boolean {
  if (!buckets.length) return true;
  const months = getCreditTermValue(credit);
  if (months == null) return false;
  return buckets.some((bucket) => months >= Number(bucket));
}

export function formatCreditRating(rating: number | null): string {
  return rating ? rating.toFixed(1) : "—";
}
