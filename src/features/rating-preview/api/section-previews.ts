import { cache } from "react";
import { getBlackList, getTopExchangers } from "@/entities/exchanger";
import {
  getBankCredits,
  getCreditCards,
  getDebitCards,
  getEsims,
  getMicroloans,
  getPaymentServices,
  getVedAgents,
  getVirtualCards,
} from "@/entities/strapi";
import { RatingSectionKey } from "@/shared/consts";
import {
  toBankCreditPreview,
  toBlacklistPreview,
  toCreditCardPreview,
  toDebitCardPreview,
  toEsimPreview,
  toExchangerPreview,
  toMicroloanPreview,
  toPaymentServicePreview,
  toVedPreview,
  toVirtualCardPreview,
} from "../lib/adapters";
import { RatingPreview } from "../model/types";

const PREVIEW_LIMIT = 8;

/**
 * Первые предложения раздела для витрины главной.
 *
 * Берём пагинированные загрузчики, а не getAll*: те в цикле выкачивают все
 * страницы по 100 записей, и на восьми разделах это заметно бьёт по TTFB.
 * Сортировка (VIP первыми) уже зашита в сами загрузчики.
 */
export const getSectionPreviews = cache(
  async (sectionKey: RatingSectionKey, limit = PREVIEW_LIMIT): Promise<RatingPreview[]> => {
    const request = { page: 1, pageSize: limit };

    switch (sectionKey) {
      case "ved": {
        const { data } = await getVedAgents(request);
        return data.map(toVedPreview);
      }
      case "virtual-cards": {
        const { data } = await getVirtualCards({ ...request, marketType: "international" });
        return data.map(toVirtualCardPreview);
      }
      case "esim": {
        const { data } = await getEsims({ ...request, marketType: "international" });
        return data.map(toEsimPreview);
      }
      case "payment-services": {
        const { data } = await getPaymentServices(request);
        return data.map(toPaymentServicePreview);
      }
      case "debit-cards": {
        const { data } = await getDebitCards(request);
        return data.map(toDebitCardPreview);
      }
      case "credit-cards": {
        const { data } = await getCreditCards(request);
        return data.map(toCreditCardPreview);
      }
      case "credits": {
        const { data } = await getBankCredits(request);
        return data.map(toBankCreditPreview);
      }
      case "microloans": {
        const { data } = await getMicroloans(request);
        return data.map(toMicroloanPreview);
      }
      default:
        return [];
    }
  },
);

/** Топ обменников — из основного API, а не из Strapi. */
export const getTopExchangerPreviews = cache(
  async (limit = PREVIEW_LIMIT): Promise<RatingPreview[]> => {
    try {
      const exchangers = await getTopExchangers();
      return (exchangers ?? []).slice(0, limit).map(toExchangerPreview);
    } catch (error) {
      // Страница-витрина не должна падать из-за одного блока
      console.error("getTopExchangerPreviews error:", error);
      return [];
    }
  },
);

/** Чёрный список — тоже из основного API. getBlackList бросает, поэтому try/catch. */
export const getBlacklistPreviews = cache(
  async (limit = PREVIEW_LIMIT): Promise<RatingPreview[]> => {
    try {
      const blacklist = await getBlackList();
      return (blacklist ?? []).slice(0, limit).map(toBlacklistPreview);
    } catch (error) {
      console.error("getBlacklistPreviews error:", error);
      return [];
    }
  },
);
