import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { createStandardHeaders, logRequestHeaders } from "@/shared/lib/debug-headers";
import {
  GetActualCourseDtoResponse,
  GetAvailableValutesDtoRequest,
  GetAvailableValutesDtoResponse,
  GetDirectionsRequest,
  GetDirectionsResponse,
  GetActualCourseDtoRequest,
  GetPairValuteDtoResponse,
  GetSpecificValuteRequest,
  GetSpecificValuteResponse,
  GetPairValuteDtoRequest
} from "./currency-dto";

export const useGetAvailableValutes = (props: GetAvailableValutesDtoRequest) => {
  const { base = "all", city } = props;
  const url = city
    ? `/api/v2/available_valutes?city=${city}&base=${base}`
    : `/api/v2/available_valutes?base=${base}`;

  const result = async () => await apiClient.get<GetAvailableValutesDtoResponse>(url);

  return useQuery<GetAvailableValutesDtoResponse>({
    queryKey: ["available_valutes_2", base, city],
    queryFn: result,
    retry: false,
    select(currencies) {
      return [
        {
          name: { en: "All", ru: "Все" },
          currencies: Array.isArray(currencies)
            ? currencies.map((currency) => currency?.currencies).flat()
            : [],
          id: "All",
        },
        ...currencies,
      ];
    },
    refetchOnWindowFocus: false,
  });
};

export const getSpecificValute = async (
  props: GetSpecificValuteRequest,
): Promise<GetSpecificValuteResponse> => {
  const { codeName } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/specific_valute?code_name=${codeName}`;
  const result = await apiClient.get<GetSpecificValuteResponse>(url);

  return result;
};

export const getPopularValutes = async (
  props: GetDirectionsRequest,
): Promise<GetDirectionsResponse> => {
  const { segment_marker, limit } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/popular_directions?segment_marker=${segment_marker}&limit=${limit}`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  logRequestHeaders(url, headers);
  
  const result = await fetch(url, { 
    method: "GET",
    headers,
  });
  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await result.json();
  return data;
};

export const getRandomValutes = async (
  props: GetDirectionsRequest,
): Promise<GetDirectionsResponse> => {
  const { segment_marker, limit } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/random_directions?segment_marker=${segment_marker}&limit=${limit}`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  logRequestHeaders(url, headers);
  
  const result = await fetch(url, { 
    method: "GET",
    headers,
  });
  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await result.json();
  return data;
};

export const getActualCourse = async (
  props: GetActualCourseDtoRequest,
): Promise<GetActualCourseDtoResponse | null> => {
  const { valuteFrom, valuteTo } = props;
  const url = `/api/v2/actual_course?valute_from=${valuteFrom}&valute_to=${valuteTo}`;

  try {
    const result = await apiClient.get<GetActualCourseDtoResponse>(url);
    return result;
  } catch (error) {
    console.error("Failed to fetch the actual course:", error);
    return null; // Return null or an appropriate fallback value if the request fails
  }
};

export const getPairValute = async (props: GetPairValuteDtoRequest) => {
  const url = `/api/v2/direction_pair_by_exchange`;
  const response = await apiClient.get<GetPairValuteDtoResponse>(url, props, "no-store");
  return response;
};
