import { pageTypes, SeoTextsBlock, mainFaqTypes } from "../types";

export const getMainFaq = async () => {
  const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/main-faqs`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getFilteredMainFaq = async (type: mainFaqTypes) => {
  const res = await fetch(
    `${process.env.STRAPI_BASE_URL}/api/main-faqs?filters[type][$eq]=${type}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export interface SeoTextsParams {
  page: pageTypes;
  giveCurrency?: string;
  getCurrency?: string;
  country?: string;
  city?: string;
}

export const getSeoTexts = async ({
  page,
  giveCurrency,
  getCurrency,
  country,
  city,
}: SeoTextsParams) => {
  const params = new URLSearchParams();
  if (giveCurrency) params.append("give_currency", giveCurrency);
  if (getCurrency) params.append("get_currency", getCurrency);
  if (country) params.append("country", country);
  if (city) params.append("city", city);

  const res = await fetch(
    `${process.env.STRAPI_BASE_URL}/api/seo-texts-blocks?filters[page][$eq]=${page}&${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
