import {
  GetMicroloanBySlugRequest,
  GetMicroloanBySlugResponse,
  GetMicroloanPageResponse,
  GetMicroloansRequest,
  GetMicroloansResponse,
  Microloan,
} from "./microloan-dto";

const getStrapiUrl = (path: string) => `${process.env.STRAPI_BASE_URL}/api/${path}`;

export const getMicroloanPage = async (): Promise<GetMicroloanPageResponse> => {
  try {
    const res = await fetch(getStrapiUrl("microloan-page"), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["microloan-page"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch microloan-page: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    return res.json();
  } catch (error) {
    console.error("getMicroloanPage error:", error);
    return { data: null };
  }
};

export const getMicroloans = async ({
  page,
  pageSize,
}: GetMicroloansRequest = {}): Promise<GetMicroloansResponse> => {
  try {
    let path = "microloans?sort[0]=is_vip:desc&sort[1]=publishedAt:asc";
    if (page) {
      path += `&pagination[page]=${page}&pagination[pageSize]=${pageSize ?? 25}`;
    }

    const res = await fetch(getStrapiUrl(path), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["microloans"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch microloans: ${res.status} ${res.statusText}`);
      return { data: [] };
    }

    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta };
  } catch (error) {
    console.error("getMicroloans error:", error);
    return { data: [] };
  }
};

/** Забирает все МФО (все страницы) для клиентской фильтрации. */
export const getAllMicroloans = async (): Promise<Microloan[]> => {
  try {
    const pageSize = 100;
    const first = await getMicroloans({ page: 1, pageSize });
    const pageCount = first.meta?.pagination?.pageCount ?? 1;
    const loans = [...first.data];

    for (let page = 2; page <= pageCount; page++) {
      const res = await getMicroloans({ page, pageSize });
      loans.push(...res.data);
    }

    return loans;
  } catch (error) {
    console.error("getAllMicroloans error:", error);
    return [];
  }
};

export const getMicroloanBySlug = async ({
  slug,
}: GetMicroloanBySlugRequest): Promise<GetMicroloanBySlugResponse> => {
  try {
    const res = await fetch(getStrapiUrl(`microloans/${encodeURIComponent(slug)}`), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["microloans", `microloan-${slug}`] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch microloan: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    const json = await res.json();
    return { data: (json.data as Microloan | null) ?? null };
  } catch (error) {
    console.error("getMicroloanBySlug error:", error);
    return { data: null };
  }
};
