import { DynamicContentItem } from "../../blog";

export type VcMarketType = "international" | "russian";

export type VcReviewRating = "positive" | "neutral" | "negative";

export interface VcPlatform {
  id: number;
  title: string;
  icon: string;
  slug: string;
}

export interface VcPaymentSystem {
  id: number;
  title: string;
  icon: string;
  slug: string;
}

export interface VcPromocode {
  title: string;
  icon: string;
  description: string;
  url: string;
}

export interface VcReview {
  id: number;
  username: string;
  rating: VcReviewRating;
  text: string;
  review_date?: string;
}

export interface VirtualCard {
  id: number;
  slug: string;
  name: string;
  url: string;
  market_type: VcMarketType;
  is_vip: boolean;
  logo: string;
  issuance_cost: number;
  maintenance_info: string;
  topup_commission: string;
  platforms: VcPlatform[];
  payment_systems: VcPaymentSystem[];
  countries: { id: number; title: string; icon: string; slug: string }[];
  currencies: { id: number; title: string; icon: string; code: string }[];
  promocodes: VcPromocode[];
  reviews: VcReview[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

export interface VcPage {
  title: string;
  header_content: DynamicContentItem[];
  footer_content: DynamicContentItem[];
}

export interface GetVcPageResponse {
  data: VcPage | null;
}

export interface GetVirtualCardsRequest {
  marketType: VcMarketType;
  page?: number;
  pageSize?: number;
  /** Отключает кэш Strapi-запроса (для динамических страниц). */
  noStore?: boolean;
}

export interface GetVirtualCardsResponse {
  data: VirtualCard[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface GetVirtualCardBySlugRequest {
  slug: string;
}

export interface GetVirtualCardBySlugResponse {
  data: VirtualCard | null;
}
