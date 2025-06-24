import { Metadata } from "next";
import { ContactsPage } from "@/views/contacts";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Связь с командой MoneySwap",
    "description": "У вас есть вопросы по работе сервиса, не нашли нужный обменник в вашем городе, необходимую валюту или направление обмена? Мы всегда на связи и готовы помочь!",
    "url": `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.contacts}`,
    "mainEntity": {
      "@type": "Organization",
      "name": "MoneySwap",
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
      <ContactsPage />
    </>
  );
}

export const metadata: Metadata = {
  title: "Связь с командой MoneySwap",
  description:
    "У вас есть вопросы по работе сервиса, не нашли нужный обменник в вашем городе, необходимую валюту или направление обмена? Мы всегда на связи и готовы помочь!",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.contacts}`,
  },
  openGraph: {
    title: "Связь с командой MoneySwap",
    description:
      "У вас есть вопросы по работе сервиса, не нашли нужный обменник в вашем городе, необходимую валюту или направление обмена? Мы всегда на связи и готовы помочь!",
    url: routes.contacts,
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