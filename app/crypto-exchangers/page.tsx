import { Metadata } from "next";
import { CryptoExchangersPage } from "@/views/crypto-exchangers";
import { getExchangerList } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

export default async function Page() {
  const exchangers = await getExchangerList();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Список обменников MoneySwap. Только проверенные вручную криптообменные пункты.",
    "description": "Сравните условия лучших криптообменников на MoneySwap. Выбирайте выгодные курсы, изучайте рейтинги, оставляйте отзывы и находите проверенные обменные пункты.",
    "itemListElement": exchangers.map((exchanger, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Organization",
        "name": exchanger.exchangerName,
        "url": exchanger.url,
        "aggregateRating": {
          "@type": "AggregateRating",
          "reviewCount": exchanger.reviews.negative + exchanger.reviews.neutral + exchanger.reviews.positive,
          "ratingValue": ((exchanger.reviews.positive * 5) + (exchanger.reviews.neutral * 3) + (exchanger.reviews.negative * 1)) / (exchanger.reviews.positive + exchanger.reviews.neutral + exchanger.reviews.negative)
        },
        "additionalProperty": [
          { "@type": "PropertyValue", "name": "positiveReviews", "value": exchanger.reviews.positive },
          { "@type": "PropertyValue", "name": "neutralReviews", "value": exchanger.reviews.neutral },
          { "@type": "PropertyValue", "name": "negativeReviews", "value": exchanger.reviews.negative },
          { "@type": "PropertyValue", "name": "status", "value": exchanger.workStatus },
          { "@type": "PropertyValue", "name": "reserves", "value": exchanger.reserves },
          { "@type": "PropertyValue", "name": "directionsCount", "value": exchanger.courses }
        ]
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Breadcrumbs />
      <CryptoExchangersPage />
    </>
  );
}

export const metadata: Metadata = {
  title: "Список обменников MoneySwap. Только проверенные вручную криптообменные пункты.",
  description:
    "Сравните условия лучших криптообменников на MoneySwap. Выбирайте выгодные курсы, изучайте рейтинги, оставляйте отзывы и находите проверенные обменные пункты.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "Список обменников MoneySwap. Только проверенные вручную криптообменные пункты",
    description:
      "Сравните условия лучших криптообменников на MoneySwap. Выбирайте выгодные курсы, изучайте рейтинги, оставляйте отзывы и находите проверенные обменные пункты.",
    url: process.env.NEXT_PUBLIC_SITE_BASE_URL,
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
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.exchangers}`,
  },
};
