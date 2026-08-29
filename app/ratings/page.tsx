import { Metadata } from "next";
import { RatingsPage } from "@/views/ratings";
import { RATING_SECTIONS } from "@/shared/consts";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";

const TITLE = "Рейтинги сервисов | MoneySwap";
const DESCRIPTION =
  "Рейтинги MoneySwap: платёжные агенты ВЭД, виртуальные карты, eSIM, оплата зарубежных сервисов, дебетовые и кредитные карты, кредиты и микрозаймы.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(baseUrl || "http://localhost:3000"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${baseUrl}${routes.ratings}`,
    siteName: "MoneySwap",
    images: [{ url: "/og_logo.svg", width: 400, height: 283, alt: "MoneySwap" }],
    locale: "ru-RU",
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}${routes.ratings}`,
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Рейтинги сервисов MoneySwap",
    description: DESCRIPTION,
    itemListElement: RATING_SECTIONS.map((section, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: section.title,
      description: section.description,
      url: `${baseUrl}${section.href}`,
    })),
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
      <RatingsPage />
    </>
  );
}
