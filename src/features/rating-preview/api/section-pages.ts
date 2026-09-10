import { cache } from "react";
import {
  DynamicContentItem,
  getBankCreditPage,
  getCreditCardPage,
  getDebitCardPage,
  getEsimPage,
  getFirstParagraphText,
  getMicroloanPage,
  getPaymentServicePage,
  getVcPage,
  getVedPage,
} from "@/entities/strapi";
import { RatingSectionKey, SiteSectionKey } from "@/shared/consts";

type SectionPageResponse = { data: { header_content?: DynamicContentItem[] } | null };

/** Раздел → single type его страницы в Strapi: оттуда берём описание для карточки. */
const PAGE_LOADERS: Record<RatingSectionKey, () => Promise<SectionPageResponse>> = {
  ved: getVedPage,
  "virtual-cards": getVcPage,
  esim: getEsimPage,
  "payment-services": getPaymentServicePage,
  "debit-cards": getDebitCardPage,
  "credit-cards": getCreditCardPage,
  credits: getBankCreditPage,
  microloans: getMicroloanPage,
};

const DESCRIPTION_LIMIT = 200;

/**
 * Описания разделов из Strapi — по одному запросу на раздел, параллельно.
 *
 * У разделов обмена (обменники, обмен валюты, чёрный список) страницы в Strapi
 * нет: для них возвращается null, и карточка показывает фолбэк из конфига.
 */
export const getSectionDescriptions = cache(
  async (keys: SiteSectionKey[]): Promise<Record<string, string | null>> => {
    const loadable = keys.filter((key): key is RatingSectionKey => key in PAGE_LOADERS);

    const pages = await Promise.all(
      loadable.map(async (key) => {
        try {
          return await PAGE_LOADERS[key]();
        } catch (error) {
          // Пустое описание лучше, чем упавший хаб
          console.error(`getSectionDescriptions error for ${key}:`, error);
          return null;
        }
      }),
    );

    return Object.fromEntries(
      loadable.map((key, index) => [
        key,
        getFirstParagraphText(pages[index]?.data?.header_content, DESCRIPTION_LIMIT),
      ]),
    );
  },
);
