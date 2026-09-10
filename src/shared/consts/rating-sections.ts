import {
  Coins,
  CreditCard,
  Globe,
  Landmark,
  LucideIcon,
  Smartphone,
  Wallet,
  WalletCards,
} from "lucide-react";
import { routes } from "../router";

/** Ключи разделов-рейтингов — совпадают с сегментом URL. */
export type RatingSectionKey =
  | "ved"
  | "virtual-cards"
  | "esim"
  | "payment-services"
  | "debit-cards"
  | "credit-cards"
  | "credits"
  | "microloans";

export interface RatingSection {
  key: RatingSectionKey;
  href: string;
  /** Короткое название раздела — для меню, карточек хаба и футера. */
  title: string;
  /** Фолбэк-описание: используется в меню и когда Strapi не отдал страницу раздела. */
  description: string;
  icon: LucideIcon;
}

/*
 * Форма совпадает с SiteSection (src/shared/consts/site-sections.ts) — там
 * рейтинги объединяются с разделами обмена. Отдельным остаётся ключ:
 * RatingSectionKey связан с исчерпывающим switch в getSectionPreviews
 * (src/features/rating-preview/api/section-previews.ts), поэтому разделы без
 * коллекции в Strapi сюда попадать не должны.
 */

/**
 * Единый список разделов-рейтингов.
 * Используется в навбаре, футере, на главной и на хабах групп,
 * чтобы порядок и названия разделов не расходились между местами.
 */
export const RATING_SECTIONS: RatingSection[] = [
  {
    key: "ved",
    href: routes.ved,
    title: "ВЭД",
    description: "Платёжные агенты для оплаты инвойсов и переводов за рубеж",
    icon: Globe,
  },
  {
    key: "virtual-cards",
    href: routes.virtual_cards,
    title: "Виртуальные карты",
    description: "Карты иностранных банков для оплаты зарубежных сервисов и покупок",
    icon: CreditCard,
  },
  {
    key: "esim",
    href: routes.esim,
    title: "eSIM",
    description: "Международные провайдеры мобильного интернета для поездок за рубеж",
    icon: Smartphone,
  },
  {
    key: "payment-services",
    href: routes.payment_services,
    title: "Оплата сервисов",
    description: "Список сервисов, которые помогают оплачивать зарубежные подписки и игры",
    icon: Wallet,
  },
  {
    key: "debit-cards",
    href: routes.debit_cards,
    title: "Дебетовые карты",
    description: "Рейтинг карт с кэшбэком, процентом на остаток и условиями обслуживания",
    icon: WalletCards,
  },
  {
    key: "credit-cards",
    href: routes.credit_cards,
    title: "Кредитные карты",
    description: "Предложения банков по кредитным картам с льготным периодом",
    icon: CreditCard,
  },
  {
    key: "credits",
    href: routes.credits,
    title: "Кредиты",
    description:
      "Рейтинг потребительских кредитов от банков с реальной ПСК и условиями досрочного погашения",
    icon: Landmark,
  },
  {
    key: "microloans",
    href: routes.microloans,
    title: "Займы",
    description: "Займы онлайн в проверенных МФО: лимиты, сроки и полная стоимость",
    icon: Coins,
  },
];
