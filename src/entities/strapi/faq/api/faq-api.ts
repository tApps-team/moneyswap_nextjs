import { faqTypes } from "../model";
import { GetFaqResponse } from "./faq-dto";

export const getFaq = async (type?: faqTypes): Promise<GetFaqResponse> => {
  const path = type ? `main-faqs?filters[type][$eq]=${type}` : `main-faqs`;
  const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
