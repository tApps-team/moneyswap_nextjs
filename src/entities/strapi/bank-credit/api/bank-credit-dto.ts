import { DynamicContentItem } from "../../blog";
import { Bank } from "../../cards";

export interface BankCredit {
  id: number;
  slug: string;
  /** Название продукта: «Наличными», «Прогресс». */
  name: string;
  url: string;
  is_vip: boolean;
  logo: string | null;
  bank: Bank | null;
  description: string | null;
  /** Полная стоимость кредита: «22,892–42,090%». */
  psk: string | null;
  /** Ставка: «22,9–42,1%», «от 14,9%». */
  rate: string | null;
  /** Сумма: «50 000 – 5 000 000 ₽». */
  amount: string | null;
  /** biginteger из Strapi приходит строкой. */
  amount_limits: { from: string | number | null; to: string | number | null };
  /** Срок: «до 5 лет». */
  term: string | null;
  term_months: number | null;
  rating: number | null;
  reviews_count: number;
  about?: DynamicContentItem[];
  publishedAt?: string;
}

export interface BankCreditPage {
  title: string;
  header_content: DynamicContentItem[];
  footer_content: DynamicContentItem[];
}

export interface GetBankCreditPageResponse {
  data: BankCreditPage | null;
}

export interface GetBankCreditsRequest {
  page?: number;
  pageSize?: number;
}

export interface GetBankCreditsResponse {
  data: BankCredit[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface GetBankCreditBySlugRequest {
  slug: string;
}

export interface GetBankCreditBySlugResponse {
  data: BankCredit | null;
}
