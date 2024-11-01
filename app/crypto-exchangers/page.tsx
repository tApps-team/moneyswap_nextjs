import { Metadata } from "next";
import { CryptoExchangersPage } from "@/views/crypto-exchangers";
export default CryptoExchangersPage;

export const metadata: Metadata = {
  title: "crypto-exchangers page",
  description: "crypto-exchangers page description",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "crypto-exchangers page og title",
    description: "crypto-exchangers page og description",
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
