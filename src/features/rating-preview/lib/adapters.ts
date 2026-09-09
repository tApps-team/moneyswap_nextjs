import { TopExchanger } from "@/entities/exchanger";
import {
  BankCredit,
  CreditCard,
  DebitCard,
  Esim,
  Microloan,
  PaymentService,
  VedAgent,
  VirtualCard,
  formatApproval,
  formatCommission,
  formatEsimPrice,
  formatEsimValidityPeriod,
  formatEsimVolume,
  formatMicroloanLimit,
  formatMicroloanTerm,
  formatVedLimit,
  getEsimRating,
  getVcRating,
  getVedAgentRating,
  orDash,
} from "@/entities/strapi";
import { routes } from "@/shared/router";
import { PreviewField, PreviewTag, RatingPreview } from "../model/types";

/*
 * Адаптеры сущность → RatingPreview.
 *
 * Набор показателей повторяет колонки таблицы соответствующего раздела, чтобы
 * карточка на главной и строка в списке агентов говорили об агенте одно и то же.
 * Форматирование не дублируем: берём те же хелперы, что и страницы разделов.
 */

/** Пустые значения выкидываем: строка «Ставка —» занимает место и ничего не сообщает. */
const filled = (fields: PreviewField[]): PreviewField[] =>
  fields.filter((field) => field.value && field.value !== "—");

const toTags = (
  items: { id: number; title: string; icon?: string | null }[] | undefined,
): PreviewTag[] | undefined =>
  items?.length ? items.map(({ id, title, icon }) => ({ id, title, icon })) : undefined;

/**
 * Коды валют одной строкой: длинный перечень всё равно обрежется по высоте
 * и закончится висящей запятой, поэтому хвост сворачиваем в «+N».
 */
const joinCodes = (items: { code: string }[] | undefined, max = 3): string => {
  if (!items?.length) return "";
  const codes = items.map((item) => item.code).filter(Boolean);
  if (codes.length <= max) return codes.join(", ");
  return `${codes.slice(0, max).join(", ")} +${codes.length - max}`;
};

export const toVedPreview = (agent: VedAgent): RatingPreview => {
  const { ratingValue, reviewCount } = getVedAgentRating(agent.reviews);

  return {
    id: `ved:${agent.slug}`,
    sectionKey: "ved",
    name: agent.name,
    logo: agent.logo,
    href: `${routes.ved_agents}/${agent.slug}`,
    isVip: agent.is_vip,
    rating: reviewCount > 0 ? ratingValue : null,
    reviewsCount: reviewCount,
    fields: filled([
      { label: "Комиссия", value: `от ${agent.commission}%` },
      { label: "Лимит от", value: formatVedLimit(agent.limits?.from) },
      { label: "Лимит до", value: formatVedLimit(agent.limits?.to) },
      { label: "Валюты", value: joinCodes(agent.currencies) },
    ]),
    tags: toTags(agent.countries),
    tagsLabel: "Страны",
  };
};

export const toVirtualCardPreview = (card: VirtualCard): RatingPreview => {
  const { ratingValue, reviewCount } = getVcRating(card.reviews);

  return {
    id: `virtual-cards:${card.slug}`,
    sectionKey: "virtual-cards",
    name: card.name,
    logo: card.logo,
    href: `${routes.vc_cards}/${card.slug}`,
    isVip: card.is_vip,
    rating: reviewCount > 0 ? ratingValue : null,
    reviewsCount: reviewCount,
    fields: filled([
      { label: "Выпуск", value: card.issuance_cost ? `от ${card.issuance_cost} ₽` : "" },
      { label: "Пополнение", value: orDash(card.topup_commission) },
      { label: "Обслуживание", value: orDash(card.maintenance_info) },
    ]),
    tags: toTags(card.platforms),
    tagsLabel: "Сервисы",
  };
};

export const toEsimPreview = (esim: Esim): RatingPreview => {
  const { ratingValue, reviewCount } = getEsimRating(esim.reviews);

  return {
    id: `esim:${esim.slug}`,
    sectionKey: "esim",
    name: esim.name,
    logo: esim.logo,
    href: `${routes.esim}/${esim.slug}`,
    isVip: esim.is_vip,
    rating: esim.rating ?? (reviewCount > 0 ? ratingValue : null),
    reviewsCount: reviewCount,
    fields: filled([
      {
        label: "Цена за ГБ",
        value: esim.connection_price ? formatEsimPrice(esim.connection_price) : "",
      },
      { label: "Объём", value: esim.internet_volume ? formatEsimVolume(esim.internet_volume) : "" },
      {
        label: "Срок",
        value: esim.validity_period ? formatEsimValidityPeriod(esim.validity_period) : "",
      },
    ]),
    tags: toTags(esim.countries),
    tagsLabel: "Страны",
  };
};

