import { faqTypes } from "../model";
import { GetFaqResponse } from "./faq-dto";

export const getFaq = async (type?: faqTypes): Promise<GetFaqResponse> => {
  try {
    const path = type ? `main-faqs?filters[type][$eq]=${type}` : `main-faqs`;
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/${path}`, {
      method: "GET",
      cache: "force-cache",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};
