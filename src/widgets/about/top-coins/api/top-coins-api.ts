import { createStandardHeaders, logRequestHeaders } from "@/shared/lib/debug-headers";
import { GetTopCoinsDtoRequest, GetTopCoinsDtoResponse } from "./top-coins-api-dto";

export const getTopCoins = async (
  props: GetTopCoinsDtoRequest,
): Promise<GetTopCoinsDtoResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/top_coins`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  logRequestHeaders(url, headers);
  
  const result = await fetch(url, {
    method: "GET",
    headers,
    next: {
      revalidate: 10,
      tags: ["top_coins"],
    },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch top coins");
  }

  return result.json();
};
