import { Metadata } from "next";
import { BlogTagPage } from "@/views/blog-tag";
import { getAllTags, getTagArticles } from "@/entities/strapi";
import { routes } from "@/shared/router";
export default BlogTagPage;

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = params.tag;
  const { data } = await getTagArticles({ tag });

  return {
    title: `${data.name} | MoneySwap`,
    description: `Здесь вы найдете статьи с тегом ${data.name}.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
    openGraph: {
      title: `${data.name} | MoneySwap`,
      description: `Здесь вы найдете статьи с тегом ${data.name}.`,
      url: `${routes.blog}${routes.tag}/${tag}`,
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
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blog}${routes.tag}/${tag}`,
    },
  };
}

export async function generateStaticParams() {
  const { data: tags } = await getAllTags();

  return tags?.tags?.map((tag) => ({
    tag: tag?.tag,
  }));
}
