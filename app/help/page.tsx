import { Metadata } from "next";
import { HelpPage } from "@/views/help";
import { faqTypes, getFaq, getHelpPage } from "@/entities/strapi";
import { routes } from "@/shared/router";
import { Breadcrumbs } from "@/shared/ui";

// Типы для props
export type Props = {
  searchParams?: { article?: boolean };
};

export default async function Page({ searchParams }: Props) {
  const isArticle = searchParams?.article || false;

  // Получаем данные
  const [helpResponse, basicFaq, fromUsersFaq, cashFaq, noncashFaq, forPartnersFaq] = await Promise.all([
    getHelpPage(),
    getFaq(faqTypes.basic),
    getFaq(faqTypes.from_users),
    getFaq(faqTypes.cash),
    getFaq(faqTypes.noncash),
    getFaq(faqTypes.for_partners),
  ]);

  const { data: help } = helpResponse;
  const title = help?.title || "";
  const article = help?.content || "";

  const { data: basic } = basicFaq;
  const { data: from_users } = fromUsersFaq;
  const { data: cash } = cashFaq;
  const { data: noncash } = noncashFaq;
  const { data: for_partners } = forPartnersFaq;

  // userFaqs и partnerFaqs как в твоём компоненте
  const userFaqs = [
    { title: "Общие вопросы", faqs: basic },
    { title: "Вопросы от пользователей", faqs: from_users },
    { title: "Вопросы по наличному обмену", faqs: cash },
    { title: "Вопросы по безналичному обмену", faqs: noncash },
  ];
  const partnerFaqs = [{ title: "Вопросы от партнеров", faqs: for_partners }];

  // Генерация JSON-LD для FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ...userFaqs.flatMap(group =>
        (group.faqs || []).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        }))
      ),
      ...partnerFaqs.flatMap(group =>
        (group.faqs || []).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        }))
      ),
    ],
  };

  // Генерация JSON-LD для Article
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "articleBody": article[0]?.paragraph?.content,
    "author": {
      "@type": "Organization",
      "name": "MoneySwap",
    },
  };

  return (
    <>
      {isArticle ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <Breadcrumbs />
      <HelpPage searchParams={searchParams} />
    </>
  );
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const isArticle = searchParams?.article;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${isArticle ? routes.help_article : routes.help_faq}`;

  const meta_title = isArticle
    ? "Читайте статью про возможности MoneySwap | Что такое MoneySwap"
    : "Часто задаваемые вопросы. Как совершить обмен | MoneySwap";
  const meta_description = isArticle
    ? "Возможности с MoneySwap, бесплатный агрегатор обменников, только проверенные обменники, реальные отзывы пользователей, актуальные курсы!"
    : "Ответы на популярные вопросы о работе MoneySwap. Узнайте, как настроить личный кабинет, добавить обменник в агрегатор, автоматизировать курсы и многое другое.";

  return {
    title: meta_title,
    description: meta_description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta_title,
      description: meta_description,
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
