import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import {
  GetAvailableValutesDtoRequest,
  GetAvailableValutesDtoResponse,
  GetSpecificValuteRequest,
  GetSpecificValuteResponse,
} from "./currency-dto";

// export const getAvailableValutes = async (
//   props: GetAvailableValutesDtoRequest,
// ): Promise<GetAvailableValutesDtoResponse> => {
//   const { base = "all", city } = props;
//   //   const url = new URL(props.base);
//   //   const searchParams = new URLSearchParams(url.);

//   const url = city
//     ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/available_valutes_2?city=${city}&base=${base}`
//     : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/available_valutes_2?base=${base}`;
//   const res = await fetch(url, {
//     method: "GET",
//     next: {
//       tags: ["availableValutes", base],
//     },
//   });
//   const data = await res.json();

//   return data;
// };
// const getAvailableValutes = async (props: GetAvailableValutesDtoRequest) => {
//   const { base = "all", city } = props;
//   const url = city
//     ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/available_valutes_2?city=${city}&base=${base}`
//     : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/available_valutes_2?base=${base}`;
//   const response = await fetch(url, { method: "GET" });
//   if (!response.ok) return console.log("error");
//   const data = await response.json();
//   return data;
// };
export const useGetAvailableValutes = (props: GetAvailableValutesDtoRequest) => {
  const { base = "all", city } = props;
  const url = city
    ? `/api/available_valutes_2?city=${city}&base=${base}`
    : `/api/available_valutes_2?base=${base}`;
  // const fetcher = async () => await fetch(url, { method: "GET" });
  const result = async () => await apiClient.get<GetAvailableValutesDtoResponse>(url);

  return useQuery<GetAvailableValutesDtoResponse>({
    queryKey: ["available_valutes_2", base, city],
    queryFn: result,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const getSpecificValute = async (
  props: GetSpecificValuteRequest,
): Promise<GetSpecificValuteResponse> => {
  const { codeName } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/specific_valute?code_name=${codeName}`;
  const result = await fetch(url, { method: "GET" });
  const data = await result.json();

  return data;
};
