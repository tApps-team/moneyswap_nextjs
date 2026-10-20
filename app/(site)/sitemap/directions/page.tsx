import { Metadata } from "next";
import { SitemapDirectionsPage } from "@/views/sitemap-directions";
import { routes } from "@/shared/router";

export const dynamic = 'force-dynamic';

export default SitemapDirectionsPage;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const page = searchParams.page ? Number(searchParams?.page) : null;
  const pagePath = page ? "?page=" + page : "";

  return {
    title: `Доступные направления | Карта сайта | MoneySwap${page ? " | Страница " + page : ""}`,
    description:
      `Все доступные направления обмена на нашей площадке представлены только проверенные обменники с безупречной репутацией. Незаменимый помощник в мире финансов${page ? " | Страница " + page : ""}`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
    openGraph: {
      title: `Доступные направления | Карта сайта | MoneySwap${page ? " | Страница " + page : ""}`,
      description:
        `Все доступные направления обмена на нашей площадке представлены только проверенные обменники с безупречной репутацией. Незаменимый помощник в мире финансов${page ? " | Страница " + page : ""}`,
      url: "/sitemap",
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
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.directions}${pagePath}` },
  };
}