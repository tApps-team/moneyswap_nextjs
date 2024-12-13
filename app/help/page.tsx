import { Metadata } from "next";
import { HelpPage } from "@/views/help";
export default HelpPage;

export const metadata: Metadata = {
  title: "Часто задаваемые вопросы MoneySwap | Как пользоваться",
  description:
    "Ответы на популярные вопросы о работе MoneySwap. Узнайте, как настроить личный кабинет, добавить обменник в агрегатор, автоматизировать курсы и многое другое.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  openGraph: {
    title: "Часто задаваемые вопросы MoneySwap | Как пользоваться",
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
