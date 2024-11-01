import { Metadata } from "next";
import { HelpPage } from "@/views/help";
export default HelpPage;

export const metadata: Metadata = {
  title: "help",
  description: "help description",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "help og title",
    description: "help og description",
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
