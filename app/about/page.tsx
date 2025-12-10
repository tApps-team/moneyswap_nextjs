import { Metadata } from "next";
import { AboutPage } from "@/views/about";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'MoneySwap — ваш проводник в мире обмена, переводов и платежных решений',
    'description': 'Узнайте больше о MoneySwap — платформе, где собраны лучшие обменники. Мы помогаем находить выгодные курсы и надёжные обменные пункты для комфортного обмена криптовалюты.',
    'url': `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.about}`,
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
      <AboutPage />
    </>
  );
}

export const metadata: Metadata = {
  title: "MoneySwap — ваш проводник в мире обмена, переводов и платежных решений | TEST CI/CD",
  description:
    "Узнайте больше о MoneySwap — платформе, где собраны лучшие обменники. Мы помогаем находить выгодные курсы и надёжные обменные пункты для комфортного обмена криптовалюты.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.about}`,
  },
  openGraph: {
    title: "MoneySwap — ваш проводник в мире обмена , переводов и платежных решений",
    description:
      "Узнайте больше о MoneySwap — платформе, где собраны лучшие обменники. Мы помогаем находить выгодные курсы и надёжные обменные пункты для комфортного обмена криптовалюты.",
    url: routes.about,
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
