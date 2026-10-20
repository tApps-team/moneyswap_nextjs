import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DebitCardPage } from "@/views/debit-card";
import {
  DebitCard,
  getAllDebitCards,
  getCashbackValue,
  getDebitCardBySlug,
  getFirstParagraphText,
} from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

type Props = {
  params: { slug: string };
};

/** У части карт название совпадает с банком — второй раз его не повторяем. */
const buildFullName = (card: DebitCard) =>
  card.bank?.title && card.bank.title !== card.name
    ? `${card.name} — ${card.bank.title}`
    : card.name;

const buildHeading = (card: DebitCard) =>
  `Дебетовая карта «${card.name}»${
    card.bank?.title && card.bank.title !== card.name ? ` — ${card.bank.title}` : ""
  }`;

/**
 * У карт нет отдельного описания в Strapi — собираем его из условий,
 * а если все они пустые, берём описание кэшбэка либо редакторский текст.
 */
const buildDescription = (card: DebitCard) => {
  const specs = [
    card.service_cost && `обслуживание ${card.service_cost}`,
    card.transfer_limit && `лимит переводов ${card.transfer_limit}`,
    card.cashback && `кэшбэк ${card.cashback}`,
    card.percent_on_balance && `% на остаток ${card.percent_on_balance}`,
  ].filter(Boolean);

  if (!specs.length) {
    return (
      card.cashback_description ??
      getFirstParagraphText(card.about) ??
      `Дебетовая карта «${card.name}».`
    );
  }

  return `Дебетовая карта «${buildFullName(card)}»: ${specs.join(", ")}.`;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: card } = await getDebitCardBySlug({ slug: params.slug });

  if (!card) {
    return { title: "Дебетовая карта не найдена | MoneySwap" };
  }

  const title = `${buildHeading(card)}: условия и оформление | MoneySwap`;
  const description = buildDescription(card);
  const canonical = `${baseUrl}${routes.debit_cards}/${card.slug}`;

  return {
    title,
    description: description.slice(0, 300),
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description: description.slice(0, 300),
      url: canonical,
      siteName: "MoneySwap",
      images: card.logo
        ? [{ url: card.logo, width: 400, height: 400, alt: card.name }]
        : [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: { canonical },
  };
}

export async function generateStaticParams() {
  const cards = await getAllDebitCards();
  return cards.map((card) => ({ slug: card.slug }));
}

export default async function Page({ params }: Props) {
  const { data: card } = await getDebitCardBySlug({ slug: params.slug });

  if (!card) {
    notFound();
  }

  const canonical = `${baseUrl}${routes.debit_cards}/${card.slug}`;
  const cashback = getCashbackValue(card);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PaymentCard",
    name: buildFullName(card),
    ...(card.logo && { image: card.logo }),
    description: buildDescription(card),
    url: canonical,
    ...(card.bank?.title && {
      provider: { "@type": "BankOrCreditUnion", name: card.bank.title },
    }),
    ...(card.service_cost && { feesAndCommissionsSpecification: card.service_cost }),
    ...(cashback && { cashBack: cashback }),
    ...(card.rating &&
      card.reviews_count > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: card.rating,
          reviewCount: card.reviews_count,
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
      <Breadcrumbs debitCardName={card.name} />
      <DebitCardPage slug={params.slug} />
    </>
  );
}
