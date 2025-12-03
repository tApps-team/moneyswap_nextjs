import { MetadataRoute } from "next";
import { getAllCategories } from "@/entities/strapi";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getAllCategories();
  return categories?.data?.categories?.map((category) => ({
    url: `${baseUrl}${routes.blog}${routes.category}/${category?.category}`,
    priority: 0.5,
    lastModified: new Date(),
    changeFrequency: "hourly",
  }));
}
