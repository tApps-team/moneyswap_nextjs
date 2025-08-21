import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlacklistExchangerPage } from "@/views/blacklist-exchanger";
import { CryptoExchangerBlackList } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { ExchangerStatus } from "@/shared/types";
import { Breadcrumbs } from "@/shared/ui";

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: { exchanger: string };
  searchParams: { grade?: number; page?: number; };
}) {
  if (!params?.exchanger) return notFound();
  const [exchangerId, marker] = params.exchanger.split('__');
  if (!exchangerId || !marker) return notFound();

      // mock data
      const exchangerDetails: CryptoExchangerBlackList = {
        id: 1,
        name: {ru: "тестовый обменник", en: "test exchange"},
        exchange_marker: ExchangerStatus.scam,
        url: "https://test.com",
     }

  if (!exchangerDetails) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `${exchangerDetails.name?.ru} - заподозрен в мошеннических действиях. Пользователи сообщают, что после перевода средств обмен не производится, а служба поддержки либо игнорирует обращения, либо полностью пропадает. Будьте осторожны!`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Breadcrumbs exchangerName={exchangerDetails?.name?.ru} />
      <BlacklistExchangerPage params={params} />
    </>
  );
}

type Props = {
  params: { exchanger: string };
  searchParams: { grade?: number; page?: number };
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  if (!params?.exchanger) {
    return notFound();
  }
  const [exchangerId, marker] = params.exchanger.split('__');
  
  if (!exchangerId || !marker) {
    return notFound();
  }

  try {

      // mock data
      const exchangerDetails: CryptoExchangerBlackList = {
          id: 1,
          name: {ru: "тестовый обменник", en: "test exchange"},
          exchange_marker: ExchangerStatus.scam,
          url: "https://test.com",
       }

    if (!exchangerDetails) {
      return notFound();
    }

    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blacklist}/exchanger-${exchangerId}__${marker}`;

    return {
      title: `Обменник валют ${exchangerDetails?.name?.ru} — в черном списке на MoneySwap!`,
      description: `MoneySwap предупреждает: обменник ${exchangerDetails?.name?.ru} признан скам-проектом. Пользователи сообщают о неполучении перевода после оплаты и блокировке аккаунтов. Обмен валют через данный обменник может привести к полной потере средств.`,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
      openGraph: {
        title: `Обменник валют ${exchangerDetails?.name?.ru} — в черном списке на MoneySwap!`,
        description: `MoneySwap предупреждает: обменник ${exchangerDetails?.name?.ru} признан скам-проектом. Пользователи сообщают о неполучении перевода после оплаты и блокировке аккаунтов. Обмен валют через данный обменник может привести к полной потере средств.`,
        url: canonicalUrl,
        siteName: "MoneySwap",
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
