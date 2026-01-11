import { createStandardHeaders, logRequestHeaders } from "@/shared/lib/debug-headers";
import { Country } from "../model/country-types";
import { GetSpecificCityRequest, GetSpecificCityResponse } from "./country-api-dto";

export const getCountries = async (): Promise<Country[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/cash/countries`;
  
  try {
    const headers = createStandardHeaders({
      "Moneyswap": "true",
    });
    
    logRequestHeaders(url, headers);
    
    const result = await fetch(url, {
      method: "GET",
      headers,
      next: {
        revalidate: 10,
        tags: ["countries"],
      },
    });

    if (!result.ok) {
      console.error(`Failed to fetch countries: ${result.status} ${result.statusText}`);
      return [];
    }

    return result.json();
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

export const getSpecificCity = async (
  props: GetSpecificCityRequest,
): Promise<GetSpecificCityResponse | null> => {
  const { codeName } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cash/specific_city?code_name=${codeName}`;

  try {
    const headers = createStandardHeaders({
      "Moneyswap": "true",
    });
    
    logRequestHeaders(url, headers);
    
    const result = await fetch(url, { 
      method: "GET",
      headers,
      next: { 
        revalidate: 10,
      }
    });

    if (!result.ok) {
      console.error(`Failed to fetch specific city: ${result.status} ${result.statusText}`);
      return null;
    }

    return result.json();
  } catch (error) {
    console.error("Error fetching specific city:", error);
    return null;
  }
};