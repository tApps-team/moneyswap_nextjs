import { HTMLAttributeAnchorTarget } from "react";
import {
  SECTION_BY_KEY,
  SECTION_GROUPS,
  STANDALONE_SECTION_KEYS,
  getGroupSections,
} from "@/shared/consts";
import { routes } from "@/shared/router";

type FooterItems = {
  value: string;
  /** Заголовок-ссылка: у колонок-групп ведёт на хаб направления. */
  href?: string;
  children?: (FooterItems & { href: string; target?: HTMLAttributeAnchorTarget })[];
};

/** Колонки разделов собираем из тех же групп, что и меню, — иначе они разойдутся. */
const groupColumns: FooterItems[] = SECTION_GROUPS.map((group) => ({
  value: group.title,
  href: group.href,
  children: getGroupSections(group).map((section) => ({
    href: section.href,
    value: section.title,
  })),
}));

/** Разделы без группы: в меню они отдельными пунктами, в футере — одной колонкой. */
const standaloneColumn: FooterItems = {
  value: "Сервисы",
  children: STANDALONE_SECTION_KEYS.map((key) => ({
    href: SECTION_BY_KEY[key].href,
    value: SECTION_BY_KEY[key].title,
  })),
};

export const footerItems: FooterItems[] = [
  ...groupColumns,
  standaloneColumn,
  {
    value: "Компания",
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
