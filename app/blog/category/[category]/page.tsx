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
    title: `MoneySwap - здесь вы найдете статьи с категорией ${data.name}`,
    description: `Добро пожаловать в раздел статей с категорией ${data.name} на блоге MoneySwap! Здесь вы найдете полезные и актуальные материалы о криптовалюте, финансовых технологиях и инвестициях. Узнайте больше о современных трендах в мире блокчейна, торговле цифровыми активами и способах эффективного управления своими средствами. Наши статьи помогут вам разобраться в ключевых аспектах криптовалютной индустрии и быть в курсе последних новостей и аналитики.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
    openGraph: {
      title: `MoneySwap - здесь вы найдете статьи с категорией ${data.name}`,
      description: `Добро пожаловать в раздел статей с категорией ${data.name} на блоге MoneySwap! Здесь вы найдете полезные и актуальные материалы о криптовалюте, финансовых технологиях и инвестициях. Узнайте больше о современных трендах в мире блокчейна, торговле цифровыми активами и способах эффективного управления своими средствами. Наши статьи помогут вам разобраться в ключевых аспектах криптовалютной индустрии и быть в курсе последних новостей и аналитики.`,
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
