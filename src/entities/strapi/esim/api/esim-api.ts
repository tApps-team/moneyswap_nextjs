import {
  Esim,
  EsimMarketType,
  GetEsimBySlugRequest,
  GetEsimBySlugResponse,
  GetEsimPageResponse,
  GetEsimsRequest,
  GetEsimsResponse,
} from "./esim-dto";

const getStrapiUrl = (path: string) => `${process.env.STRAPI_BASE_URL}/api/${path}`;

const esimPopulate = "populate=labels,countries,payment_systems,reviews,promocodes";

export const getEsimPage = async (): Promise<GetEsimPageResponse> => {
  try {
    const res = await fetch(getStrapiUrl("esim-page"), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["esim-page"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch esim-page: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    return res.json();
  } catch (error) {
    console.error("getEsimPage error:", error);
    return { data: null };
  }
};

export const getEsims = async ({
  marketType,
  page,
  pageSize,
}: GetEsimsRequest): Promise<GetEsimsResponse> => {
  try {
    // VIP-сервисы всегда идут первыми в выдаче.
    let path = `e-sims?filters[market_type][$eq]=${marketType}&sort[0]=is_vip:desc&sort[1]=publishedAt:asc&${esimPopulate}`;
    if (page) {
      path += `&pagination[page]=${page}&pagination[pageSize]=${pageSize ?? 2}`;
    }

    const res = await fetch(getStrapiUrl(path), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["e-sims", `e-sims-${marketType}`] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch e-sims: ${res.status} ${res.statusText}`);
      return { data: [] };
    }

    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta };
  } catch (error) {
    console.error("getEsims error:", error);
    return { data: [] };
  }
};

/**
 * Забирает все eSIM выбранного рынка (все страницы) для клиентской фильтрации.
 * VIP-сортировка сохраняется тем же порядком, что и в getEsims.
 */
export const getAllEsims = async (marketType: EsimMarketType): Promise<Esim[]> => {
  try {
    const pageSize = 100;
    const first = await getEsims({ marketType, page: 1, pageSize });
    const pageCount = first.meta?.pagination?.pageCount ?? 1;
    const services = [...first.data];

    for (let page = 2; page <= pageCount; page++) {
      const res = await getEsims({ marketType, page, pageSize });
      services.push(...res.data);
    }

    return services;
  } catch (error) {
    console.error("getAllEsims error:", error);
    return [];
  }
};

export const getEsimBySlug = async ({
  slug,
}: GetEsimBySlugRequest): Promise<GetEsimBySlugResponse> => {
  try {
    const res = await fetch(getStrapiUrl(`e-sims/${encodeURIComponent(slug)}?${esimPopulate}`), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["e-sims", `e-sim-${slug}`] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch e-sim: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    const json = await res.json();
    return { data: json.data ?? null };
  } catch (error) {
    console.error("getEsimBySlug error:", error);
    return { data: null };
  }
};
