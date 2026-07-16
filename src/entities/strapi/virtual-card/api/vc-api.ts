import {
  GetVcPageResponse,
  GetVirtualCardBySlugRequest,
  GetVirtualCardBySlugResponse,
  GetVirtualCardsRequest,
  GetVirtualCardsResponse,
  VcMarketType,
  VirtualCard,
} from "./vc-dto";

const getStrapiUrl = (path: string) => `${process.env.STRAPI_BASE_URL}/api/${path}`;

export const getVcPage = async (): Promise<GetVcPageResponse> => {
  try {
    const res = await fetch(getStrapiUrl("vc-page"), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["vc-page"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch vc-page: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    return res.json();
  } catch (error) {
    console.error("getVcPage error:", error);
    return { data: null };
  }
};

export const getVirtualCards = async ({
  marketType,
  page,
  pageSize,
}: GetVirtualCardsRequest): Promise<GetVirtualCardsResponse> => {
  try {
    // VIP-сервисы всегда идут первыми в выдаче.
    let path = `virtual-cards?filters[market_type][$eq]=${marketType}&sort[0]=is_vip:desc&sort[1]=publishedAt:asc`;
    if (page) {
      path += `&pagination[page]=${page}&pagination[pageSize]=${pageSize ?? 2}`;
    }

    const res = await fetch(getStrapiUrl(path), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["virtual-cards", `virtual-cards-${marketType}`] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch virtual-cards: ${res.status} ${res.statusText}`);
      return { data: [] };
    }

    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta };
  } catch (error) {
    console.error("getVirtualCards error:", error);
    return { data: [] };
  }
};

/**
 * Забирает все виртуальные карты выбранного рынка (все страницы) для клиентской фильтрации.
 * VIP-сортировка сохраняется тем же порядком, что и в getVirtualCards.
 */
export const getAllVirtualCards = async (marketType: VcMarketType): Promise<VirtualCard[]> => {
  try {
    const pageSize = 100;
    const first = await getVirtualCards({ marketType, page: 1, pageSize });
    const pageCount = first.meta?.pagination?.pageCount ?? 1;
    const cards = [...first.data];

    for (let page = 2; page <= pageCount; page++) {
      const res = await getVirtualCards({ marketType, page, pageSize });
      cards.push(...res.data);
    }

    return cards;
  } catch (error) {
    console.error("getAllVirtualCards error:", error);
    return [];
  }
};

export const getVirtualCardBySlug = async ({
  slug,
}: GetVirtualCardBySlugRequest): Promise<GetVirtualCardBySlugResponse> => {
  try {
    const res = await fetch(
      getStrapiUrl(`virtual-cards?filters[slug][$eq]=${encodeURIComponent(slug)}`),
      {
        method: "GET",
        cache: "force-cache",
        next: { tags: ["virtual-cards", `virtual-card-${slug}`] },
      },
    );

    if (!res.ok) {
      console.error(`Failed to fetch virtual-card: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    const json = await res.json();
    const card = (json.data?.[0] as VirtualCard | undefined) ?? null;
    return { data: card };
  } catch (error) {
    console.error("getVirtualCardBySlug error:", error);
    return { data: null };
  }
};
