import { MetadataRoute } from "next";
import { getAllArticles } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 10;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles({ page: 1 });
  return articles?.data?.map((article) => ({
    url: `${baseUrl}${routes.blog}${routes.article}/${article?.url_name}`,
    priority: 0.6,
    lastModified: new Date(),
    changeFrequency: "hourly",
  }));
}
