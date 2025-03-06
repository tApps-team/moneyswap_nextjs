import { IncreaseLinkCountPartnersReq, IncreaseLinkCountReq } from "./userDto";

export const increaseLinkCount = async (body: IncreaseLinkCountReq): Promise<void> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/increase_link_count`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const increaseLinkCountPartners = async (
  body: IncreaseLinkCountPartnersReq,
): Promise<void> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/increase_link_count`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};
