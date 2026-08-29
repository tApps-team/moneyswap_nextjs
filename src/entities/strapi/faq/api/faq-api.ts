import { faqTypes } from "../model";
import { GetFaqResponse } from "./faq-dto";

export const getFaq = async (type?: faqTypes): Promise<GetFaqResponse> => {
  try {
    const sort = `sort=updatedAt:desc`;
    const path = type ? `main-faqs?filters[type][$eq]=${type}&${sort}` : `main-faqs?${sort}`;
    const tags = type ? ['faq', `faq-${type}`] : ['faq'];
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/${path}`, {
      method: "GET",
      cache: "force-cache",
      next: { 
        tags: tags 
      }
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};
