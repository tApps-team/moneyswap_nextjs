import { IncreaseLinkCountReq } from "./userDto";

export const increaseLinkCount = async (body: IncreaseLinkCountReq): Promise<void> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/increase_link_count`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Moneyswap": "true",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};