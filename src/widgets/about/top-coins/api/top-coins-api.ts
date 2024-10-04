import { apiClient } from "@/shared/api";
import { GetTopCoinsDtoRequset, GetTopCoinsDtoResponse } from "./top-coins-api-dto";

export const getTopCoins = (props: GetTopCoinsDtoRequset) => {
  const url = `api/top_coins`;
  const response = apiClient.get<GetTopCoinsDtoResponse>(url);
  return response;
};
