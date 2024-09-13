import { apiClient } from "@/shared/api";
import {
  ReviewsByExchangeDTORequest,
  ReviewsByExchangeDTOResponse,
} from "./exchanger-review-api-dto";

export const reviewsByExchange = async (
  props: ReviewsByExchangeDTORequest,
): Promise<ReviewsByExchangeDTOResponse> => {
  const { exchange_id, exchange_marker, grade_filter, page, element_on_page } = props;
  const url = `api/reviews/reviews_by_exchange?exchange_id=${exchange_id}&exchange_marker=${exchange_marker}&page=${page}&element_on_page=3&grade_filter=${element_on_page}`;
  const response = await apiClient.get<ReviewsByExchangeDTOResponse>(
    "api/reviews/reviews_by_exchange",
    props,
  );
  return response;
};
