import {
  BankCredit,
  GetBankCreditBySlugRequest,
  GetBankCreditBySlugResponse,
  GetBankCreditPageResponse,
  GetBankCreditsRequest,
  GetBankCreditsResponse,
} from "./bank-credit-dto";

const getStrapiUrl = (path: string) => `${process.env.STRAPI_BASE_URL}/api/${path}`;

export const getBankCreditPage = async (): Promise<GetBankCreditPageResponse> => {
  try {
    const res = await fetch(getStrapiUrl("bank-credit-page"), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["bank-credit-page"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch bank-credit-page: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    return res.json();
  } catch (error) {
    console.error("getBankCreditPage error:", error);
    return { data: null };
  }
};

export const getBankCredits = async ({
  page,
  pageSize,
}: GetBankCreditsRequest = {}): Promise<GetBankCreditsResponse> => {
  try {
    let path = "bank-credits?sort[0]=is_vip:desc&sort[1]=publishedAt:asc";
    if (page) {
      path += `&pagination[page]=${page}&pagination[pageSize]=${pageSize ?? 25}`;
    }

    const res = await fetch(getStrapiUrl(path), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["bank-credits"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch bank-credits: ${res.status} ${res.statusText}`);
      return { data: [] };
    }

    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta };
  } catch (error) {
    console.error("getBankCredits error:", error);
    return { data: [] };
  }
};

/** Забирает все кредиты (все страницы) для клиентской фильтрации. */
export const getAllBankCredits = async (): Promise<BankCredit[]> => {
  try {
    const pageSize = 100;
    const first = await getBankCredits({ page: 1, pageSize });
    const pageCount = first.meta?.pagination?.pageCount ?? 1;
    const credits = [...first.data];

    for (let page = 2; page <= pageCount; page++) {
      const res = await getBankCredits({ page, pageSize });
      credits.push(...res.data);
    }

    return credits;
  } catch (error) {
    console.error("getAllBankCredits error:", error);
    return [];
  }
};

export const getBankCreditBySlug = async ({
  slug,
}: GetBankCreditBySlugRequest): Promise<GetBankCreditBySlugResponse> => {
  try {
    const res = await fetch(getStrapiUrl(`bank-credits/${encodeURIComponent(slug)}`), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["bank-credits", `bank-credit-${slug}`] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch bank-credit: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    const json = await res.json();
    return { data: (json.data as BankCredit | null) ?? null };
  } catch (error) {
    console.error("getBankCreditBySlug error:", error);
    return { data: null };
  }
};
