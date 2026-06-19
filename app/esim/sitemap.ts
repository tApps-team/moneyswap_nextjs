import type { MetadataRoute } from "next";
import { getEsims } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [international, russian] = await Promise.all([
    getEsims({ marketType: "international" }),
    getEsims({ marketType: "russian" }),
  ]);

  const services = [...(international.data ?? []), ...(russian.data ?? [])];

  return [
    {
      url: `${baseUrl}${routes.esim}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...services.map((service) => ({
      url: `${baseUrl}${routes.esim}/${service.slug}`,
      lastModified: service.publishedAt ? new Date(service.publishedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
