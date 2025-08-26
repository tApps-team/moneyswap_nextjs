import { MetadataRoute } from "next";
import { getSitemapDirections } from "@/entities/exchanger";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const directions = await getSitemapDirections({page: 1});
  return directions?.directions?.map((direction) => ({
    url: `${baseUrl}${routes.exchange}/${direction.valute_from}-to-${direction.valute_to}${direction.city ? `?city=${direction.city}` : ""}`,
    priority: 0.7,
    lastModified: new Date(),
    changeFrequency: "daily",
  })) ?? [];
}
