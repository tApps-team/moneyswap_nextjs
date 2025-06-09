import { Metadata } from "next";
import { SitemapDirectionsPage } from "@/views/sitemap-directions";

export default SitemapDirectionsPage;

export const metadata: Metadata = {
    title: "Доступные направления | Карта сайта | MoneySwap",
    description:
      "Все доступные направления обмена на нашей площадке представлены только проверенные обменники с безупречной репутацией. Незаменимый помощник в мире финансов.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
    openGraph: {
      title: "Доступные направления | Карта сайта | MoneySwap",
      description:
        "Все доступные направления обмена на нашей площадке представлены только проверенные обменники с безупречной репутацией. Незаменимый помощник в мире финансов.",
      url: "/sitemap",
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