import { DynamicContentItem } from "../../blog";

/** Сервисы и игры, которые умеет оплачивать посредник (коллекция vc-platform). */
export type PaymentServicePlatformKind = "service" | "game";

export interface PaymentServicePlatform {
  id: number;
  title: string;
  slug: string;
  kind: PaymentServicePlatformKind | null;
  icon: string | null;
}

export interface PaymentServiceMethod {
  id: number;
  title: string;
  icon: string | null;
  slug: string;
}

export interface PaymentServiceCurrency {
  id: number;
  title: string;
  icon: string | null;
  code: string;
}

/** Регион аккаунта, через который сервис оплачивает (коллекция ved-country). */
export interface PaymentServiceCountry {
  id: number;
  title: string;
  icon: string | null;
  slug: string;
}

export interface PaymentServicePromocode {
  title: string;
  icon: string | null;
  description: string | null;
  url: string | null;
}

export interface PaymentService {
  id: number;
  slug: string;
  name: string;
  url: string;
  is_vip: boolean;
  logo: string | null;
  description: string | null;
  /** Человекочитаемая комиссия: «От 3%», «До 5%», «11%». */
  commission: string | null;
  /** Числовое значение комиссии — для сортировки. */
  commission_from: number | null;
  rating: number | null;
  reviews_count: number;
  payment_systems: PaymentServiceMethod[];
  currencies: PaymentServiceCurrency[];
  /**
   * Опционально намеренно: поле появилось в Strapi позже фронта, и до деплоя
   * бэкенда его в ответе нет. Везде читаем через `?? []`.
   */
  countries?: PaymentServiceCountry[];
  platforms: PaymentServicePlatform[];
  promocodes: PaymentServicePromocode[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

export interface PaymentServicePage {
  title: string;
  header_content: DynamicContentItem[];
  footer_content: DynamicContentItem[];
}

export interface GetPaymentServicePageResponse {
  data: PaymentServicePage | null;
}

export interface GetPaymentServicesRequest {
  page?: number;
  pageSize?: number;
}

export interface GetPaymentServicesResponse {
  data: PaymentService[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface GetPaymentServiceBySlugRequest {
  slug: string;
}

export interface GetPaymentServiceBySlugResponse {
  data: PaymentService | null;
}
