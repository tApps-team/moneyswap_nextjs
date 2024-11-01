import { Metadata } from "next";
import { AboutPage } from "@/views/about";
import { routes } from "@/shared/router";
export default AboutPage;

export const metadata: Metadata = {
  title: "about",
  description: "about description",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
  openGraph: {
    title: "about og title",
    description: "about og description",
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
