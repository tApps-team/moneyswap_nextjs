import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreditPage } from "@/views/credit";
import { getAllBankCredits, getBankCreditBySlug } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: credit } = await getBankCreditBySlug({ slug: params.slug });

  if (!credit) {
    return { title: "Кредит не найден | MoneySwap" };
  }

  const bankTitle = credit.bank?.title ?? "";
  const title = `Кредит «${credit.name}»${bankTitle ? ` — ${bankTitle}` : ""} | MoneySwap`;
  const description =
    credit.description ??
    `Условия кредита: сумма ${credit.amount ?? "—"}, срок ${credit.term ?? "—"}, ставка ${credit.rate ?? "—"}.`;
  const canonical = `${baseUrl}${routes.credits}/${credit.slug}`;

  return {
    title,
    description: description.slice(0, 300),
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description: description.slice(0, 300),
      url: canonical,
      siteName: "MoneySwap",
      images: credit.logo
        ? [{ url: credit.logo, width: 400, height: 400, alt: bankTitle || credit.name }]
        : [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: { canonical },
  };
}

export async function generateStaticParams() {
  const credits = await getAllBankCredits();
  return credits.map((credit) => ({ slug: credit.slug }));
}

export default async function Page({ params }: Props) {
  const { data: credit } = await getBankCreditBySlug({ slug: params.slug });

  if (!credit) {
    notFound();
  }

  const canonical = `${baseUrl}${routes.credits}/${credit.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LoanOrCredit",
    name: credit.bank ? `${credit.bank.title} — ${credit.name}` : credit.name,
    ...(credit.logo && { image: credit.logo }),
    description: credit.description ?? `Потребительский кредит «${credit.name}»`,
    url: canonical,
    currency: "RUB",
    ...(credit.bank && {
      provider: { "@type": "BankOrCreditUnion", name: credit.bank.title },
    }),
    ...(credit.amount_limits?.to && { amount: Number(credit.amount_limits.to) }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumbs bankCreditName={credit.name} />
      <CreditPage slug={params.slug} />
    </>
  );
}
