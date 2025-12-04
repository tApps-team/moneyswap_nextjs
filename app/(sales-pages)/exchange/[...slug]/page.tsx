import { Metadata, ResolvingMetadata } from "next";
import { ExchangePage } from "@/views/exchange";
import { getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";
import { getSeoMeta } from "@/shared/api";
import { routes } from "@/shared/router";
import { pageTypes } from "@/shared/types";
import { Breadcrumbs } from "@/shared/ui";

export const revalidate = 60;
export const dynamic = 'auto';
export const dynamicParams = true;

type Props = {
  params: { slug: string };
  searchParams?: { city?: string; direction: "cash" };
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

export default async function Page({ params, searchParams }: Props) {
  const slug = params.slug[0];
  const city = searchParams?.city;
  const direction = searchParams?.direction;

  const [valute_from, valute_to] = slug.split("-to-").map((str) => str.toLowerCase());
  // Получаем данные валют и города
  const giveCurrency = await getSpecificValute({ codeName: valute_from });
  const getCurrency = await getSpecificValute({ codeName: valute_to });
  const location = city ? await getSpecificCity({ codeName: city }) : undefined;

  // Формируем URL с query-параметрами
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";
  const currentUrl = new URL(`${routes.exchange}/${slug}`, baseUrl);
  if (direction) currentUrl.searchParams.append("direction", direction);
  if (city) currentUrl.searchParams.append("city", city);

  const exchangers = await getExchangers({
    valute_from: giveCurrency.code_name,
    valute_to: getCurrency.code_name,
    city: location?.code_name,
  });

  // Формируем JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Обмен ${giveCurrency?.name?.ru} на ${getCurrency?.name?.ru}${location ? " в " + location?.name?.ru : ""}`,
    "description": `Обменяйте ${giveCurrency?.name?.ru} (${giveCurrency?.code_name}) на ${getCurrency?.name?.ru} (${getCurrency?.code_name})${location ? " в городе " + location?.name?.ru : ""} через MoneySwap — агрегатор лучших обменников.`,
    "url": currentUrl.toString(),
    "mainEntity": {
      "@type": "Service",
      "serviceType": "Обмен валют",
      "areaServed": location ? location?.name?.ru : "Россия",
      "provider": {
        "@type": "Organization",
        "name": "MoneySwap"
      },
      "offers": {
        "@type": "AggregateOffer",
        "offerCount": exchangers.exchangers?.length,
        "offers": exchangers.exchangers?.map(exchanger => ({
          "@type": "Offer",
          "name": exchanger.name.ru,
          "price": exchanger.in_count,
          "priceCurrency": getCurrency?.code_name?.toUpperCase(),
          "url": exchanger.partner_link,
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": exchanger.in_count,
            "priceCurrency": getCurrency?.code_name?.toUpperCase(),
            "referenceQuantity": {
              "@type": "QuantitativeValue",
              "value": exchanger.out_count,
              "unitCode": getCurrency?.code_name?.toUpperCase()
            }
          },
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "in_count",
              "value": exchanger.in_count
            },
            {
              "@type": "PropertyValue",
              "name": "out_count",
              "value": exchanger.out_count
            }
          ]
        }))
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Breadcrumbs exchange={"Обмен " + giveCurrency?.name?.ru + " на " + getCurrency?.name?.ru} />
      <ExchangePage params={params} searchParams={searchParams} />
    </>
  );
}
