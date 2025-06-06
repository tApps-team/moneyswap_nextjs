import { MetadataRoute } from "next";
import { getSitemapDirections } from "@/entities/exchanger";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const directions = await getSitemapDirections();
  return directions?.map((direction) => ({
    url: `${baseUrl}${routes.exchange}/${direction.valute_from}-to-${direction.valute_to}${direction.city ? `?city=${direction.city}` : ""}`,
    priority: 0.7,
    lastModified: new Date(),
    changeFrequency: "daily",
  })) ?? [];
}
