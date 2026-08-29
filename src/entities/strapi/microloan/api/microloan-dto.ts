import { DynamicContentItem } from "../../blog";

export type MicroloanApproval = "high" | "medium" | "low";
export type MicroloanAmountType = "to_30000" | "to_50000" | "to_100000";
export type MicroloanTermType = "to_30_days" | "to_35_days" | "to_180_days";
export type MicroloanFirstLoanType = "zero_first_loan" | "standard_rate" | "needs_verification";
export type MicroloanVerificationStatus = "confirmed" | "manual_check";
export type MicroloanLimitType = "small" | "medium" | "large";
export type MicroloanDurationType = "short" | "about_month" | "long";

export interface MicroloanIssueChannel {
  id: number;
  title: string;
  icon: string | null;
  slug: string;
}

export interface MicroloanCollection {
  id: number;
  title: string;
  icon: string | null;
  slug: string;
}

export interface Microloan {
  id: number;
  slug: string;
  name: string;
  url: string;
  is_vip: boolean;
  logo: string | null;
  description: string | null;
  /** Ставка в день: «0,8%». */
  rate: string | null;
  /** Полная стоимость займа: «0–292%». */
  psk: string | null;
  approval: MicroloanApproval | null;
  /** biginteger из Strapi приходит строкой. */
  amount_limits: { from: string | number | null; to: string | number | null };
  term_limits: { from: number | null; to: number | null };
  loan_amount_type: MicroloanAmountType | null;
  loan_term_type: MicroloanTermType | null;
  first_loan_type: MicroloanFirstLoanType | null;
  verification_status: MicroloanVerificationStatus | null;
  loan_limit_type: MicroloanLimitType | null;
  loan_duration_type: MicroloanDurationType | null;
  rating: number | null;
  reviews_count: number;
  issue_channels: MicroloanIssueChannel[];
  collections: MicroloanCollection[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

export interface MicroloanPage {
  title: string;
  header_content: DynamicContentItem[];
  footer_content: DynamicContentItem[];
}

export interface GetMicroloanPageResponse {
  data: MicroloanPage | null;
}

export interface GetMicroloansRequest {
  page?: number;
  pageSize?: number;
}

export interface GetMicroloansResponse {
  data: Microloan[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface GetMicroloanBySlugRequest {
  slug: string;
}

export interface GetMicroloanBySlugResponse {
  data: Microloan | null;
}
