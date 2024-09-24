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
    "api/reviews/reviews_by_exchange",
    props,
    "no-store",
  );

  return response;
};

export const getCommentsByReview = async (props: GetCommentsByReviewDtoRequest) => {
  const { exchangerId, exchangerMarker, reviewId } = props;
  const response = await apiClient.get<GetCommentsByReviewDtoResponse>(
    `api/reviews/get_comments_by_review?exchange_id=${exchangerId}&exchange_marker=${exchangerMarker}&review_id=${reviewId}`,
  );
  return response;
};
