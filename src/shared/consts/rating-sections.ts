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

/**
 * Единый список разделов-рейтингов.
 * Используется в навбаре, футере и на странице-хабе /ratings,
 * чтобы порядок и названия разделов не расходились между местами.
 */
export const RATING_SECTIONS: RatingSection[] = [
  {
    key: "ved",
    href: routes.ved,
    title: "ВЭД",
    description: "Проверенные сервисы, проводящие международные платежи",
    icon: Globe,
  },
  {
    key: "virtual-cards",
    href: routes.virtual_cards,
    title: "Виртуальные карты",
    description: "Международные и российские карты для оплаты за рубежом",
    icon: CreditCard,
  },
  {
    key: "esim",
    href: routes.esim,
    title: "eSIM",
    description: "Подключение международных и российских виртуальных сим-карт",
    icon: Smartphone,
  },
  {
    key: "payment-services",
    href: routes.payment_services,
    title: "Оплата сервисов",
    description: "Сервисы для оплаты зарубежных подписок, игр и покупок",
    icon: Wallet,
  },
  {
    key: "debit-cards",
    href: routes.debit_cards,
    title: "Дебетовые карты",
    description: "Карты с кэшбэком, процентом на остаток и бесплатным обслуживанием",
    icon: WalletCards,
  },
  {
    key: "credit-cards",
    href: routes.credit_cards,
    title: "Кредитные карты",
    description: "Карты с льготным периодом и прозрачными условиями",
    icon: CreditCard,
  },
  {
    key: "credits",
    href: routes.credits,
    title: "Кредиты",
    description: "Предложения российских банков по потребительским кредитам",
    icon: Landmark,
  },
  {
    key: "microloans",
    href: routes.microloans,
    title: "Микрозаймы",
    description: "Надёжные МФО с быстрым одобрением и понятными условиями",
    icon: Coins,
  },
];
