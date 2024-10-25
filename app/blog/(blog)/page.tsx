import { Metadata } from "next";
import { BlogPage } from "@/views/blog";

export default BlogPage;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const searchValue = searchParams.search ? searchParams.search.toString() : null;

  const metaWithoutSearch = {
    title: "Блог о финансах, криптовалюте и переводах за рубеж",
    description:
      "Читайте статьи о финансах, криптовалютах, обменных пунктах, истории криптовалют и многом другом. Узнайте всё о криптокошельках, обмене криптовалют и переводах за рубеж.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: "Блог о финансах, криптовалюте и переводах за рубеж",
      description:
        "Читайте статьи о финансах, криптовалютах, обменных пунктах, истории криптовалют и многом другом. Узнайте всё о криптокошельках, обмене криптовалют и переводах за рубеж.",
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

  return currentMeta;
}
