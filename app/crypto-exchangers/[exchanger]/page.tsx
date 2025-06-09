import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { CryptoExchangerPage } from "@/views/crypto-exchanger";
import { getExchangerDetails } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { ExchangerMarker } from "@/shared/types";

export default CryptoExchangerPage;

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
    const exchangerDetails = await getExchangerDetails({
      exchange_id: Number(exchangerId),
      exchange_marker: marker as ExchangerMarker,
    });

    if (!exchangerDetails) {
      return notFound();
    }

    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.exchangers}/exchanger-${exchangerId}__${marker}`;

    const formattedDate = exchangerDetails.openOnMoneySwap ? new Date(exchangerDetails.openOnMoneySwap).toLocaleDateString('ru-RU') : "___";

    const isPaginationPage = searchParams.page && Number(searchParams.page) > 1;

    const markerText = marker === ExchangerMarker.cash 
      ? "обмен наличных направлений" 
      : marker === ExchangerMarker.no_cash 
        ? "обмен безналичных направлений" 
        : marker === ExchangerMarker.both 
          ? "обмен наличных и безналичных направлений" 
          : "";

    return {
      title: `Обменный пункт ${exchangerDetails.name} ${markerText ? `— ${markerText}` : ""} | Отзывы на MoneySwap`,
      description: `${exchangerDetails.name} — проверенный обменник криптовалют${markerText ? `, совершает ${markerText}` : ""}, размещён на MoneySwap с ${formattedDate}. За это время он рекомендовал себя, как стабильный обменный сервис. Сейчас ${exchangerDetails.name} активен в ${exchangerDetails.exchangeRates || "___"} направлений обмена.`,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
      robots: isPaginationPage ? 'noindex, follow' : undefined,
      openGraph: {
        title: `Обменный пункт ${exchangerDetails.name} ${markerText ? `— ${markerText}` : ""} | Отзывы на MoneySwap`,
        description: `${exchangerDetails.name} — проверенный обменник криптовалют${markerText ? `, совершает ${markerText}` : ""}, размещён на MoneySwap с ${formattedDate}. За это время он рекомендовал себя, как стабильный обменный сервис. Сейчас ${exchangerDetails.name} активен в ${exchangerDetails.exchangeRates || "___"} направлений обмена.`,
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
