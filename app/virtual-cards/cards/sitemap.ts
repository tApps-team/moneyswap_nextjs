import type { MetadataRoute } from "next";
import { getVirtualCards } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [international, russian] = await Promise.all([
    getVirtualCards({ marketType: "international" }),
    getVirtualCards({ marketType: "russian" }),
  ]);

  const cards = [...(international.data ?? []), ...(russian.data ?? [])];

  return cards.map((card) => ({
    url: `${baseUrl}${routes.vc_cards}/${card.slug}`,
    lastModified: card.publishedAt ? new Date(card.publishedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
