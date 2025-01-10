import { Metadata } from "next";
import { CryptoExchangersPage } from "@/views/crypto-exchangers";
import { routes } from "@/shared/router";
export default CryptoExchangersPage;

export const metadata: Metadata = {
  title: "Список обменников MoneySwap. Только проверенные вручную криптообменные пункты.",
  description:
    "Сравните условия лучших криптообменников на MoneySwap. Выбирайте выгодные курсы, изучайте рейтинги, оставляйте отзывы и находите проверенные обменные пункты.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "Список обменников MoneySwap. Только проверенные вручную криптообменные пункты",
    description:
      "Сравните условия лучших криптообменников на MoneySwap. Выбирайте выгодные курсы, изучайте рейтинги, оставляйте отзывы и находите проверенные обменные пункты.",
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
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.exchangers}`,
  },
};
