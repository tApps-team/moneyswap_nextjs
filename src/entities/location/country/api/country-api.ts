import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { Country } from "../model/country-types";
import { GetSpecificCityRequest, GetSpecificCityResponse } from "./country-api-dto";
//add DTO file for getCountries
// export const getCountries = async (): Promise<Country[]> => {
//   const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cash/countries`;

//   const res = await fetch(url, {
//     method: "GET",
//   });
//   const data = await res.json();
//   return data;
// };
export const useGetCountries = () => {
  const url = `/api/cash/countries`;
  const fetcher = async () => await apiClient.get<Country[]>(url);
  return useQuery({
    queryKey: ["countries"],
    queryFn: fetcher,
  });
};
export const getSpecificCity = async (
  props: GetSpecificCityRequest,
): Promise<GetSpecificCityResponse> => {
  const { codeName } = props;
  const url = `api/cash/specific_city?code_name=${codeName}`;
  const response = apiClient.get<GetSpecificCityResponse>(url);

  return response;
};
