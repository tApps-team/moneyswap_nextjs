import {
  GetAboutPageResponse,
  GetCryptoExchangersPageResponse,
  GetForPartnersPageResponse,
  GetHelpPageResponse,
} from "./other-pages-dto";

export const getAboutPage = async (): Promise<GetAboutPageResponse> => {
  try {
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/about-us`, {
      cache: "default",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getHelpPage = async (): Promise<GetHelpPageResponse> => {
  try {
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/help-page-article`, {
      cache: "default",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getForPartnersPage = async (): Promise<GetForPartnersPageResponse> => {
  try {
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/for-partner`, {
      cache: "default",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getCryptoExchangersPage = async (): Promise<GetCryptoExchangersPageResponse> => {
  try {
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/crypto-exchangers-page`, {
      cache: "default",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};
