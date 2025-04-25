import { HTMLAttributeAnchorTarget } from "react";
import { products, routes } from "@/shared/router";

type FooterItems = {
  value: string;

  children?: (FooterItems & { href: string; target?: HTMLAttributeAnchorTarget })[];
};
export const footerItems: FooterItems[] = [
  {
    value: "Продукты",
    children: [
      {
        href: routes.exchangers,
        value: "Обменники",
      },
    ],
  },
  {
    value: "Поддержка",
    children: [
      {
        href: routes.about,
        value: "О проекте",
      },
      {
        href: routes.contacts,
        value: "Контакты",
      },
      {
        href: routes.help_faq,
        value: "FAQ",
      },
      {
        href: routes.help_article,
        value: "Помощь",
      },
      {
        href: routes.home, // нужен роут
        value: "Политика конфиденциальности",
      },
      {
        href: routes.home, // нужен роут
        value: "Соглашение о  конфиденциальности",
      },
      {
        href: routes.partners,
        value: "Добавить  обменник",
      },
    ],
  },
  {
    value: "Социальные сети",
    children: [
      {
        href: products.telegram_channel,
        value: "Telegram",
        target: "_blank",
      },
      {
        href: products.telegram_bot,
        value: "YouTube",
        target: "_blank",
      },
      {
        href: products.dzen_ru,
        value: "Дзен",
        target: "_blank",
      },
      {
        href: products.vc_ru,
        value: "VC.RU",
        target: "_blank",
      },
    ],
  },
  {
    value: "Возможности",
    children: [
      {
        href: routes.blog,
        value: "Статьи",
      },
      {
        href: routes.blog, // нужен роут
        value: "Новости",
      },
      {
        href: routes.sitemap,
        value: "Карта сайта",
      },
    ],
  },
];
