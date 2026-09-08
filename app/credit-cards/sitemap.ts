import type { MetadataRoute } from "next";
import { getAllCreditCards } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getAllCreditCards();

  return [
    {
      url: `${baseUrl}${routes.credit_cards}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...cards.map((card) => ({
      url: `${baseUrl}${routes.credit_cards}/${card.slug}`,
      lastModified: card.publishedAt ? new Date(card.publishedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
