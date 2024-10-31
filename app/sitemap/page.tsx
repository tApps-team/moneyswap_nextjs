import { Metadata } from "next";
import { SitemapPage } from "@/views/sitemap";
export default SitemapPage;

export const metadata: Metadata = {
  title: "sitemap",
  description: "sitemap description",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "sitemap og title",
    description: "sitemap og description",
    url: process.env.NEXT_PUBLIC_SITE_BASE_URL,
    siteName: "MoneySwap",
    images: [
      {
        url: "/og_logo.svg",
        width: 400,
        height: 200,
        alt: "MoneySwap",
      },
    ],
    locale: "ru-RU",
    type: "website",
  },
};
