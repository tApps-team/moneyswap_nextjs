import { Metadata } from "next";
import { Main } from "@/views/main";
import { getSeoMeta } from "@/shared/api";
import { ALL_SECTIONS } from "@/shared/consts";
import { routes } from "@/shared/router";
import { pageTypes } from "@/shared/types";

// Курсов обменников на главной больше нет: витрина рейтингов меняется заметно реже.
export const revalidate = 300;

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "MoneySwap",
        url: baseUrl,
        description:
          "MoneySwap — рейтинги финансовых сервисов: обменники криптовалюты, платёжные агенты ВЭД, виртуальные карты, eSIM, банковские карты и займы.",
      },
      {
        "@type": "ItemList",
        name: "Сервисы MoneySwap",
        itemListElement: ALL_SECTIONS.map((section, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: section.title,
          description: section.description,
          url: `${baseUrl}${section.href}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Main />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const seoMeta = await getSeoMeta({ page: pageTypes.ratings_main });
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.home}`;

  const defaultTitle = "MoneySwap — рейтинги финансовых сервисов и мониторинг обменников";
  const defaultDescription =
    "Независимые рейтинги MoneySwap: обменники криптовалюты, платёжные агенты ВЭД, виртуальные карты, eSIM, дебетовые и кредитные карты, кредиты и микрозаймы.";

  const title = seoMeta?.data?.[0]?.title || defaultTitle;
  const description = seoMeta?.data?.[0]?.description || defaultDescription;

  return {
    title,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
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
