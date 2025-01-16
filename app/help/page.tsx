import { Metadata } from "next";
import { HelpPage } from "@/views/help";
import { routes } from "@/shared/router";
export default HelpPage;

type Props = {
  searchParams?: { article?: true };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const isArticle = searchParams?.article;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${isArticle ? routes.help_article : routes.help_faq}`;
  return {
    title: "Часто задаваемые вопросы. Как совершить обмен | MoneySwap",
    description:
      "Ответы на популярные вопросы о работе MoneySwap. Узнайте, как настроить личный кабинет, добавить обменник в агрегатор, автоматизировать курсы и многое другое.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Часто задаваемые вопросы. Как совершить обмен | MoneySwap",
      description:
        "Ответы на популярные вопросы о работе MoneySwap. Узнайте, как настроить личный кабинет, добавить обменник в агрегатор, автоматизировать курсы и многое другое.",
      url: process.env.NEXT_PUBLIC_SITE_BASE_URL,
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
  };
}
