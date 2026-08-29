import type { MetadataRoute } from "next";
import { getAllMicroloans } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const loans = await getAllMicroloans();

  return [
    {
      url: `${baseUrl}${routes.microloans}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...loans.map((loan) => ({
      url: `${baseUrl}${routes.microloans}/${loan.slug}`,
      lastModified: loan.publishedAt ? new Date(loan.publishedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
