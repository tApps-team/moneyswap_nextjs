import { Comment, ExchangerReview } from "..";

export type ReviewsByExchangeDTOResponse = {
  page: number;
  element_on_page: number;
  content: ExchangerReview[];
  pages: number;
};
export type ReviewsByExchangeDTORequest = {
  exchange_id: number;
  page: number;
  element_on_page?: number;
  grade_filter?: number;
};

export type GetCommentsByReviewDtoRequest = {
  reviewId: number;
};
export type GetCommentsByReviewDtoResponse = Comment[];
