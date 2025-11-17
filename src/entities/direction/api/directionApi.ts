import { createStandardHeaders, logRequestHeaders } from "@/shared/lib/debug-headers";
import { IncreaseDirectionCountReq } from "./directionDto";

export const increaseDirectionCount = async (body: IncreaseDirectionCountReq): Promise<void> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/test/increase_popular_count`;
    const headers = createStandardHeaders({
      "Moneyswap": "true",
    });
    
    logRequestHeaders(url, headers);
    
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};