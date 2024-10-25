import { Metadata } from "next";
import { ForPartnersPage } from "@/views/for-partners";

export default ForPartnersPage;

export const metadata: Metadata = {
  title: "for-partners",
  description: "for-partners description",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "for-partners og title",
    description: "for-partners og description",
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
