import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { Country } from "../model/country-types";
import { GetSpecificCityRequest, GetSpecificCityResponse } from "./country-api-dto";

export const useGetCountries = () => {
  const url = `/api/v2/cash/countries`;
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
