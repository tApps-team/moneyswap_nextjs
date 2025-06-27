import { Metadata } from "next";
import { BlogArticlePage } from "@/views/blog-article";
import { getAllArticles, getArticle } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

export default async function Page({ params }: { params: { url_name: string } }) {
  const url = params.url_name;
  const { data } = await getArticle({ url_name: url });
  const article = data[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article?.preview?.title,
    "description": article?.preview?.description,
    "image": article?.preview?.image,
    "datePublished": article?.publishedAt,
    "dateModified": article?.publishedAt,
    "author": {
      "@type": "Organization",
      "name": "MoneySwap"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MoneySwap",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_BASE_URL}/og_logo.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blog}${routes.article}/${url}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Breadcrumbs title={"Статья"} pathname={`${routes.blog}${routes.article}/${url}`} />
      <BlogArticlePage params={params} />
    </>
  );
}

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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
    openGraph: {
      title: article?.meta?.title,
      description: article?.meta?.description,
      url: `${routes.blog}${routes.article}/${url}`,
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
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.blog}${routes.article}/${url}`,
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
