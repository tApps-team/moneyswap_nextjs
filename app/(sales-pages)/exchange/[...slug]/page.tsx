import { Metadata, ResolvingMetadata } from "next";
import { ExchangePage } from "@/views/exchange";
import { getSpecificValute } from "@/entities/currency";
import { getSpecificCity } from "@/entities/location";
import { getSeoMeta } from "@/shared/api";
import { routes } from "@/shared/router";
import { ExchangerMarker, pageTypes } from "@/shared/types";
export default ExchangePage;

type Props = {
  params: { slug: string };
  searchParams?: { city?: string; direction: ExchangerMarker };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = params.slug[0];
  const city = searchParams?.city;

  const [valute_from, valute_to] = slug.split("-to-").map((str) => str.toLowerCase());

  const giveCurrency = await getSpecificValute({ codeName: valute_from });
  const getCurrency = await getSpecificValute({ codeName: valute_to });

  const location = city ? await getSpecificCity({ codeName: city }) : undefined;

  const reqParams = location
    ? {
        page: pageTypes.exchange_cash,
        giveCurrency: `${giveCurrency?.name?.ru} (${giveCurrency?.code_name})`,
        getCurrency: `${getCurrency?.name?.ru} (${getCurrency?.code_name})`,
        city: location?.name?.ru,
        country: location?.country?.name?.ru,
      }
    : {
        page: pageTypes.exchange_noncash,
        giveCurrency: `${giveCurrency?.name?.ru} (${giveCurrency?.code_name})`,
        getCurrency: `${getCurrency?.name?.ru} (${getCurrency?.code_name})`,
      };

  // Запрос метаданных
  const seoMeta = await getSeoMeta(reqParams);

  // Генерация текущего URL (включая параметры)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";
  const currentUrl = new URL(`${routes.exchange}/${slug}`, baseUrl);

  if (searchParams && searchParams?.direction) {
    currentUrl.searchParams.append("direction", searchParams.direction);
  }

  if (searchParams && searchParams?.city) {
    currentUrl.searchParams.append("city", searchParams.city);
  }

  return {
    title: seoMeta.data[0].title,
    description: seoMeta.data[0].description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: seoMeta.data[0].title,
      description: seoMeta.data[0].description,
      url: currentUrl.toString(),
      siteName: "MoneySwap",
      images: [
        {
          url: "/og_logo.svg",
          width: 400,
          height: 283,
          alt: "MoneySwap",
        },
      ],
      locale: "ru-RU",
      type: "website",
    },
    alternates: {
      canonical: currentUrl.toString(),
    },
  };
}
