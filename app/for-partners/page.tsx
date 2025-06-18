import { Metadata } from "next";
import { ForPartnersPage } from "@/views/for-partners";
import { routes } from "@/shared/router";

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Сотрудничество с MoneySwap",
    "description": "Условия сотрудничества, правила, возможности и форма обратной связи для партнёров MoneySwap.",
    "url": `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.partners}`,
    "mainEntity": {
      "@type": "Organization",
      "name": "MoneySwap",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "business",
          "email": "exchange@moneyswap.online",
          "availableLanguage": ["Russian", "English"]
        },
        {
          "@type": "ContactPoint",
          "contactType": "business",
          "url": "https://t.me/moneyswap_admin",
          "availableLanguage": ["Russian", "English"]
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <ForPartnersPage />
    </>
  );
}

const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.partners}`;
export const metadata: Metadata = {
  title: "Контакты MoneySwap: как с нами связаться",
  description:
    "Свяжитесь с MoneySwap! Наши контакты для вопросов, предложений и партнёрства. Напишите нам на exchange@moneyswap@online или в телеграм https://t.me/moneyswap_admin",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Контакты MoneySwap: как с нами связаться",
    description:
      "Свяжитесь с MoneySwap! Наши контакты для вопросов, предложений и партнёрства. Напишите нам на exchange@moneyswap@online или в телеграм https://t.me/moneyswap_admin",
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
