import { Metadata } from "next";
import { BlogArticlePage } from "@/views/blog-article";
import { getAllArticles, getArticle } from "@/entities/strapi";
export default BlogArticlePage;

export const revalidate = 10;

export async function generateMetadata({
  params,
}: {
  params: { url_name: string };
}): Promise<Metadata> {
  const url = params.url_name;
  const { data } = await getArticle({ url_name: url });
  const article = data[0];

  return {
    title: article?.meta?.title,
    description: article?.meta?.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: article?.meta?.title,
      description: article?.meta?.description,
      url: process.env.NEXT_PUBLIC_SITE_BASE_URL,
      siteName: "MoneySwap",
      images: [
        {
          url: article?.preview?.image,
          width: 400,
          height: 200,
          alt: "article preview",
        },
      ],
      locale: "ru-RU",
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const { data: articles } = await getAllArticles({ page: 1, elements: 1000 });

  if (!Array.isArray(articles)) {
    throw new Error("Articles is not an array");
  }

  if (!Array.isArray(articles) || articles.length === 0) {
    return [];
  }

  return articles.map((article) => ({
    url_name: article?.url_name,
  }));
}
