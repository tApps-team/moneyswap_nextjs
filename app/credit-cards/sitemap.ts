import type { MetadataRoute } from "next";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 3600;

/** У кредитных карт нет детальных страниц — в карте сайта только раздел. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${baseUrl}${routes.credit_cards}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
