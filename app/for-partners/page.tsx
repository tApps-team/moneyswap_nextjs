import { Metadata } from "next";
import { ForPartnersPage } from "@/views/for-partners";
import { routes } from "@/shared/router";

export default ForPartnersPage;
const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.partners}`;
export const metadata: Metadata = {
  title: "for-partners",
  description: "for-partners description",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "for-partners og title",
    description: "for-partners og description",
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
