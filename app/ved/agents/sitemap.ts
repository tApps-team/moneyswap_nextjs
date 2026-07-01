import type { MetadataRoute } from "next";
import { getVedAgents } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agents = (await getVedAgents()).data ?? [];

  return agents.map((agent) => ({
    url: `${baseUrl}${routes.ved_agents}/${agent.slug}`,
    lastModified: agent.publishedAt ? new Date(agent.publishedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
