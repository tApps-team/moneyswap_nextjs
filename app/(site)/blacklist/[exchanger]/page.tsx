import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlacklistExchangerPage } from "@/views/blacklist-exchanger";
import { getBlackListDetails } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: { exchanger: string };
  searchParams: { grade?: number; page?: number; };
}) {
  if (!params?.exchanger) return notFound();
  const exchangerId = params.exchanger;
  if (!exchangerId) return notFound();

  const exchangerDetails = await getBlackListDetails({
    exchange_id: parseInt(exchangerId),
  });
  if (!exchangerDetails) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `Осторожно! ${exchangerDetails.exchangerName?.ru} - заподозрен в мошеннических действиях. Пользователи сообщают, что после перевода средств обмен не производится, а служба поддержки либо игнорирует обращения, либо полностью пропадает. Будьте осторожны!`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Breadcrumbs exchangerName={exchangerDetails?.exchangerName?.ru} />
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
  const exchangerId = params.exchanger;
  
  if (!exchangerId) {
    return notFound();
  }

  try {
    const exchangerDetails = await getBlackListDetails({
      exchange_id: parseInt(exchangerId),
    });

    if (!exchangerDetails) {
      return notFound();
    }

    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blacklist}/exchanger-${exchangerId}`;

    return {
      title: `Осторожно мошенники! ${exchangerDetails?.exchangerName?.ru} — в черном списке на MoneySwap!`,
      description: `MoneySwap предупреждает: обменник ${exchangerDetails?.exchangerName?.ru} признан скам-проектом. Пользователи сообщают о неполучении перевода после оплаты и блокировке аккаунтов. Обмен валют через данный обменник может привести к полной потере средств. ${exchangerDetails?.linked_urls.length > 0 && `Ссылки на обменник: ${exchangerDetails?.linked_urls.join(', ')}`}`,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
      openGraph: {
        title: `Осторожно мошенники! Обменник валют ${exchangerDetails?.exchangerName?.ru} — в черном списке на MoneySwap!`,
        description: `MoneySwap предупреждает: обменник ${exchangerDetails?.exchangerName?.ru} признан скам-проектом. Пользователи сообщают о неполучении перевода после оплаты и блокировке аккаунтов. Обмен валют через данный обменник может привести к полной потере средств. ${exchangerDetails?.linked_urls.length > 0 && `Ссылки на обменник: ${exchangerDetails?.linked_urls.join(', ')}`}`,
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
