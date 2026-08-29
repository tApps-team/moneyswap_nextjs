import {
  CreditCard,
  DebitCard,
  GetCardsPageResponse,
  GetCardsRequest,
  GetCardsResponse,
} from "./cards-dto";

const getStrapiUrl = (path: string) => `${process.env.STRAPI_BASE_URL}/api/${path}`;

/** Общий загрузчик single type страницы раздела карт. */
const fetchCardsPage = async (endpoint: string, tag: string): Promise<GetCardsPageResponse> => {
  try {
    const res = await fetch(getStrapiUrl(endpoint), {
      method: "GET",
      cache: "force-cache",
      next: { tags: [tag] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    return res.json();
  } catch (error) {
    console.error(`fetchCardsPage(${endpoint}) error:`, error);
    return { data: null };
  }
};

/** Общий загрузчик списка карт: VIP-предложения идут первыми. */
const fetchCards = async <T>(
  endpoint: string,
  tag: string,
  { page, pageSize }: GetCardsRequest = {},
): Promise<GetCardsResponse<T>> => {
  try {
    let path = `${endpoint}?sort[0]=is_vip:desc&sort[1]=publishedAt:asc`;
    if (page) {
      path += `&pagination[page]=${page}&pagination[pageSize]=${pageSize ?? 25}`;
    }

    const res = await fetch(getStrapiUrl(path), {
      method: "GET",
      cache: "force-cache",
      next: { tags: [tag] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
      return { data: [] };
    }

    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta };
  } catch (error) {
    console.error(`fetchCards(${endpoint}) error:`, error);
    return { data: [] };
  }
};

/** Все страницы разом — списки карт фильтруются на клиенте. */
const fetchAllCards = async <T>(
  loader: (request: GetCardsRequest) => Promise<GetCardsResponse<T>>,
): Promise<T[]> => {
  try {
    const pageSize = 100;
    const first = await loader({ page: 1, pageSize });
    const pageCount = first.meta?.pagination?.pageCount ?? 1;
    const cards = [...first.data];

    for (let page = 2; page <= pageCount; page++) {
      const res = await loader({ page, pageSize });
      cards.push(...res.data);
    }

    return cards;
  } catch (error) {
    console.error("fetchAllCards error:", error);
    return [];
  }
};

export const getDebitCardPage = () => fetchCardsPage("debit-card-page", "debit-card-page");

export const getDebitCards = (request: GetCardsRequest = {}) =>
  fetchCards<DebitCard>("debit-cards", "debit-cards", request);

export const getAllDebitCards = () => fetchAllCards<DebitCard>(getDebitCards);

export const getCreditCardPage = () => fetchCardsPage("credit-card-page", "credit-card-page");

export const getCreditCards = (request: GetCardsRequest = {}) =>
  fetchCards<CreditCard>("credit-cards", "credit-cards", request);

export const getAllCreditCards = () => fetchAllCards<CreditCard>(getCreditCards);
