import { Metadata } from "next";
import { BlogCategoryPage } from "@/views/blog-category";
import { getAllCategories, getCategoryArticles } from "@/entities/strapi";
import { routes } from "@/shared/router";
export default BlogCategoryPage;

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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
    openGraph: {
      title: `${data.name} | MoneySwap`,
      description: `Здесь вы найдете статьи с категорией ${data.name}.`,
      url: `${routes.blog}${routes.category}/${category}`,
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blog}${routes.category}/${category}`,
    },
  };
}

export async function generateStaticParams() {
  const { data: categories } = await getAllCategories();

  return categories?.categories?.map((cat) => ({
    category: cat?.category,
  }));
}
