import { Metadata } from "next";
import { AboutPage } from "@/views/about";
import { routes } from "@/shared/router";
export default AboutPage;

export const metadata: Metadata = {
  title: "Про MoneySwap: агрегатор криптообменников",
  description:
    "Узнайте больше о MoneySwap — платформе, где собраны лучшие криптообменники. Мы помогаем находить выгодные курсы и надёжные обменные пункты для комфортного обмена криптовалюты.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.about}`,
  },
  openGraph: {
    title: "Про MoneySwap: агрегатор криптообменников",
    description:
      "Узнайте больше о MoneySwap — платформе, где собраны лучшие криптообменники. Мы помогаем находить выгодные курсы и надёжные обменные пункты для комфортного обмена криптовалюты.",
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
