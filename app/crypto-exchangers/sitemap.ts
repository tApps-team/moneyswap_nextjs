import { MetadataRoute } from "next";
import { getExchangerList } from "@/entities/exchanger";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cryptoExchangers = await getExchangerList();
  return cryptoExchangers.map((cryptoExchanger) => ({
    url: `${baseUrl}${routes.exchangers}/exchanger-${cryptoExchanger.id}__${cryptoExchanger.exchange_marker}`,
    priority: 0.7,
    lastModified: new Date(),
    changeFrequency: "monthly",
  }));
}
