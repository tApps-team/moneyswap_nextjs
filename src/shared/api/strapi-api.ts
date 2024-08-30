import { pageTypes } from "../types";
import { GetHelpPageResponse } from "./strapi-dto";

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

export const getSeoMeta = async ({
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
    `${process.env.STRAPI_BASE_URL}/api/seo-meta-blocks?filters[page][$eq]=${page}&${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getAboutPage = async () => {
  const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/about-us`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getHelpPage = async (): Promise<GetHelpPageResponse> => {
  const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/help-page-article`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getForPartnersPage = async () => {
  const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/for-partner`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getArticle = async () => {
  const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/article`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
