import { apiClient } from "@/shared/api";
import {
  GetBlackListDetailDtoRequest,
  GetBlackListDetailDtoResponse,
  GetBlackListDtoResponse,
  GetExchangeListDtoResponse,
  GetExchangersDtoRequest,
  GetExchangersDtoResponse,
  GetExchnagerDetailDtoRequest,
  GetExchnagerDetailDtoResponse,
  GetSimilarDirectionDtoRequset,
  GetSimilarDirectionDtoResponse,
  GetSitemapDirectionsDtoRequest,
  GetSitemapDirectionsDtoResponse,
} from "./exchanger-api-dto";

export const getExchangers = async (
  props: GetExchangersDtoRequest,
): Promise<{ exchangers: GetExchangersDtoResponse | null; status: number }> => {
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
      return { exchangers: null, status: res.status };
    }

    try {
      const data = await res.json();
      return { exchangers: data, status: res.status };
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      return { exchangers: null, status: res.status };
    }
  } catch (error) {
    console.error("Network or other error occurred:", error);
    return { exchangers: null, status: 500 }; // Return a status of 500 or another code indicating a failure
  }
};

export const getSimilarDirections = async (
  props: GetSimilarDirectionDtoRequset,
): Promise<GetSimilarDirectionDtoResponse> => {
  const { valuteFrom, valuteTo, city } = props;
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
  const url = `/api/test/exchange_list`;
  const response = await apiClient.get<GetExchangeListDtoResponse>(url);
  return response;
};

export const getExchangerDetails = async (props: GetExchnagerDetailDtoRequest) => {
  const url = `/api/test/exchange_detail`;
  try {
    const response = await apiClient.get<GetExchnagerDetailDtoResponse>(url, props, "no-store");
    // Если твой apiClient.get возвращает объект с полем status
    if (!response || (typeof response === "object" && "status" in response && response.status !== "200")) {
      return null;
    }
    return response;
  } catch (error) {
    console.error("getExchangerDetails error:", error);
    return null;
  }
};

export const getBlackList = async () => {
  const url = `/api/exchangers_blacklist`;
  const response = await apiClient.get<GetBlackListDtoResponse>(url);
  return response;
};

export const getBlackListDetails = async (props: GetBlackListDetailDtoRequest) => {
  const url = `/api/exchange_blacklist_detail`;
  try {
    const response = await apiClient.get<GetBlackListDetailDtoResponse>(url, props, "no-store");
    // Если твой apiClient.get возвращает объект с полем status
    if (!response || (typeof response === "object" && "status" in response && response.status !== "200")) {
      return null;
    }
    return response;
  } catch (error) {
    console.error("getExchangerDetails error:", error);
    return null;
  }
};

export const getSitemapDirections = async (props: GetSitemapDirectionsDtoRequest) => {
  const url = `/api/sitemap_directions`;
  try {
    const response = await apiClient.get<GetSitemapDirectionsDtoResponse>(url, props);
    // Если твой apiClient.get возвращает объект с полем status
    if (!response || (typeof response === "object" && "status" in response && response.status !== "200")) {
      return null;
    }
    return response;
  } catch (error) {
    console.error("getSitemapDirections error:", error);
    return null;
  }
};
