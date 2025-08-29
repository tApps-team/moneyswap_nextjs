import { Metadata } from "next";
import { BlacklistPage } from "@/views/blacklist";
import { getBlackList } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

export default async function Page() {
  const blackList = await getBlackList();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Осторожно мошенники! Черный список обменников на MoneySwap",
    "description": "Перечень обменников, сайтов, бирж, телеграм-каналов, групп, аккаунтов, которые заподозрены в совершении мошеннических действий, обмане пользователей или других незаконных действиях.",
    "itemListElement": blackList.map((exchanger, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Organization",
        "name": exchanger?.exchangerName?.ru,
        "url": exchanger?.url || "",
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
      <BlacklistPage />
    </>
  );
}

export const metadata: Metadata = {
  title: "Осторожно мошенники! Черный список обменников на MoneySwap",
  description:
    "Перечень обменников, сайтов, бирж, телеграм-каналов, групп, аккаунтов, которые заподозрены в совершении мошеннических действий, обмане пользователей или других незаконных действиях.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "Осторожно мошенники! Черный список обменников на MoneySwap",
    description:
      "Перечень обменников, сайтов, бирж, телеграм-каналов, групп, аккаунтов, которые заподозрены в совершении мошеннических действий, обмане пользователей или других незаконных действиях.",
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
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blacklist}`,
  },
};
