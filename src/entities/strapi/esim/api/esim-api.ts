import {
  GetEsimBySlugRequest,
  GetEsimBySlugResponse,
  GetEsimPageResponse,
  GetEsimsRequest,
  GetEsimsResponse,
} from "./esim-dto";

const getStrapiUrl = (path: string) => `${process.env.STRAPI_BASE_URL}/api/${path}`;

const esimPopulate = "populate=labels,countries,payment_systems,reviews";

export const getEsimPage = async (): Promise<GetEsimPageResponse> => {
  try {
    const res = await fetch(getStrapiUrl("esim-page"), {
      method: "GET",
      cache: "no-store",
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
  noStore,
}: GetEsimsRequest): Promise<GetEsimsResponse> => {
  try {
    // VIP-сервисы всегда идут первыми в выдаче.
    let path = `e-sims?filters[market_type][$eq]=${marketType}&sort[0]=is_vip:desc&sort[1]=publishedAt:asc&${esimPopulate}`;
    if (page) {
      path += `&pagination[page]=${page}&pagination[pageSize]=${pageSize ?? 2}`;
    }

    const res = await fetch(getStrapiUrl(path), {
      method: "GET",
      ...(noStore
        ? { cache: "no-store" as const }
        : { cache: "force-cache" as const, next: { tags: ["e-sims", `e-sims-${marketType}`] } }),
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
