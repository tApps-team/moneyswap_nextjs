import { Metadata } from "next";
import { notFound } from "next/navigation";
import { VirtualCardPage } from "@/views/virtual-card";
import { getVcRating, getVirtualCardBySlug } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: card } = await getVirtualCardBySlug({ slug: params.slug });

  if (!card) {
    return { title: "Сервис не найден | MoneySwap" };
  }

  const title = `${card.name} — виртуальная карта | MoneySwap`;
  const description = `${card.name}: выпуск от ${card.issuance_cost} ₽, обслуживание ${card.maintenance_info}, комиссия пополнения ${card.topup_commission}. Отзывы и промокоды на MoneySwap.`;
  const canonical = `${baseUrl}${routes.vc_cards}/${card.slug}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "MoneySwap",
      images: [{ url: card.logo || "/og_logo.svg", width: 400, height: 400, alt: card.name }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: { canonical },
  };
}

export default async function Page({ params }: Props) {
  const { data: card } = await getVirtualCardBySlug({ slug: params.slug });

  if (!card) {
    notFound();
  }

  const { ratingValue, reviewCount } = getVcRating(card.reviews);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    image: card.logo,
    description: `Виртуальная карта ${card.name}`,
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue,
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumbs vcServiceName={card.name} />
      <VirtualCardPage slug={params.slug} />
    </>
  );
}
