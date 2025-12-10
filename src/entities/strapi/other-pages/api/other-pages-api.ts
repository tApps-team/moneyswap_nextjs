import {
  GetAboutPageResponse,
  GetCryptoExchangersPageResponse,
  GetForPartnersPageResponse,
  GetHelpPageResponse,
} from "./other-pages-dto";

export const getAboutPage = async (): Promise<GetAboutPageResponse> => {
  try {
    const res = await fetch(`${process.env.STRAPI_BASE_URL}/api/about-us`, {
      cache: "force-cache",
      next: { 
        tags: ['about'] 
      }
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
      cache: "force-cache",
      next: { 
        tags: ['help'] 
      }
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
      cache: "force-cache",
      next: { 
        tags: ['partner'] 
      }
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
      cache: "force-cache",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};
