import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { CryptoExchangerPage } from "@/views/crypto-exchanger";
import { getExchangerDetails } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { ExchangerMarker } from "@/shared/types";

export default CryptoExchangerPage;

type Props = {
  params: { exchanger: number };
  searchParams: { grade?: number; page?: number; "exchanger-marker": ExchangerMarker };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  if (!params?.exchanger) {
    return notFound();
  }

  if (!searchParams?.["exchanger-marker"]) {
    return notFound();
  }

  const exchangerDetails = await getExchangerDetails({
    exchange_id: params.exchanger,
    exchange_marker: searchParams["exchanger-marker"],
  });

  // Формирование фиксированной канонической ссылки
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.exchangers}/exchanger-${params.exchanger}?exchanger-marker=${searchParams["exchanger-marker"]}`;

  return {
    title: `Обменный пункт ${exchangerDetails.name} | Отзывы на MoneySwap`,
    description: `Обменник ${exchangerDetails.name} находится в рейтингах MoneySwap с ${exchangerDetails.openOnMoneySwap} и за это время он зарекомендовал себя, как поставщик услуг со средней оценкой ${exchangerDetails.exchangeRates}. Об обменнике есть ${exchangerDetails.reviews.positive} положительных и ${exchangerDetails.reviews.negative} отрицательных отзывов. ${exchangerDetails.name} на данный момент имеет общую сумму резервов ${exchangerDetails.amountReserves}.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: `Обменный пункт ${exchangerDetails.name} | MoneySwap`,
      description: `Обменник ${exchangerDetails.name} находится в рейтингах MoneySwap с ${exchangerDetails.openOnMoneySwap} и за это время он зарекомендовал себя, как поставщик услуг со средней оценкой ${exchangerDetails.exchangeRates}. Об обменнике есть ${exchangerDetails.reviews.positive} положительных и ${exchangerDetails.reviews.negative} отрицательных отзывов. ${exchangerDetails.name} на данный момент имеет общую сумму резервов ${exchangerDetails.amountReserves}.`,
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
}
