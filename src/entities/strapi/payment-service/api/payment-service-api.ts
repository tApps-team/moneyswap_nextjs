import {
  GetPaymentServiceBySlugRequest,
  GetPaymentServiceBySlugResponse,
  GetPaymentServicePageResponse,
  GetPaymentServicesRequest,
  GetPaymentServicesResponse,
  PaymentService,
} from "./payment-service-dto";

const getStrapiUrl = (path: string) => `${process.env.STRAPI_BASE_URL}/api/${path}`;

export const getPaymentServicePage = async (): Promise<GetPaymentServicePageResponse> => {
  try {
    const res = await fetch(getStrapiUrl("payment-service-page"), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["payment-service-page"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch payment-service-page: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    return res.json();
  } catch (error) {
    console.error("getPaymentServicePage error:", error);
    return { data: null };
  }
};

export const getPaymentServices = async ({
  page,
  pageSize,
}: GetPaymentServicesRequest = {}): Promise<GetPaymentServicesResponse> => {
  try {
    // VIP-сервисы всегда идут первыми в выдаче.
    let path = "payment-services?sort[0]=is_vip:desc&sort[1]=publishedAt:asc";
    if (page) {
      path += `&pagination[page]=${page}&pagination[pageSize]=${pageSize ?? 25}`;
    }

    const res = await fetch(getStrapiUrl(path), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["payment-services"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch payment-services: ${res.status} ${res.statusText}`);
      return { data: [] };
    }

    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta };
  } catch (error) {
    console.error("getPaymentServices error:", error);
    return { data: [] };
  }
};

/** Забирает все сервисы (все страницы) для клиентской фильтрации. */
export const getAllPaymentServices = async (): Promise<PaymentService[]> => {
  try {
    const pageSize = 100;
    const first = await getPaymentServices({ page: 1, pageSize });
    const pageCount = first.meta?.pagination?.pageCount ?? 1;
    const services = [...first.data];

    for (let page = 2; page <= pageCount; page++) {
      const res = await getPaymentServices({ page, pageSize });
      services.push(...res.data);
    }

    return services;
  } catch (error) {
    console.error("getAllPaymentServices error:", error);
    return [];
  }
};

export const getPaymentServiceBySlug = async ({
  slug,
}: GetPaymentServiceBySlugRequest): Promise<GetPaymentServiceBySlugResponse> => {
  try {
    const res = await fetch(getStrapiUrl(`payment-services/${encodeURIComponent(slug)}`), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["payment-services", `payment-service-${slug}`] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch payment-service: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    const json = await res.json();
    return { data: (json.data as PaymentService | null) ?? null };
  } catch (error) {
    console.error("getPaymentServiceBySlug error:", error);
    return { data: null };
  }
};
