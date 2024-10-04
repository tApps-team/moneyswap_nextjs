import { apiClient } from "@/shared/api";
import { GetTopExchangersDtoRequest, GetTopExchangersDtoResponse } from "./top-exchangers-api-dto";

export const getTopExchangers = (props: GetTopExchangersDtoRequest) => {
  const url = "api/top_exchanges";
  const response = apiClient.get<GetTopExchangersDtoResponse>(url);
  return response;
};
