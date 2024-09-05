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

  try {
    const res = await fetch(
      `${process.env.STRAPI_BASE_URL}/api/seo-texts-blocks?filters[page][$eq]=${page}&${params.toString()}`,
      {
        // cache: "no-store",
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
}: SeoTextsParams) => {
  const params = new URLSearchParams();
  if (giveCurrency) params.append("give_currency", giveCurrency);
  if (getCurrency) params.append("get_currency", getCurrency);
  if (country) params.append("country", country);
  if (city) params.append("city", city);

  try {
    const res = await fetch(
      `${process.env.STRAPI_BASE_URL}/api/seo-meta-blocks?filters[page][$eq]=${page}&${params.toString()}`,
      {
        // cache: "no-store",
      },
    );
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getAboutPage = async () => {
  try {
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/about-us`);
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getHelpPage = async (): Promise<GetHelpPageResponse> => {
  try {
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/help-page-article`);
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getForPartnersPage = async () => {
  try {
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/for-partner`);
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getArticle = async () => {
  try {
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/article`);
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};
