import type { MetadataRoute } from "next";
import { getAllBankCredits } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const credits = await getAllBankCredits();

  return [
    {
      url: `${baseUrl}${routes.credits}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...credits.map((credit) => ({
      url: `${baseUrl}${routes.credits}/${credit.slug}`,
      lastModified: credit.publishedAt ? new Date(credit.publishedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
