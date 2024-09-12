import { ExchangerReview } from "..";

export type ReviewsByExchangeDTOResponse = {
  page: number;
  element_on_page: number;
  content: ExchangerReview[];
  pages: number;
};
export type ReviewsByExchangeDTORequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  page: number;
  element_on_page?: number;
  grade_filter?: number;
};

export enum ExchangerMarker {
  cash = "cash",
  no_cash = "no_cash",
  partner = "partner",
}
