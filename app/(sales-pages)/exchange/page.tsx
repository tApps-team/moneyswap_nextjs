import { Metadata } from "next";
import { ExchangeRootPage } from "@/views/exchange";
import { getSeoMeta } from "@/shared/api";
import { routes } from "@/shared/router";
import { pageTypes } from "@/shared/types";
import { Breadcrumbs } from "@/shared/ui";

export const revalidate = 10;

export type Props = {
  searchParams?: { direction?: string; city?: string };
};

export default function Page({ searchParams }: Props) {
  const canonical = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.exchange}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Обмен валюты",
    url: canonical,
    description:
      "Курсы проверенных обменников криптовалюты: выберите пару валют и город, сравните предложения и перейдите к обмену.",
    mainEntity: {
      "@type": "Service",
      name: "Обмен валюты",
      serviceType: "Обмен валюты и электронных денег",
      provider: {
        "@type": "Organization",
        name: "MoneySwap",
        url: process.env.NEXT_PUBLIC_SITE_BASE_URL,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumbs />
      <ExchangeRootPage searchParams={searchParams} />
    </>
  );
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // Тексты под ключом main описывают именно обменную витрину — она теперь живёт здесь.
  const seoMeta = await getSeoMeta({ page: pageTypes.main });
  const direction = searchParams?.direction;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.exchange}${
    direction ? `?direction=${direction}` : ""
  }`;

  const defaultTitle = "Обмен валюты — курсы проверенных обменников | MoneySwap";
  const defaultDescription =
    "Выберите пару валют и город: MoneySwap покажет актуальные курсы проверенных обменников, отзывы и статус их работы.";

  const baseTitle = seoMeta?.data?.[0]?.title || defaultTitle;
  const baseDescription = seoMeta?.data?.[0]?.description || defaultDescription;

  const meta_title = direction === "cash" ? `${baseTitle} | Наличный обмен` : baseTitle;
  const meta_description =
    direction === "cash" ? `${baseDescription} | Наличный обмен` : baseDescription;

  return {
    title: meta_title,
    description: meta_description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: meta_title,
      description: meta_description,
      url: canonicalUrl,
      siteName: "MoneySwap",
      images: [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
      locale: "ru-RU",
      type: "website",
    },
    alternates: { canonical: canonicalUrl },
  };
}
