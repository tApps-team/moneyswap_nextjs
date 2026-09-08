import { DynamicContentItem } from "../../blog";

export type CardCategory = "classic" | "electronic" | "gold" | "premium" | "virtual";

export interface Bank {
  id: number;
  title: string;
  slug: string;
  logo: string | null;
}

export interface CardFeature {
  id: number;
  title: string;
  icon: string | null;
  slug: string;
}

export interface CardBonus {
  id: number;
  title: string;
  icon: string | null;
  slug: string;
}

export interface CardPaymentSystem {
  id: number;
  title: string;
  icon: string | null;
  slug: string;
}

/** Общая часть дебетовой и кредитной карты. */
interface BaseCard {
  id: number;
  slug: string;
  name: string;
  url: string;
  is_vip: boolean;
  logo: string | null;
  bank: Bank | null;
  /** Стоимость обслуживания: «Бесплатно», «от 0 до 1 188 ₽ в год». */
  service_cost: string | null;
  cashback: string | null;
  cashback_description: string | null;
  card_category: CardCategory | null;
  city: string | null;
  rating: number | null;
  reviews_count: number;
  features: CardFeature[];
  bonuses: CardBonus[];
  payment_systems: CardPaymentSystem[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

export interface DebitCard extends BaseCard {
  /** Лимит переводов: «до 500 000 ₽/мес», «без комиссии». */
  transfer_limit: string | null;
  percent_on_balance: string | null;
}

export interface CreditCard extends BaseCard {
  /** Льготный период: «120 дней». */
  grace_period: string | null;
  grace_period_days: number | null;
  /** Кредитный лимит: «до 1 000 000 ₽». */
  credit_limit: string | null;
  /** biginteger из Strapi приходит строкой. */
  credit_limit_value: string | number | null;
  rate: string | null;
}

export interface CardsPage {
  title: string;
  header_content: DynamicContentItem[];
  footer_content: DynamicContentItem[];
}

export interface GetCardsPageResponse {
  data: CardsPage | null;
}

export interface GetCardsRequest {
  page?: number;
  pageSize?: number;
}

export interface GetCardsResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface GetCardBySlugRequest {
  slug: string;
}

export interface GetCardBySlugResponse<T> {
  data: T | null;
}
