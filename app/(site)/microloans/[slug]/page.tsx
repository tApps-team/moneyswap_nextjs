import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MicroloanPage } from "@/views/microloan";
import {
  formatMicroloanLimit,
  formatMicroloanTerm,
  getAllMicroloans,
  getMicroloanBySlug,
} from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: loan } = await getMicroloanBySlug({ slug: params.slug });

  if (!loan) {
    return { title: "МФО не найдено | MoneySwap" };
  }

  const title = `${loan.name} — займ на карту: условия и оформление | MoneySwap`;
  const description =
    loan.description ??
    `${loan.name}: лимит ${formatMicroloanLimit(loan)}, срок ${formatMicroloanTerm(loan)}, ставка ${loan.rate ?? "—"} в день.`;
  const canonical = `${baseUrl}${routes.microloans}/${loan.slug}`;

  return {
    title,
    description: description.slice(0, 300),
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description: description.slice(0, 300),
      url: canonical,
      siteName: "MoneySwap",
      images: loan.logo
        ? [{ url: loan.logo, width: 400, height: 400, alt: loan.name }]
        : [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: { canonical },
  };
}

export async function generateStaticParams() {
  const loans = await getAllMicroloans();
  return loans.map((loan) => ({ slug: loan.slug }));
}

export default async function Page({ params }: Props) {
  const { data: loan } = await getMicroloanBySlug({ slug: params.slug });

  if (!loan) {
    notFound();
  }

  const canonical = `${baseUrl}${routes.microloans}/${loan.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LoanOrCredit",
    name: loan.name,
    ...(loan.logo && { image: loan.logo }),
    description: loan.description ?? `Займ онлайн в ${loan.name}`,
    url: canonical,
    currency: "RUB",
    ...(loan.amount_limits?.to && { amount: Number(loan.amount_limits.to) }),
    ...(loan.rating &&
      loan.reviews_count > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: loan.rating,
          reviewCount: loan.reviews_count,
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
      <Breadcrumbs microloanName={loan.name} />
      <MicroloanPage slug={params.slug} />
    </>
  );
}
