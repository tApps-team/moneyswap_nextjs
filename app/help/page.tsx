import { Metadata } from "next";
import { HelpPage } from "@/views/help";
import { routes } from "@/shared/router";
export default HelpPage;

export const metadata: Metadata = {
  title: "Помощь по старту работы с площадкой MoneySwap",
  description:
    "MoneySwap представляет собой бесплатный сервис, где можно найти выгодный и надежный обменный пункт. Чтобы пользователи сервиса были всегда в курсе актуальной информации, на сайте постоянно происходят обновления. Осуществляется это благодаря синхронизации MoneySwap с обменниками криптовалюты. С MoneySwap вам доступны такие функции как: сравнение условий, выбор лучшего курса, изучение статистики конкретного обменника, добавление отзыв, расчет суммы обмена.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_BASE_URL || ""),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_BASE_URL}${routes.help}`,
  },
  openGraph: {
    title: "Помощь по старту работы с площадкой MoneySwap",
    description:
      "MoneySwap представляет собой бесплатный сервис, где можно найти выгодный и надежный обменный пункт. Чтобы пользователи сервиса были всегда в курсе актуальной информации, на сайте постоянно происходят обновления. Осуществляется это благодаря синхронизации MoneySwap с обменниками криптовалюты. С MoneySwap вам доступны такие функции как: сравнение условий, выбор лучшего курса, изучение статистики конкретного обменника, добавление отзыв, расчет суммы обмена.",
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
