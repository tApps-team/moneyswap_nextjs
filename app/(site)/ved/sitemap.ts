import type { MetadataRoute } from "next";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}${routes.ved}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
