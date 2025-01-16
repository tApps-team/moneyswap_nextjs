import { Metadata, ResolvingMetadata } from "next";
import { Main } from "@/views/main";
import { getSeoMeta } from "@/shared/api";
import { routes } from "@/shared/router";
import { pageTypes } from "@/shared/types";
export default Main;

type Props = {
  searchParams?: { direction: "cash" };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const reqParams = {
    page: pageTypes.main,
  };

  const seoMeta = await getSeoMeta(reqParams);
  const direction = searchParams?.direction;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.home}${direction ? `?direction=${direction}` : ""}`;
  // const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}`;

  return {
    title: seoMeta.data[0].title,
    description: seoMeta.data[0].description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoMeta.data[0].title,
      description: seoMeta.data[0].description,
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
}
