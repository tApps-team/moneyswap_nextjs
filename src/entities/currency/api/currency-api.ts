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
  GetPairValuteDtoRequest,
  GetAllValutesDtoRequest,
  GetAllValutesDtoResponse
} from "./currency-dto";

export const getAvailableValutes = async (
  props: GetAvailableValutesDtoRequest,
): Promise<GetAvailableValutesDtoResponse> => {
  const { base = "all", city } = props;
  const url = city
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/available_valutes?city=${city}&base=${base}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/available_valutes?base=${base}`;

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
        tags: city ? ["available_valutes", base, city] : ["available_valutes", base],
      },
    });

    if (!result.ok) {
      console.error(`Failed to fetch available valutes: ${result.status} ${result.statusText}`);
      // Возвращаем дефолтное значение вместо выброса ошибки
      return [
        {
          name: { en: "All", ru: "Все" },
          currencies: [],
          id: "All",
        },
      ];
    }

    const currencies = await result.json();
    
    // Применяем ту же логику select, что была в useQuery
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
  } catch (error) {
    console.error("Error fetching available valutes:", error);
    // Возвращаем дефолтное значение при ошибке
    return [
      {
        name: { en: "All", ru: "Все" },
        currencies: [],
        id: "All",
      },
    ];
  }
};

export const getAllValutes = async (
  props: GetAllValutesDtoRequest,
): Promise<GetAllValutesDtoResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/all_valutes`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  logRequestHeaders(url, headers);
  
  const result = await fetch(url, {
    method: "GET",
    headers,
    next: {
      revalidate: 10,
      tags: ["all_valutes"],
    },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch all valutes");
  }

  return result.json();
};

export const getSpecificValute = async (
  props: GetSpecificValuteRequest,
): Promise<GetSpecificValuteResponse> => {
  const { codeName } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/specific_valute?code_name=${codeName}`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  logRequestHeaders(url, headers);
  
  const result = await fetch(url, { 
    method: "GET",
    headers,
    next: { 
      revalidate: 10,
      tags: [`valute-${codeName}`]
    }
  });

  if (!result.ok) {
    throw new Error("Failed to fetch specific valute");
  }

  return result.json();
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
    next: { 
      revalidate: 10,
      tags: ['popular-directions', segment_marker]
    }
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
    next: { 
      revalidate: 10,
      tags: ['random-directions', segment_marker]
    }
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
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/actual_course?valute_from=${valuteFrom}&valute_to=${valuteTo}`;

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
      throw new Error("Failed to fetch the actual course");
    }

    return result.json();
  } catch (error) {
    console.error("Failed to fetch the actual course:", error);
    return null;
  }
};

export const getPairValute = async (props: GetPairValuteDtoRequest) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/direction_pair_by_exchange`;
  
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
  
  const result = await fetch(fullUrl, { 
    method: "GET",
    headers,
    next: { 
      revalidate: 10,
    }
  });

  if (!result.ok) {
    throw new Error("Failed to fetch pair valute");
  }

  return result.json();
};
