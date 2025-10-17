import { apiClient } from "@/shared/api";
import { GetTopCoinsDtoRequest, GetTopCoinsDtoResponse } from "./top-coins-api-dto";

export const getTopCoins = (props: GetTopCoinsDtoRequest) => {
  const url = `/api/v2/top_coins`;
  const response = apiClient.get<GetTopCoinsDtoResponse>(url);
  return response;
};
