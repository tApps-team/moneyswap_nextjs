import { createStandardHeaders, logRequestHeaders } from "@/shared/lib/debug-headers";
import { GetTopExchangersDtoRequest, GetTopExchangersDtoResponse } from "./top-exchangers-api-dto";

export const getTopExchangers = async (
  props: GetTopExchangersDtoRequest,
): Promise<GetTopExchangersDtoResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/top_exchanges`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  logRequestHeaders(url, headers);
  
  const result = await fetch(url, {
    method: "GET",
    headers,
    next: {
      revalidate: 10,
      tags: ["top_exchangers"],
    },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch top exchangers");
  }

  return result.json();
};
