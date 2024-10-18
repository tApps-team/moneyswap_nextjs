import { Metadata } from "next";
import { BlogTagPage } from "@/views/blog-tag";
import { getAllTags, getTagArticles } from "@/entities/strapi";
export default BlogTagPage;

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = params.tag;
  const { data } = await getTagArticles({ tag });

  return {
    title: `${data.name} | MoneySwap`,
    description: `Здесь вы найдете статьи с тегом ${data.name}.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: `${data.name} | MoneySwap`,
      description: `Здесь вы найдете статьи с тегом ${data.name}.`,
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
}

export async function generateStaticParams() {
  const { data: tags } = await getAllTags();

  return tags?.tags?.map((tag) => ({
    tag: tag?.tag,
  }));
}
