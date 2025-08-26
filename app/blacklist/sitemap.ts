import { MetadataRoute } from "next";
import { getBlackList, getExchangerList } from "@/entities/exchanger";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blackList = await getBlackList();
  return blackList.map((blackList) => ({
    url: `${baseUrl}${routes.blacklist}/exchanger-${blackList.id}__${blackList.exchange_marker}`,
    priority: 0.7,
    lastModified: new Date(),
    changeFrequency: "monthly",
  }));
}
