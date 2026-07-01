import { DynamicContentItem } from "../../blog";

export type EsimMarketType = "international" | "russian";

export type EsimReviewRating = "positive" | "neutral" | "negative";

export type EsimValidityPeriod = "from_1_day" | string;

export type EsimInternetSharing = "with_sharing" | "without_sharing" | string;

export type EsimCalls = "with_calls" | "without_calls" | string;

export type EsimTopUp = "with_top_up" | "without_top_up" | string;

export interface EsimLabel {
  id: number;
  title: string;
  icon: string;
  slug: string;
}

export interface EsimCountry {
  id: number;
  title: string;
  icon: string;
  slug: string;
}

export interface EsimPaymentSystem {
  id: number;
  title: string;
  icon: string;
  slug: string;
}

export interface EsimReview {
  id: number;
  username: string;
  rating: EsimReviewRating;
  text: string;
  review_date?: string;
}

export interface EsimPromocode {
  title: string;
  icon: string;
  description: string;
  url: string;
}

export interface Esim {
  id: number;
  slug: string;
  name: string;
  url: string;
  market_type: EsimMarketType;
  is_vip: boolean;
  logo: string | null;
  connection_price: number;
  internet_volume: number;
  validity_period: EsimValidityPeriod;
  internet_sharing: EsimInternetSharing;
  calls: EsimCalls;
  top_up: EsimTopUp;
  rating?: number;
  labels: EsimLabel[];
  countries: EsimCountry[];
  payment_systems: EsimPaymentSystem[];
  promocodes: EsimPromocode[];
  reviews: EsimReview[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

export interface EsimPage {
  title: string;
  header_content: DynamicContentItem[];
  footer_content: DynamicContentItem[];
}

export interface GetEsimPageResponse {
  data: EsimPage | null;
}

export interface GetEsimsRequest {
  marketType: EsimMarketType;
  page?: number;
  pageSize?: number;
}

export interface GetEsimsResponse {
  data: Esim[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface GetEsimBySlugRequest {
  slug: string;
}

export interface GetEsimBySlugResponse {
  data: Esim | null;
}
