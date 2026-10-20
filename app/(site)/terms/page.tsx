import { Metadata } from "next";
import { TermsPage } from "@/views/terms";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TermsPage',
    'name': 'Пользовательское соглашение | MoneySwap',
    'description': 'Узнайте больше о пользовательском соглашении на MoneySwap.',
    'url': `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.terms}`,
    'mainEntity': {
      '@type': 'Organization',
      'name': 'MoneySwap',
      'description': 'MoneySwap - удобный помощник для поиска обменников в любой точке мира',
      'foundingDate': '2024',
      'sameAs': [
        'https://t.me/moneyswap',
        'https://t.me/moneyswap_robot',
        'https://vc.ru/u/3979537-moneyswap',
        'https://dzen.ru/moneyswap'
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "url": "https://t.me/moneyswap_support",
          "availableLanguage": ["Russian", "English"]
        },
        {
          "@type": "ContactPoint",
          "contactType": "partnership",
          "email": "exchange@moneyswap.online",
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
      <Breadcrumbs />
      <TermsPage />
    </>
  );
}

export const metadata: Metadata = {
  title: "Пользовательское соглашение | MoneySwap",
  description:
    "Узнайте больше о пользовательском соглашении на MoneySwap.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.terms}`,
  },
  openGraph: {
    title: "Пользовательское соглашение | MoneySwap",
    description:
      "Узнайте больше о пользовательском соглашении на MoneySwap.",
    url: routes.terms,
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
