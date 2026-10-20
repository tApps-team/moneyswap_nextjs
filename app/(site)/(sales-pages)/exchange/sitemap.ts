import { MetadataRoute } from "next";
import { getSitemapDirections } from "@/entities/exchanger";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const directions = await getSitemapDirections({ page: 1 });

  // Направлений всегда десятки тысяч, поэтому пустой ответ = сбой бэкенда.
  // Бросаем ошибку, чтобы Next вернул non-200 и сохранил предыдущую валидную
  // версию, а не публиковал пустой <urlset>, который Google считает ошибкой
  // ("Тег XML отсутствует: url").
  if (!directions?.directions?.length) {
    throw new Error(
      "getSitemapDirections returned no directions; refusing to publish an empty sitemap",
    );
  }

  return directions.directions.map((direction) => ({
    url: `${baseUrl}${routes.exchange}/${direction.valute_from}-to-${direction.valute_to}${direction.city ? `?city=${direction.city}` : ""}`,
    priority: 0.7,
    lastModified: new Date(),
    changeFrequency: "daily",
  }));
}
