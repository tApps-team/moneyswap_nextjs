import { MetadataRoute } from "next";
import { getAllTags } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 10;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tags = await getAllTags();
  return tags?.data?.tags?.map((tag) => ({
    url: `${baseUrl}${routes.blog}${routes.tag}/${tag?.tag}`,
    priority: 0.5,
    lastModified: new Date(),
    changeFrequency: "hourly",
  }));
}
