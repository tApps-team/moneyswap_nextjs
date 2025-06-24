import { Metadata } from "next";
import { BlogPage } from "@/views/blog";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Блог MoneySwap",
    "description": "Читайте статьи о финансах, криптовалютах, обменных пунктах, истории криптовалют и многом другом. Узнайте всё о криптокошельках, обмене криптовалют и переводах за рубеж.",
    "url": `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blog}`,
    "publisher": {
      "@type": "Organization",
      "name": "MoneySwap",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_BASE_URL}/og_logo.svg`
      }
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\u003c'),
        }}
      />
      <Breadcrumbs  pathname={`${routes.blog}`} />
      <BlogPage searchParams={searchParams} />
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const searchValue = searchParams.search ? searchParams.search.toString() : null;
  const page = searchParams.page ? Number(searchParams?.page) : null;

  const metaWithoutSearch = {
    title: "Читайте блог о финансах, криптовалюте и переводах за рубеж на MoneySwap!",
    description:
      "Читайте статьи о финансах, криптовалютах, обменных пунктах, истории криптовалют и многом другом. Узнайте всё о криптокошельках, обмене криптовалют и переводах за рубеж.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
    openGraph: {
      title: "Читайте блог о финансах, криптовалюте и переводах за рубеж на MoneySwap!",
      description:
        "Читайте статьи о финансах, криптовалютах, обменных пунктах, истории криптовалют и многом другом. Узнайте всё о криптокошельках, обмене криптовалют и переводах за рубеж.",
      url: routes.blog,
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

  const metaWithSearch = {
    title: `Поиск статей с пометкой: ${searchValue}`,
    description: `Читайте статьи о финансах, криптовалютах, обменных пунктах, истории криптовалют и многом другом с пометкой: ${searchValue}`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: `Поиск: ${searchValue}`,
      description: `Читайте статьи о финансах, криптовалютах, обменных пунктах, истории криптовалют и многом другом с пометкой: ${searchValue}`,
      url: process.env.NEXT_PUBLIC_SITE_BASE_URL,
      siteName: "MoneySwap",
      images: [
        {
          url: "/black_logo.png",
          width: 400,
          height: 200,
          alt: "MoneySwap",
        },
      ],
      locale: "ru-RU",
      type: "website",
    },
  };

  const currentMeta = searchValue ? metaWithSearch : metaWithoutSearch;
  const pagePath = page ? "?page=" + page : "";

  return {
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blog}${pagePath}` },
    ...currentMeta,
  };
}
