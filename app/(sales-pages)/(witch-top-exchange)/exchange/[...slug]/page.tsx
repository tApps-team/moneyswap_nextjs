import { Metadata, ResolvingMetadata } from "next";
import { ExchangePage } from "@/views/exchange";
import { getSpecificValute } from "@/entities/currency";
import { getSpecificCity } from "@/entities/location";
import { getSeoMeta } from "@/shared/api";
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

  // запрос на мета данные
  const seoMeta = await getSeoMeta(reqParams);

  // формируем canonical URL
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}/${slug}${city ? `?city=${city}` : ""}`;

  return {
    title: seoMeta.data[0].title,
    description: seoMeta.data[0].description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: seoMeta.data[0].title,
      description: seoMeta.data[0].description,
      url: process.env.NEXT_PUBLIC_SITE_BASE_URL,
      siteName: "MoneySwap",
      images: [
        {
          url: "/og_logo.svg",
          width: 400,
          height: 200,
          alt: "MoneySwap",
        },
      ],
      locale: "ru-RU",
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
