import { apiClient } from "@/shared/api";
import { createStandardHeaders, logRequestHeaders } from "@/shared/lib/debug-headers";
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
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/directions?city=${city}&valute_from=${valute_from}&valute_to=${valute_to}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/directions?valute_from=${valute_from}&valute_to=${valute_to}`;

  try {
    const headers = createStandardHeaders({
      "Moneyswap": "true",
    });
    
    logRequestHeaders(url, headers);
    
    const res = await fetch(url, {
      method: "GET",
      headers,
      next: {
        revalidate: 60,
        tags: city
          ? ["directions", valute_from, valute_to, city]
          : ["directions", valute_from, valute_to],
      },
    });

    if (!res.ok) {
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
    return { exchangers: null, status: 500 };
  }
};

export const getSimilarDirections = async (
  props: GetSimilarDirectionDtoRequset,
): Promise<GetSimilarDirectionDtoResponse> => {
  const { valuteFrom, valuteTo, city } = props;
  const url = city
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/similar_directions?segment_marker=cash&valute_from=${valuteFrom}&valute_to=${valuteTo}&city=${city}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/similar_directions?segment_marker=no_cash&valute_from=${valuteFrom}&valute_to=${valuteTo}`;

  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  logRequestHeaders(url, headers);

  const res = await fetch(url, {
    method: "GET",
    headers,
    next: {
      revalidate: 60,
      tags: ['similar-directions', valuteFrom, valuteTo]
    }
  });
  
  const data = await res.json();
  return data;
};

export const getExchangerList = async () => {
  const url = `/api/v2/exchange_list`;
  const response = await apiClient.get<GetExchangeListDtoResponse>(url);
  return response;
};

export const getExchangerDetails = async (props: GetExchnagerDetailDtoRequest) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/exchange_detail`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  const queryParams = new URLSearchParams();
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });
  
  const fullUrl = `${url}?${queryParams.toString()}`;
  logRequestHeaders(fullUrl, headers);
  
  try {
    const result = await fetch(fullUrl, { 
      method: "GET",
      headers,
      next: { 
        revalidate: 60,
      }
    });

    if (!result.ok) {
      return null;
    }

    const response = await result.json();
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
  const url = `/api/v2/exchangers_blacklist`;
  const response = await apiClient.get<GetBlackListDtoResponse>(url);
  return response;
};

export const getBlackListDetails = async (props: GetBlackListDetailDtoRequest) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/exchange_blacklist_detail`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  const queryParams = new URLSearchParams();
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });
  
  const fullUrl = `${url}?${queryParams.toString()}`;
  logRequestHeaders(fullUrl, headers);
  
  try {
    const result = await fetch(fullUrl, { 
      method: "GET",
      headers,
      next: { 
        revalidate: 60,
      }
    });

    if (!result.ok) {
      return null;
    }

    const response = await result.json();
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
  const url = `/api/v2/sitemap_directions`;
  try {
    const response = await apiClient.get<GetSitemapDirectionsDtoResponse>(url, props);
    if (!response || (typeof response === "object" && "status" in response && response.status !== "200")) {
      return null;
    }
    return response;
  } catch (error) {
    console.error("getSitemapDirections error:", error);
    return null;
  }
};