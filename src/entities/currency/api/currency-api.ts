import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
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
    ? `/api/available_valutes_2?city=${city}&base=${base}`
    : `/api/available_valutes_2?base=${base}`;

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
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/specific_valute?code_name=${codeName}`;
  const result = await apiClient.get<GetSpecificValuteResponse>(url, { method: "GET" });

  return result;
};

export const getPopularValutes = async (
  props: GetDirectionsRequest,
): Promise<GetDirectionsResponse> => {
  const { exchange_marker, limit } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/popular_directions?exchange_marker=${exchange_marker}&limit=${limit}`;
  const result = await fetch(url, { method: "GET" });
  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await result.json();
  return data;
};

export const getRandomValutes = async (
  props: GetDirectionsRequest,
): Promise<GetDirectionsResponse> => {
  const { exchange_marker, limit } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/random_directions?exchange_marker=${exchange_marker}&limit=${limit}`;
  const result = await fetch(url, { method: "GET" });
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
  const url = `api/test/actual_course?valute_from=${valuteFrom}&valute_to=${valuteTo}`;

  try {
    const result = await apiClient.get<GetActualCourseDtoResponse>(url);
    return result;
  } catch (error) {
    console.error("Failed to fetch the actual course:", error);
    return null; // Return null or an appropriate fallback value if the request fails
  }
};

export const getPairValute = async (props: GetPairValuteDtoRequest) => {
  const url = `/api/direction_pair_by_exchange`;
  const response = await apiClient.get<GetPairValuteDtoResponse>(url, props);
  return response;
};
