import { Metadata, ResolvingMetadata } from "next";
import { Main } from "@/views/main";
import { getSeoMeta } from "@/shared/api";
import { pageTypes } from "@/shared/types";
export default Main;

export async function generateMetadata(): Promise<Metadata> {
  const reqParams = {
    page: pageTypes.main,
  };

  const seoMeta = await getSeoMeta(reqParams);

  return {
    title: seoMeta.data[0].title,
    description: seoMeta.data[0].description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: seoMeta.data[0].title,
      description: seoMeta.data[0].description,
      url: process.env.NEXT_PUBLIC_SITE_BASE_URL,
      siteName: "MoneySwap",
      images: [
        {
          url: "/logo.png",
          width: 400,
          height: 200,
          alt: "MoneySwap",
        },
      ],
      locale: "ru-RU",
      type: "website",
    },
  };
}
