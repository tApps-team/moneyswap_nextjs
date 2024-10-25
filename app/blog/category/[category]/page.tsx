import { Metadata } from "next";
import { BlogCategoryPage } from "@/views/blog-category";
import { getAllCategories, getCategoryArticles } from "@/entities/strapi";
export default BlogCategoryPage;

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = params.category;
  const { data } = await getCategoryArticles({ category });

  return {
    title: `${data.name} | MoneySwap`,
    description: `Здесь вы найдете статьи с категорией ${data.name}.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    openGraph: {
      title: `${data.name} | MoneySwap`,
      description: `Здесь вы найдете статьи с категорией ${data.name}.`,
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
}

export async function generateStaticParams() {
  const { data: categories } = await getAllCategories();

  return categories?.categories?.map((cat) => ({
    category: cat?.category,
  }));
}
