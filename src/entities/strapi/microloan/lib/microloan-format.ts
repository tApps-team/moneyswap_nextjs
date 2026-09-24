import { parseBigInteger, parseNumeric } from "../../lib/numeric";
import {
  Microloan,
  MicroloanAmountType,
  MicroloanApproval,
  MicroloanDurationType,
  MicroloanFirstLoanType,
  MicroloanLimitType,
  MicroloanVerificationStatus,
} from "../api/microloan-dto";

const approvalMap: Record<MicroloanApproval, string> = {
  high: "Высокое",
  medium: "Среднее",
  low: "Низкое",
};

/**
 * Сноска к параметру «Одобрение».
 * ЧЕРНОВИК: заменить на согласованную формулировку, когда её пришлют.
 */
export const APPROVAL_HINT =
  "Уровень одобрения — примерная доля одобренных заявок по данным МФО: " +
  "высокое — больше 70%, среднее — 40–70%, низкое — меньше 40%. " +
  "Финальное решение всегда принимает МФО.";

const amountTypeMap: Record<MicroloanAmountType, string> = {
  to_30000: "До 30 000 ₽",
  to_50000: "До 50 000 ₽",
  to_100000: "До 100 000 ₽",
};

const firstLoanMap: Record<MicroloanFirstLoanType, string> = {
  zero_first_loan: "Первый займ под 0%",
  standard_rate: "Стандартная ставка",
  needs_verification: "Требует проверки",
};

const verificationMap: Record<MicroloanVerificationStatus, string> = {
  confirmed: "Условия подтверждены",
  manual_check: "Нужна ручная проверка",
};

const limitTypeMap: Record<MicroloanLimitType, string> = {
  small: "Небольшой лимит",
  medium: "Средний лимит",
  large: "Крупный лимит",
};

const durationTypeMap: Record<MicroloanDurationType, string> = {
  short: "Короткий срок",
  about_month: "Срок около месяца",
  long: "Долгий срок",
};

const toOptions = <T extends string>(map: Record<T, string>) =>
  (Object.keys(map) as T[]).map((id) => ({ id, title: map[id] }));

export const MICROLOAN_AMOUNT_OPTIONS = toOptions(amountTypeMap);
export const MICROLOAN_FIRST_LOAN_OPTIONS = toOptions(firstLoanMap);
export const MICROLOAN_VERIFICATION_OPTIONS = toOptions(verificationMap);
export const MICROLOAN_LIMIT_OPTIONS = toOptions(limitTypeMap);
export const MICROLOAN_DURATION_OPTIONS = toOptions(durationTypeMap);
export const MICROLOAN_APPROVAL_OPTIONS = toOptions(approvalMap);

export const formatApproval = (value: MicroloanApproval | null) =>
  value ? (approvalMap[value] ?? value) : "—";

export const formatLoanAmountType = (value: MicroloanAmountType | null) =>
  value ? (amountTypeMap[value] ?? value) : "—";

export const formatFirstLoanType = (value: MicroloanFirstLoanType | null) =>
  value ? (firstLoanMap[value] ?? value) : "—";

export const formatVerificationStatus = (value: MicroloanVerificationStatus | null) =>
  value ? (verificationMap[value] ?? value) : "—";

export const formatLimitType = (value: MicroloanLimitType | null) =>
  value ? (limitTypeMap[value] ?? value) : "—";

export const formatDurationType = (value: MicroloanDurationType | null) =>
  value ? (durationTypeMap[value] ?? value) : "—";

/**
 * Диапазон «от … до …» с единицей измерения в конце: «от 1 000 до 100 000 ₽».
 * Выводим ровно те границы, которые заданы, — половина МФО указывает только максимум.
 */
function formatRange(from: number | null, to: number | null, unit: string): string | null {
  const num = (value: number) => value.toLocaleString("ru-RU");
  if (from != null && to != null) return `от ${num(from)} до ${num(to)} ${unit}`;
  if (to != null) return `до ${num(to)} ${unit}`;
  if (from != null) return `от ${num(from)} ${unit}`;
  return null;
}

/** Лимит для таблицы: диапазон сумм из данных, иначе подпись группы. */
export function formatMicroloanLimit(loan: Microloan): string {
  const range = formatRange(
    parseBigInteger(loan.amount_limits?.from),
    parseBigInteger(loan.amount_limits?.to),
    "₽",
  );
  return range ?? formatLoanAmountType(loan.loan_amount_type);
}

/** Срок для таблицы: диапазон дней из данных. */
export function formatMicroloanTerm(loan: Microloan): string {
  return formatRange(loan.term_limits?.from ?? null, loan.term_limits?.to ?? null, "дн.") ?? "—";
}

export function getMicroloanLimitValue(loan: Microloan): number | null {
  return parseBigInteger(loan.amount_limits?.to);
}

export function getMicroloanRateValue(loan: Microloan): number | null {
  return parseNumeric(loan.rate);
}

export function getMicroloanTermValue(loan: Microloan): number | null {
  return loan.term_limits?.to ?? null;
}

export function formatMicroloanRating(rating: number | null): string {
  return rating ? rating.toFixed(1) : "—";
}
