import { Metadata } from "next";
import { AboutPage } from "@/views/about";
export default AboutPage;

export const metadata: Metadata = {
  title: "about",
  description: "about description",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "about og title",
    description: "about og description",
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
