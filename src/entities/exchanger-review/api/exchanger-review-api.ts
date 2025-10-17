import { apiClient } from "@/shared/api";
import {
  GetCommentsByReviewDtoRequest,
  GetCommentsByReviewDtoResponse,
  ReviewsByExchangeDTORequest,
  ReviewsByExchangeDTOResponse,
} from "./exchanger-review-api-dto";

export const reviewsByExchange = async (
  props: ReviewsByExchangeDTORequest,
): Promise<ReviewsByExchangeDTOResponse> => {
  const response = await apiClient.get<ReviewsByExchangeDTOResponse>(
    "/api/v2/reviews/reviews_by_exchange",
    props,
    "no-store"
  );
  return response;
};

export const getCommentsByReview = async (props: GetCommentsByReviewDtoRequest) => {
  const { reviewId } = props;
  const response = await apiClient.get<GetCommentsByReviewDtoResponse>(
    `/api/v2/reviews/get_comments_by_review?review_id=${reviewId}`,
    props,
    "no-store"
  );
  return response;
};
