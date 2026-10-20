import { Metadata } from "next";
import { BlogCategoryPage } from "@/views/blog-category";
import { ArticlePreview, getAllCategories, getCategoryArticles } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

export default async function Page({ params }: { params: { category: string } }) {
  const category = params.category;
  const { data } = await getCategoryArticles({ category });

  const blogPosts = (data.articles || []).map((article: ArticlePreview) => ({
    "@type": "BlogPosting",
    "headline": article.title,
    "url": `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blog}/article/${article.url_name}`,
    "datePublished": article.publishedAt,
    "author": {
      "@type": "Organization",
      "name": "MoneySwap"
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Категория - ${data.name}`,
    "description": `Подборка статей по теме: ${data.name}`,
    "url": `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blog}${routes.category}/${category}`,
    "hasPart": blogPosts,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\u003c'),
        }}
      />
      <Breadcrumbs categoryName={data.name} pathname={`${routes.blog}${routes.category}/${category}`} />
      <BlogCategoryPage params={params} />
    </>
  );
}

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
