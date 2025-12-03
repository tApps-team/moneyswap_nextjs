import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { createStandardHeaders, logRequestHeaders } from "@/shared/lib/debug-headers";
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
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cash/specific_city?code_name=${codeName}`;

  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  logRequestHeaders(url, headers);
  
  const result = await fetch(url, { 
    method: "GET",
    headers,
    next: { 
      revalidate: 60,
    }
  });

  if (!result.ok) {
    throw new Error("Failed to fetch specific city");
  }

  return result.json();
};