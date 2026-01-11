import { Metadata, ResolvingMetadata } from "next";
import { Main } from "@/views/main";
import { getSeoMeta } from "@/shared/api";
import { routes } from "@/shared/router";
import { pageTypes } from "@/shared/types";

export const revalidate = 10;
export const dynamicParams = true;

// Типы для props
export type Props = {
  searchParams?: { direction?: string; city?: string };
};

export default function Page({ searchParams }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MoneySwap",
    "url": process.env.NEXT_PUBLIC_SITE_BASE_URL,
    "description": "MoneySwap — агрегатор обменников криптовалют. Лучшие курсы, проверенные обменники, быстрый поиск.",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\u003c'),
        }}
      />
      <Main searchParams={searchParams} />
    </>
  );
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const reqParams = {
    page: pageTypes.main,
  };

  const seoMeta = await getSeoMeta(reqParams);
  const direction = searchParams?.direction;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.home}${direction ? `?direction=${direction}` : ""}`;
  
  // Fallback значения если SEO метаданные не пришли
  const defaultTitle = "MoneySwap — Агрегатор обменников криптовалют";
  const defaultDescription = "MoneySwap — агрегатор обменников криптовалют. Лучшие курсы, проверенные обменники, быстрый поиск.";
  
  const baseTitle = seoMeta?.data?.[0]?.title || defaultTitle;
  const baseDescription = seoMeta?.data?.[0]?.description || defaultDescription;
  
  const meta_title = direction === "cash"
    ? `${baseTitle} | Наличный обмен`
    : baseTitle;
  const meta_description = direction === "cash"
    ? `${baseDescription} | Наличный обмен`
    : baseDescription;

  return {
    title: meta_title,
    description: meta_description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta_title,
      description: meta_description,
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
  };
}
