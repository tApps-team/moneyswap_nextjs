import { Metadata } from "next";
import { ForPartnersPage } from "@/views/for-partners";
import { routes } from "@/shared/router";

export default ForPartnersPage;
const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.partners}`;
export const metadata: Metadata = {
  title: "Контакты MoneySwap: как с нами связаться",
  description:
    "Свяжитесь с MoneySwap! Наши контакты для вопросов, предложений и партнёрства. Напишите нам на info@moneyswap.ru или позвоните по телефону +7(495) 109-20-08.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Контакты MoneySwap: как с нами связаться",
    description:
      "Свяжитесь с MoneySwap! Наши контакты для вопросов, предложений и партнёрства. Напишите нам на info@moneyswap.ru или позвоните по телефону +7(495) 109-20-08.",
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
