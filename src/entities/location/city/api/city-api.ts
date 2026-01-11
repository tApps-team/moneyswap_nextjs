import { createStandardHeaders, logRequestHeaders } from "@/shared/lib/debug-headers";
import { getSimilarCitiesDtoRequest, getSimilarCitiesDtoResponse } from "./city-api-dto";

export const getSimilarCities = async (
  props: getSimilarCitiesDtoRequest,
): Promise<getSimilarCitiesDtoResponse | null> => {
  const { city, valute_to, valute_from } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/similar_cities_by_direction?valute_from=${valute_from}&valute_to=${valute_to}&city=${city}`;
  
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
        tags: ["similar_cities", valute_from, valute_to, city],
      },
    });

    if (!result.ok) {
      console.error(`Failed to fetch similar cities: ${result.status} ${result.statusText}`);
      return null;
    }

    return result.json();
  } catch (error) {
    console.error("Error fetching similar cities:", error);
    return null;
  }
};

export const getAllSimilarCities = async (
  props: getSimilarCitiesDtoRequest,
): Promise<getSimilarCitiesDtoResponse | null> => {
  const { city, valute_to, valute_from } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/extended_similar_cities_by_direction?valute_from=${valute_from}&valute_to=${valute_to}&city=${city}`;
  
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
        tags: ["extended_similar_cities", valute_from, valute_to, city],
      },
    });

    if (!result.ok) {
      console.error(`Failed to fetch all similar cities: ${result.status} ${result.statusText}`);
      return null;
    }

    return result.json();
  } catch (error) {
    console.error("Error fetching all similar cities:", error);
    return null;
  }
};