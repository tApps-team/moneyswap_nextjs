import { parseNumeric } from "../../lib/numeric";
import { PaymentService, PaymentServicePlatform } from "../api/payment-service-dto";

/** Комиссия для таблицы: «От 3%» как есть, пусто — прочерк. */
export function formatCommission(service: PaymentService): string {
  if (service.commission) return service.commission;
  if (service.commission_from != null) return `от ${service.commission_from}%`;
  return "—";
}

/** Числовая комиссия для сортировки (падает обратно на разбор строки). */
export function getCommissionValue(service: PaymentService): number | null {
  return service.commission_from ?? parseNumeric(service.commission);
}

export function formatServiceRating(rating: number | null): string {
  return rating ? rating.toFixed(1) : "—";
}

/** Склонение «отзыв / отзыва / отзывов». */
export function formatReviewsCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} отзыв`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} отзыва`;
  return `${count} отзывов`;
}

export const isGamePlatform = (platform: PaymentServicePlatform) => platform.kind === "game";
export const isServicePlatform = (platform: PaymentServicePlatform) => platform.kind !== "game";
