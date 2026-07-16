import {
  GetVedAgentBySlugRequest,
  GetVedAgentBySlugResponse,
  GetVedAgentsRequest,
  GetVedAgentsResponse,
  GetVedPageResponse,
  VedAgent,
} from "./ved-dto";

const getStrapiUrl = (path: string) => `${process.env.STRAPI_BASE_URL}/api/${path}`;

export const getVedPage = async (): Promise<GetVedPageResponse> => {
  try {
    const res = await fetch(getStrapiUrl("ved-page"), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["ved-page"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ved-page: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    return res.json();
  } catch (error) {
    console.error("getVedPage error:", error);
    return { data: null };
  }
};

export const getVedAgents = async ({
  page,
  pageSize,
}: GetVedAgentsRequest = {}): Promise<GetVedAgentsResponse> => {
  try {
    // VIP-агенты всегда идут первыми в выдаче.
    let path = "ved-agents?sort[0]=is_vip:desc&sort[1]=publishedAt:asc";
    if (page) {
      path += `&pagination[page]=${page}&pagination[pageSize]=${pageSize ?? 2}`;
    }

    const res = await fetch(getStrapiUrl(path), {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["ved-agents"] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ved-agents: ${res.status} ${res.statusText}`);
      return { data: [] };
    }

    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta };
  } catch (error) {
    console.error("getVedAgents error:", error);
    return { data: [] };
  }
};

/**
 * Забирает всех агентов (все страницы) для клиентской фильтрации.
 * VIP-сортировка сохраняется тем же порядком, что и в getVedAgents.
 */
export const getAllVedAgents = async (): Promise<VedAgent[]> => {
  try {
    const pageSize = 100;
    const first = await getVedAgents({ page: 1, pageSize });
    const pageCount = first.meta?.pagination?.pageCount ?? 1;
    const agents = [...first.data];

    for (let page = 2; page <= pageCount; page++) {
      const res = await getVedAgents({ page, pageSize });
      agents.push(...res.data);
    }

    return agents;
  } catch (error) {
    console.error("getAllVedAgents error:", error);
    return [];
  }
};

export const getVedAgentBySlug = async ({
  slug,
}: GetVedAgentBySlugRequest): Promise<GetVedAgentBySlugResponse> => {
  try {
    const res = await fetch(
      getStrapiUrl(`ved-agents?filters[slug][$eq]=${encodeURIComponent(slug)}`),
      {
        method: "GET",
        cache: "force-cache",
        next: { tags: ["ved-agents", `ved-agent-${slug}`] },
      },
    );

    if (!res.ok) {
      console.error(`Failed to fetch ved-agent: ${res.status} ${res.statusText}`);
      return { data: null };
    }

    const json = await res.json();
    const agent = (json.data?.[0] as VedAgent | undefined) ?? null;
    return { data: agent };
  } catch (error) {
    console.error("getVedAgentBySlug error:", error);
    return { data: null };
  }
};

export function stripHtmlToText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
