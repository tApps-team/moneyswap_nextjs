import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { CryptoExchangerPage } from "@/views/crypto-exchanger";
import { ExchangerInfo, getExchangerDetails } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { ExchangerMarker, ExchangerStatus } from "@/shared/types";
import { Breadcrumbs } from "@/shared/ui";

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
  searchParams,
}: {
  params: { exchanger: string };
  searchParams: { grade?: number; page?: number; };
}) {
  if (!params?.exchanger) return notFound();
  const [exchangerId, marker] = params.exchanger.split('__');
  if (!exchangerId || !marker) return notFound();

  // const exchangerDetails = await getExchangerDetails({
  //   exchange_id: Number(exchangerId),
  //   exchange_marker: marker as ExchangerMarker,
  // });

      // mock data
      const exchangerDetails: ExchangerInfo = {
        name: "тестовый обменник",
        iconUrl: "",
        workStatus: ExchangerStatus.disabled,
        reviews: {
          positive: 10,
          neutral: 0,
          negative: 0,
        },
        country: "Россия",
        amountReserves: "1000000",
        exchangeRates: 100,
        open: "1 год 8 месяцев",
        openOnMoneySwap: "2024-11-14T15:06:44.262543Z",
        closedOnMoneySwap: "2024-11-14T15:06:44.262543Z",
        url: "https://test.com",
        high_aml: false,
      };

  if (!exchangerDetails) return notFound();
  
  const ratingValue = ((exchangerDetails.reviews.positive * 5) + (exchangerDetails.reviews.neutral * 3) + (exchangerDetails.reviews.negative * 1)) / (exchangerDetails.reviews.positive + exchangerDetails.reviews.neutral + exchangerDetails.reviews.negative);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `${exchangerDetails.name} - ${marker === ExchangerMarker.cash 
    ? "обмен наличных направлений" 
    : marker === ExchangerMarker.no_cash 
      ? "обмен безналичных направлений" 
      : marker === ExchangerMarker.both 
        ? "обмен наличных и безналичных направлений" 
        : "обмен наличных и безналичных направлений"}`,
    "url": exchangerDetails?.url,
    "logo": exchangerDetails?.iconUrl,
    "foundingDate": exchangerDetails?.open,
    "aggregateRating": {
      "@type": "AggregateRating",
      "reviewCount": exchangerDetails.reviews.positive + exchangerDetails.reviews.neutral + exchangerDetails.reviews.negative,
      "ratingValue": ratingValue
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "positiveReviews", "value": exchangerDetails.reviews.positive },
      { "@type": "PropertyValue", "name": "neutralReviews", "value": exchangerDetails.reviews.neutral },
      { "@type": "PropertyValue", "name": "negativeReviews", "value": exchangerDetails.reviews.negative },
      { "@type": "PropertyValue", "name": "directionsCount", "value": exchangerDetails.exchangeRates }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Breadcrumbs exchangerName={exchangerDetails?.name} />
      <CryptoExchangerPage params={params} searchParams={searchParams} />
    </>
  );
}

type Props = {
  params: { exchanger: string };
  searchParams: { grade?: number; page?: number };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  if (!params?.exchanger) {
    return notFound();
  }
  const [exchangerId, marker] = params.exchanger.split('__');
  
  if (!exchangerId || !marker) {
    return notFound();
  }

  try {
    // const exchangerDetails = await getExchangerDetails({
    //   exchange_id: Number(exchangerId),
    //   exchange_marker: marker as ExchangerMarker,
    // });

          // mock data
          const exchangerDetails: ExchangerInfo = {
            name: "тестовый обменник",
            iconUrl: "",
            workStatus: ExchangerStatus.disabled,
            reviews: {
              positive: 10,
              neutral: 0,
              negative: 0,
            },
            country: "Россия",
            amountReserves: "1000000",
            exchangeRates: 100,
            open: "1 год 8 месяцев",
            openOnMoneySwap: "2024-11-14T15:06:44.262543Z",
            closedOnMoneySwap: "2024-11-14T15:06:44.262543Z",
            url: "https://test.com",
            high_aml: false,
          };

    if (!exchangerDetails) {
      return notFound();
    }

    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.exchangers}/exchanger-${exchangerId}__${marker}`;

    const formattedDate = exchangerDetails.openOnMoneySwap ? new Date(exchangerDetails.openOnMoneySwap).toLocaleDateString('ru-RU') : "___";
    const formattedClosedDate = exchangerDetails.closedOnMoneySwap ? new Date(exchangerDetails.closedOnMoneySwap).toLocaleDateString('ru-RU') : "___";

    const isPaginationPage = searchParams.page && Number(searchParams.page) > 1;

    const markerText = marker === ExchangerMarker.cash 
      ? "обмен наличных направлений" 
      : marker === ExchangerMarker.no_cash 
        ? "обмен безналичных направлений" 
        : marker === ExchangerMarker.both 
          ? "обмен наличных и безналичных направлений" 
          : "обмен наличных и безналичных направлений";

    const meta_description = exchangerDetails.workStatus === ExchangerStatus.disabled ? `С ${formattedClosedDate} обменный пункт ${exchangerDetails.name} отключён от мониторинга MoneySwap. Это связано с внутренними правилами и возможными нарушениями. Для обмена валют выбирайте те сервисы, которые продолжают быть активными на платформе.` : `${exchangerDetails.name} — стабильный обменник криптовалют, активен на MoneySwap с ${formattedDate}. В данный момент доступен в ${exchangerDetails.exchangeRates || "___"} направлениях обмена валют. Уровень AML-риска оценивается как ${exchangerDetails.high_aml ? "высокий, что может означать дополнительные проверки и возможные задержки при обмене" : "низкий, что в большинстве случаев позволяет проводить операции без задержек"}`;

    return {
      title: `Обменный пункт ${exchangerDetails.name} ${markerText ? `— ${markerText}` : ""} | Отзывы на MoneySwap`,
      description: meta_description,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
      robots: isPaginationPage ? 'noindex, follow' : undefined,
      openGraph: {
        title: `Обменный пункт ${exchangerDetails.name} ${markerText ? `— ${markerText}` : ""} | Отзывы на MoneySwap`,
        description: meta_description,
        url: canonicalUrl,
        siteName: "MoneySwap",
        images: [
          {
            url: exchangerDetails.iconUrl,
            width: 400,
            height: 200,
            alt: exchangerDetails.name,
          },
        ],
        locale: "ru-RU",
        type: "website",
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Error fetching exchanger details:', error);
    return notFound();
  }
}
