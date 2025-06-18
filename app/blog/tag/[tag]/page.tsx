import { Metadata } from "next";
import { BlogTagPage } from "@/views/blog-tag";
import { getAllTags, getTagArticles } from "@/entities/strapi";
import { routes } from "@/shared/router";

export default async function Page({ params }: { params: { tag: string } }) {
  const tag = params.tag;
  const { data } = await getTagArticles({ tag });

  // Массив статей для hasPart
  const blogPosts = (data.articles || []).map((article: any) => ({
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
    "name": `Статьи с тегом ${data.name}`,
    "description": `Подборка статей с тегом: ${data.name}`,
    "url": `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blog}${routes.tag}/${tag}`,
    "hasPart": blogPosts
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <BlogTagPage params={params} />
    </>
  );
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = params.tag;
  const { data } = await getTagArticles({ tag });

  return {
    title: `MoneySwap - здесь вы найдете статьи с тегом ${data.name}`,
    description: `Добро пожаловать в раздел статей с тегом ${data.name} на блоге MoneySwap! Здесь вы найдете полезные и актуальные материалы о криптовалюте, финансовых технологиях и инвестициях. Узнайте больше о современных трендах в мире блокчейна, торговле цифровыми активами и способах эффективного управления своими средствами. Наши статьи помогут вам разобраться в ключевых аспектах криптовалютной индустрии и быть в курсе последних новостей и аналитики.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
    openGraph: {
      title: `MoneySwap - здесь вы найдете статьи с тегом ${data.name}`,
      description: `Добро пожаловать в раздел статей с тегом ${data.name} на блоге MoneySwap! Здесь вы найдете полезные и актуальные материалы о криптовалюте, финансовых технологиях и инвестициях. Узнайте больше о современных трендах в мире блокчейна, торговле цифровыми активами и способах эффективного управления своими средствами. Наши статьи помогут вам разобраться в ключевых аспектах криптовалютной индустрии и быть в курсе последних новостей и аналитики.`,
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
