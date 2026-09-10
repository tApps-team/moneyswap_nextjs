import { formatMoney, parseBigInteger, parseNumeric } from "../../lib/numeric";
import {
  Microloan,
  MicroloanAmountType,
  MicroloanApproval,
  MicroloanDurationType,
  MicroloanFirstLoanType,
  MicroloanLimitType,
  MicroloanTermType,
  MicroloanVerificationStatus,
} from "../api/microloan-dto";

const approvalMap: Record<MicroloanApproval, string> = {
  high: "Высокое",
  medium: "Среднее",
  low: "Низкое",
};

const amountTypeMap: Record<MicroloanAmountType, string> = {
  to_30000: "До 30 000 ₽",
  to_50000: "До 50 000 ₽",
  to_100000: "До 100 000 ₽",
};

const termTypeMap: Record<MicroloanTermType, string> = {
  to_30_days: "До 30 дней",
  to_35_days: "До 35 дней",
  to_180_days: "До 180 дней",
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
export const MICROLOAN_TERM_OPTIONS = toOptions(termTypeMap);
export const MICROLOAN_FIRST_LOAN_OPTIONS = toOptions(firstLoanMap);
export const MICROLOAN_VERIFICATION_OPTIONS = toOptions(verificationMap);
export const MICROLOAN_LIMIT_OPTIONS = toOptions(limitTypeMap);
export const MICROLOAN_DURATION_OPTIONS = toOptions(durationTypeMap);
export const MICROLOAN_APPROVAL_OPTIONS = toOptions(approvalMap);

export const formatApproval = (value: MicroloanApproval | null) =>
  value ? (approvalMap[value] ?? value) : "—";

export const formatLoanAmountType = (value: MicroloanAmountType | null) =>
  value ? (amountTypeMap[value] ?? value) : "—";

export const formatLoanTermType = (value: MicroloanTermType | null) =>
  value ? (termTypeMap[value] ?? value) : "—";

export const formatFirstLoanType = (value: MicroloanFirstLoanType | null) =>
  value ? (firstLoanMap[value] ?? value) : "—";

export const formatVerificationStatus = (value: MicroloanVerificationStatus | null) =>
  value ? (verificationMap[value] ?? value) : "—";

export const formatLimitType = (value: MicroloanLimitType | null) =>
  value ? (limitTypeMap[value] ?? value) : "—";

export const formatDurationType = (value: MicroloanDurationType | null) =>
  value ? (durationTypeMap[value] ?? value) : "—";

/** Лимит для таблицы: сумма из данных, иначе подпись группы. */
export function formatMicroloanLimit(loan: Microloan): string {
  const max = parseBigInteger(loan.amount_limits?.to);
  if (max != null) return `до ${formatMoney(max)}`;
  return formatLoanAmountType(loan.loan_amount_type);
}

/** Срок для таблицы: дни из данных, иначе подпись группы. */
export function formatMicroloanTerm(loan: Microloan): string {
  const max = loan.term_limits?.to;
  if (max != null) return `до ${max} дн.`;
  return formatLoanTermType(loan.loan_term_type);
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
