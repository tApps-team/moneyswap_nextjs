import { HTMLAttributeAnchorTarget } from "react";
import { SECTION_GROUPS, getGroupSections } from "@/shared/consts";
import { routes } from "@/shared/router";

type FooterItems = {
  value: string;

  children?: (FooterItems & { href: string; target?: HTMLAttributeAnchorTarget })[];
};

/** Колонки разделов собираем из тех же групп, что и меню, — иначе они разойдутся. */
const groupColumns: FooterItems[] = SECTION_GROUPS.map((group) => ({
  value: group.title,
  children: getGroupSections(group).map((section) => ({
    href: section.href,
    value: section.title,
  })),
}));

export const footerItems: FooterItems[] = [
  ...groupColumns,
  {
    value: "Компания",
    children: [
      {
        href: routes.ratings,
        value: "Все рейтинги",
      },
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
        href: routes.blog,
        value: "Блог",
      },
      {
        href: routes.partners,
        value: "Добавить сервис",
      },
      {
        href: routes.sitemap,
        value: "Карта сайта",
      },
    ],
  },
  {
    value: "Документы",
    children: [
      {
        href: routes.privacy,
        value: "Политика конфиденциальности",
      },
      {
        href: routes.pricing_policy,
        value: "Политика тарификации",
      },
      {
        href: routes.terms,
        value: "Пользовательское соглашение",
      },
      {
        href: routes.blacklist_terms,
        value: "Положение о Чёрном списке",
      },
    ],
  },
];