export const toPaymentServicePreview = (service: PaymentService): RatingPreview => ({
  id: `payment-services:${service.slug}`,
  sectionKey: "payment-services",
  name: service.name,
  logo: service.logo,
  href: `${routes.payment_services}/${service.slug}`,
  isVip: service.is_vip,
  rating: service.rating,
  reviewsCount: service.reviews_count,
  fields: filled([
    { label: "Комиссия", value: formatCommission(service) },
    {
      label: "Сервисы и игры",
      value: service.platforms?.length ? String(service.platforms.length) : "",
    },
    { label: "Валюты", value: joinCodes(service.currencies) },
  ]),
  tags: toTags(service.payment_systems),
  tagsLabel: "Способы оплаты",
});

export const toDebitCardPreview = (card: DebitCard): RatingPreview => ({
  id: `debit-cards:${card.slug}`,
  sectionKey: "debit-cards",
  name: card.name,
  subtitle: card.bank?.title,
  logo: card.logo ?? card.bank?.logo ?? null,
  href: `${routes.debit_cards}/${card.slug}`,
  isVip: card.is_vip,
  rating: card.rating,
  reviewsCount: card.reviews_count,
  fields: filled([
    { label: "Кэшбэк", value: orDash(card.cashback) },
    { label: "% на остаток", value: orDash(card.percent_on_balance) },
    { label: "Обслуживание", value: orDash(card.service_cost) },
    { label: "Лимит переводов", value: orDash(card.transfer_limit) },
  ]),
  tags: toTags(card.payment_systems),
  tagsLabel: "Платёжные системы",
});

export const toCreditCardPreview = (card: CreditCard): RatingPreview => ({
  id: `credit-cards:${card.slug}`,
  sectionKey: "credit-cards",
  name: card.name,
  subtitle: card.bank?.title,
  logo: card.logo ?? card.bank?.logo ?? null,
  href: `${routes.credit_cards}/${card.slug}`,
  isVip: card.is_vip,
  rating: card.rating,
  reviewsCount: card.reviews_count,
  fields: filled([
    { label: "Льготный период", value: orDash(card.grace_period) },
    { label: "Ставка", value: orDash(card.rate) },
    { label: "Кредитный лимит", value: orDash(card.credit_limit) },
    { label: "Обслуживание", value: orDash(card.service_cost) },
  ]),
  tags: toTags(card.payment_systems),
  tagsLabel: "Платёжные системы",
});

export const toBankCreditPreview = (credit: BankCredit): RatingPreview => ({
  id: `credits:${credit.slug}`,
  sectionKey: "credits",
  name: credit.name,
  subtitle: credit.bank?.title,
  logo: credit.logo ?? credit.bank?.logo ?? null,
  href: `${routes.credits}/${credit.slug}`,
  isVip: credit.is_vip,
  rating: credit.rating,
  reviewsCount: credit.reviews_count,
  fields: filled([
    { label: "Ставка", value: orDash(credit.rate) },
    { label: "ПСК", value: orDash(credit.psk) },
    { label: "Сумма", value: orDash(credit.amount) },
    { label: "Срок", value: orDash(credit.term) },
  ]),
});

export const toMicroloanPreview = (loan: Microloan): RatingPreview => ({
  id: `microloans:${loan.slug}`,
  sectionKey: "microloans",
  name: loan.name,
  logo: loan.logo,
  href: `${routes.microloans}/${loan.slug}`,
  isVip: loan.is_vip,
  rating: loan.rating,
  reviewsCount: loan.reviews_count,
  fields: filled([
    { label: "Ставка в день", value: orDash(loan.rate) },
    { label: "Лимит", value: formatMicroloanLimit(loan) },
    { label: "Срок займа", value: formatMicroloanTerm(loan) },
    { label: "Одобрение", value: formatApproval(loan.approval) },
  ]),
  tags: toTags(loan.issue_channels),
  tagsLabel: "Получение денег",
});

/** Обменники приходят не из Strapi, а из основного API. */
export const toExchangerPreview = (exchanger: TopExchanger): RatingPreview => {
  const { positive, neutral, negative } = exchanger.reviewCount ?? {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  return {
    id: `exchangers:${exchanger.id}`,
    entityId: exchanger.id,
    sectionKey: "exchangers",
    name: exchanger.name,
    logo: exchanger.iconUrl,
    href: `${routes.exchangers}/exchanger-${exchanger.id}`,
    isVip: false,
    rating: null,
    reviewsCount: positive + neutral + negative,
    // Направления и резервы приезжают отдельным запросом — см. ExchangerStats
    fields: filled([
      { label: "Положительных", value: String(positive) },
      { label: "Отрицательных", value: String(negative) },
    ]),
  };
};
