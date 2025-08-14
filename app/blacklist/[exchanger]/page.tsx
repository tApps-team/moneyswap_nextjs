import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { BlacklistExchangerPage } from "@/views/blacklist-exchanger";
import { getExchangerDetails } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { ExchangerMarker } from "@/shared/types";
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

  const exchangerDetails = await getExchangerDetails({
    exchange_id: Number(exchangerId),
    exchange_marker: marker as ExchangerMarker,
  });

  if (!exchangerDetails) return notFound();
  
  const ratingValue = ((exchangerDetails.reviews.positive * 5) + (exchangerDetails.reviews.neutral * 3) + (exchangerDetails.reviews.negative * 1)) / (exchangerDetails.reviews.positive + exchangerDetails.reviews.neutral + exchangerDetails.reviews.negative);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `${exchangerDetails.name} - был заподозрен в совершении мошеннических действий, обмане пользователей или других незаконных действиях. Будьте осторожны!`,
    "url": exchangerDetails?.url,
    "logo": exchangerDetails?.iconUrl,
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
      <BlacklistExchangerPage params={params} />
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
    const exchangerDetails = await getExchangerDetails({
      exchange_id: Number(exchangerId),
      exchange_marker: marker as ExchangerMarker,
    });

    if (!exchangerDetails) {
      return notFound();
    }

    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blacklist}/exchanger-${exchangerId}__${marker}`;

    return {
      title: `Обменный пункт ${exchangerDetails.name} - был заподозрен в совершении мошеннических действий, обмане пользователей или других незаконных действиях. Будьте осторожны!`,
      description: `${exchangerDetails.name} — входит в черный список криптообменников на MoneySwap. Будьте осторожны! MoneySwap крайне не рекомендует пользоваться этим обменником.`,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
      openGraph: {
        title: `Обменный пункт ${exchangerDetails.name} - был заподозрен в совершении мошеннических действий, обмане пользователей или других незаконных действиях. Будьте осторожны!`,
        description: `${exchangerDetails.name} — входит в черный список криптообменников на MoneySwap. Будьте осторожны! MoneySwap крайне не рекомендует пользоваться этим обменником.`,
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
