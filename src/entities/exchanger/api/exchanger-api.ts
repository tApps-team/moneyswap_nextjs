import { apiClient } from "@/shared/api";
import {
  GetExchangeListDtoResponse,
  GetExchangersDtoRequest,
  GetExchangersDtoResponse,
  GetExchnagerDetailDtoRequset,
  GetExchnagerDetailDtoResponse,
  GetSimilarDirectionDtoRequset,
  GetSimilarDirectionDtoResponse,
} from "./exchanger-api-dto";

export const getExchangers = async (
  props: GetExchangersDtoRequest,
): Promise<GetExchangersDtoResponse> => {
  const { valute_from, valute_to, city } = props;

  const url = city
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/directions?city=${city}&valute_from=${valute_from}&valute_to=${valute_to}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/directions?valute_from=${valute_from}&valute_to=${valute_to}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      next: {
        tags: city
          ? ["directions", valute_from, valute_to, city]
          : ["directions", valute_from, valute_to],
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // Handle different response statuses accordingly
      // return { exchangers: null, status: res.status };
    }

    try {
      const data = await res.json();
      return data;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      // return { exchangers: null, status: res.status };
    }
  } catch (error) {
    console.error("Network or other error occurred:", error);
    // return { exchangers: null, status: 500 }; // Return a status of 500 or another code indicating a failure
  }
};

export const getSimilarDirections = async (
  props: GetSimilarDirectionDtoRequset,
): Promise<GetSimilarDirectionDtoResponse> => {
  const { exchangeMarker, valuteFrom, valuteTo, city, limit } = props;
  const url = city
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/similar_directions?exchange_marker=cash&valute_from=${valuteFrom}&valute_to=${valuteTo}&city=${city}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/similar_directions?exchange_marker=no_cash&valute_from=${valuteFrom}&valute_to=${valuteTo}`;

  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};
export const getExchangerList = async () => {
  const url = `/api/exchange_list`;
  const response = await apiClient.get<GetExchangeListDtoResponse>(url);
  return response;
};

export const getExchangerDetails = async (props: GetExchnagerDetailDtoRequset) => {
  const url = `/api/exchange_detail`;
  const response = await apiClient.get<GetExchnagerDetailDtoResponse>(url, props);
  return response;
};
