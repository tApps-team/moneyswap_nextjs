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
  const meta_title = direction
    ? `${seoMeta?.data[0].title} | Наличный обмен`
    : seoMeta?.data[0].title;
  const meta_description = direction
    ? `${seoMeta?.data[0].description} | Наличный обмен`
    : seoMeta?.data[0].description;

  return {
    title: meta_title,
    description: meta_description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta_title,
      description: meta_description,
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
