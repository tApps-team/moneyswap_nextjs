import { apiClient } from "@/shared/api";
import {
  ReviewsByExchangeDTORequest,
  ReviewsByExchangeDTOResponse,
} from "./exchanger-review-api-dto";

export const reviewsByExchange = async (
  props: ReviewsByExchangeDTORequest,
): Promise<ReviewsByExchangeDTOResponse> => {
  const response = await apiClient.get<ReviewsByExchangeDTOResponse>(
    "api/reviews/reviews_by_exchange",
    props,
  );

  return response;
};
