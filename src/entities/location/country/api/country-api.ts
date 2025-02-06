import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { ExchangerMarker } from "@/shared/types";
import { Country } from "../model/country-types";
import { GetSpecificCityRequest, GetSpecificCityResponse } from "./country-api-dto";

export const useGetCountries = (direction: ExchangerMarker) => {
  const url = `/api/cash/countries2`;
  const fetcher = async () => await apiClient.get<Country[]>(url);
  return useQuery({
    queryKey: ["countries"],
    queryFn: fetcher,
    enabled: direction === ExchangerMarker.cash,
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
