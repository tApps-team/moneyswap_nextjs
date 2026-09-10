import { Headset, Newspaper } from "lucide-react";
import { SVGProps } from "react";
import { FileIcon, PeopleIcon, QuestionIcon } from "@/shared/assets";
import { NAV_ENTRIES, entryIcon, entryShortTitle, getGroupSections } from "@/shared/consts";
import { routes } from "@/shared/router";

const HeadsetIcon = Headset as (props: SVGProps<SVGSVGElement>) => JSX.Element;
const NewspaperIcon = Newspaper as (props: SVGProps<SVGSVGElement>) => JSX.Element;

type NavbarIcon = (props: SVGProps<SVGSVGElement> & { className?: string }) => JSX.Element;

export type NavbarLink = {
  href: string;
  value: string;
  description?: string;
  icon?: NavbarIcon | string;
};

export type NavbarItem = {
  /** Куда ведёт сам пункт: хаб группы или страница раздела. */
  href: string;
  /** Подпись для десктопа — сокращённая там, где полная не влезает в строку. */
  value: string;
  /** Подпись для бургера: в столбик помещается полное название. */
  fullValue?: string;
  /** Иконка пункта. Рисуется в бургере: на десктопе строка меню только текстовая. */
  icon?: NavbarIcon | string;
  className?: string;
  /** Разделы группы в выпадающей панели. Нет — пункт рисуется обычной ссылкой. */
  items?: NavbarLink[];
  /** Ссылка «Подробнее» в подвале панели: тот же хаб, что и сам пункт. */
  moreHref?: string;
  /** Панель «Поддержки» — одна колонка ссылок без хаба. */
  children?: NavbarLink[];
  /**
   * Пункт только для бургера. На десктопе шесть направлений и «Поддержка» уже
   * на пределе по ширине, а в мобильном меню место есть.
   */
  mobileOnly?: boolean;
  /** Панель крайних правых пунктов прижимается к правому краю, иначе уезжает за экран. */
  align?: "start" | "end";
};

/** Пункты направлений берём из общего конфига, чтобы меню и футер не расходились. */
const sectionItems: NavbarItem[] = NAV_ENTRIES.map((entry) =>
  entry.kind === "group"
    ? {
        href: entry.group.href,
        value: entryShortTitle(entry),
        fullValue: entry.group.title,
        icon: entryIcon(entry) as unknown as NavbarIcon,
        moreHref: entry.group.href,
        items: getGroupSections(entry.group).map((section) => ({
          href: section.href,
          value: section.title,
          description: section.description,
          icon: section.icon as unknown as NavbarIcon,
        })),
      }
    : {
        href: entry.section.href,
        value: entry.section.title,
        icon: entryIcon(entry) as unknown as NavbarIcon,
      },
);

export const navbarItems: NavbarItem[] = [
  ...sectionItems,
  {
    href: routes.blog,
    value: "Блог",
    icon: NewspaperIcon,
    mobileOnly: true,
  },
  {
    href: routes.help_article,
    value: "Поддержка",
    icon: HeadsetIcon,
    align: "end",
    children: [
      {
        href: `${routes.about}`,
        value: "О проекте",
        description: "Узнать о проекте Moneyswap",
        icon: PeopleIcon,
      },
      {
        href: `${routes.help_faq}`,
        value: "FAQ",
        description: "Ответы на главные вопросы о платформе",
        icon: QuestionIcon,
      },
      {
        href: `${routes.help_article}`,
        value: "Помощь",
        description: "Подробно о том, как пользоваться платформой",
        icon: FileIcon,
      },
      {
        href: `${routes.contacts}`,
        value: "Контакты",
        description: "Наши контакты для прямой связи и форма для обратной связи",
        icon: HeadsetIcon,
      },
      {
        href: `${routes.partners}`,
        value: "Сотрудничество",
        description: "Связаться с нами или предложить сотрудничество",
        icon: "public import",
      },
    ],
  },
];

/** Десктопное меню: без пунктов, которые живут только в бургере. */
export const desktopNavbarItems = navbarItems.filter((item) => !item.mobileOnly);
