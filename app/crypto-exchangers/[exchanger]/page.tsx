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

  const formattedDate = exchangerDetails.openOnMoneySwap ? new Date(exchangerDetails.openOnMoneySwap).toLocaleDateString('ru-RU') : "___";

  return {
    title: `Обменный пункт ${exchangerDetails.name} | Отзывы на MoneySwap`,
    description: `${exchangerDetails.name} — проверенный обменник криптовалют, размещён на MoneySwap с ${formattedDate}. За это время он рекомендовал себя, как стабильный обменный сервис. Сейчас ${exchangerDetails.name} активен в ${exchangerDetails.exchangeRates || "___"} направлений обмена.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: `Обменный пункт ${exchangerDetails.name} | MoneySwap`,
      description: `${exchangerDetails.name} — проверенный обменник криптовалют, размещён на MoneySwap с ${formattedDate}. За это время он рекомендовал себя, как стабильный обменный сервис. Сейчас ${exchangerDetails.name} активен в ${exchangerDetails.exchangeRates || "___"} направлений обмена.`,
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
