import { DynamicContentItem } from "../../blog";

export type VedReviewRating = "positive" | "neutral" | "negative";

export interface VedLabel {
  id: number;
  title: string;
  icon: string;
  slug: string;
}

export interface VedCountry {
  id: number;
  title: string;
  icon: string;
  slug: string;
}

export interface VedCurrency {
  id: number;
  title: string;
  icon: string;
  code: string;
}

export interface VedReview {
  id: number;
  username: string;
  rating: VedReviewRating;
  text: string;
  review_date?: string;
}

export interface VedPromocode {
  title: string;
  icon: string;
  description: string;
  url: string;
}

export interface VedAgentLimits {
  from: string | null;
  to: string | null;
}

export interface VedAgent {
  id: number;
  slug: string;
  name: string;
  url: string;
  logo: string | null;
  is_vip: boolean;
  commission: number;
  limits: VedAgentLimits;
  labels: VedLabel[];
  countries: VedCountry[];
  currencies: VedCurrency[];
  promocodes: VedPromocode[];
  reviews: VedReview[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

export interface VedPage {
  title: string;
  header_content: DynamicContentItem[];
  footer_content: DynamicContentItem[];
}

export interface GetVedPageResponse {
  data: VedPage | null;
}

export interface GetVedAgentsRequest {
  page?: number;
  pageSize?: number;
}

export interface GetVedAgentsResponse {
  data: VedAgent[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface GetVedAgentBySlugRequest {
  slug: string;
}

export interface GetVedAgentBySlugResponse {
  data: VedAgent | null;
}
