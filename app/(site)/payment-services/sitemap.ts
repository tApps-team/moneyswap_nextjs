import type { MetadataRoute } from "next";
import { getAllPaymentServices } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getAllPaymentServices();

  return [
    {
      url: `${baseUrl}${routes.payment_services}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...services.map((service) => ({
      url: `${baseUrl}${routes.payment_services}/${service.slug}`,
      lastModified: service.publishedAt ? new Date(service.publishedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
