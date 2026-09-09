import { Headset } from "lucide-react";
import { SVGProps } from "react";
import { FileIcon, PeopleIcon, QuestionIcon } from "@/shared/assets";
import { SECTION_GROUPS, getGroupSections } from "@/shared/consts";
import { routes } from "@/shared/router";

const HeadsetIcon = Headset as (props: SVGProps<SVGSVGElement>) => JSX.Element;

type NavbarIcon = (props: SVGProps<SVGSVGElement> & { className?: string }) => JSX.Element;

type NavbarLink = {
  href: string;
  value: string;
  description?: string;
  icon?: NavbarIcon | string;
};

/** Колонка мега-панели: заголовок группы и её разделы. */
export type NavbarGroup = {
  key: string;
  title: string;
  subtitle: string;
  href: string;
  icon: NavbarIcon;
  items: NavbarLink[];
};

type NavbarItems = {
  href: string;
  value: string;
  icon?: NavbarIcon | string;
  className?: string;
  /** «mega» — панель во всю ширину экрана, колонка на каждую группу разделов. */
  layout?: "mega";
  groups?: NavbarGroup[];
  children?: NavbarLink[];
};

/** Группы и разделы берём из общего конфига, чтобы меню, футер и /ratings не расходились. */
const serviceGroups: NavbarGroup[] = SECTION_GROUPS.map((group) => ({
  key: group.key,
  title: group.title,
  subtitle: group.subtitle,
  href: group.href,
  icon: group.icon as unknown as NavbarIcon,
  items: getGroupSections(group).map((section) => ({
    href: section.href,
    value: section.title,
    description: section.description,
    icon: section.icon as unknown as NavbarIcon,
  })),
}));

export const navbarItems: NavbarItems[] = [
  {
    href: routes.ratings,
    value: "Сервисы",
    layout: "mega",
    groups: serviceGroups,
  },
  {
    href: routes.blog,
    value: "Блог",
  },
  {
    href: routes.help_article,
    value: "Поддержка",
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
