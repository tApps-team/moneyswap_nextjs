import { pageTypes } from "../types";

export interface SeoMetaResponse {
  data: {
    title: string;
    description: string;
    keywords: string;
  }[];
}

export interface SeoTextsResponse {
  data: {
    id: number;
    header_title: string;
    header_description: string;
    footer_title: string;
    footer_description: string;
    page: pageTypes;
  }[];
}

export interface SeoParams {
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
}: SeoParams): Promise<SeoTextsResponse> => {
  const params = new URLSearchParams();
  if (giveCurrency) params.append("give_currency", giveCurrency);
  if (getCurrency) params.append("get_currency", getCurrency);
  if (country) params.append("country", country);
  if (city) params.append("city", city);

  try {
    const res = await fetch(
      `${process.env.STRAPI_BASE_URL}/api/seo-texts-blocks?filters[page][$eq]=${page}&${params.toString()}`,
      {
        next: { revalidate: 10 },
      },
    );
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getSeoMeta = async ({
  page,
  giveCurrency,
  getCurrency,
  country,
  city,
}: SeoParams): Promise<SeoMetaResponse> => {
  const params = new URLSearchParams();
  if (giveCurrency) params.append("give_currency", giveCurrency);
  if (getCurrency) params.append("get_currency", getCurrency);
  if (country) params.append("country", country);
  if (city) params.append("city", city);

  try {
    const res = await fetch(
      `${process.env.STRAPI_BASE_URL}/api/seo-meta-blocks?filters[page][$eq]=${page}&${params.toString()}`,
      {
        next: { revalidate: 10 },
      },
    );
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};
