import { HTMLAttributeAnchorTarget } from "react";
import { routes } from "@/shared/router";

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
        href: routes.partners,
        value: "Контакты",
      },
      {
        href: routes.help,
        value: "FAQ",
      },
      {
        href: routes.help,
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
        href: routes.partners, // нужен роут
        value: "Добавить  обменник",
      },
    ],
  },
  {
    value: "Социальные сети",
    children: [
      {
        href: "https://t.me/MoneySwap_robot",
        value: "Telegram",
        target: "_blank",
      },
      {
        href: "https://t.me/MoneySwap_robot",
        value: "ВКонтакте",
        target: "_blank",
      },
      {
        href: "https://t.me/MoneySwap_robot",
        value: "YouTube",
        target: "_blank",
      },
      {
        href: "https://t.me/MoneySwap_robot",
        value: "WhatsApp",
        target: "_blank",
      },
      {
        href: "https://t.me/MoneySwap_robot",
        value: "Дзен",
        target: "_blank",
      },
      {
        href: "https://t.me/MoneySwap_robot",
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
        href: routes.sitemap, // нужен роут
        value: "Карта сайта",
      },
    ],
  },
];
