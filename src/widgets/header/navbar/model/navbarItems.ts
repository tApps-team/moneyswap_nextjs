import { SVGProps } from "react";
import {
  EmailTelephoneIcon,
  FileIcon,
  MoneyesIcon,
  PeopleIcon,
  QuestionIcon,
  WalletIcon,
} from "@/shared/assets";
import { routes } from "@/shared/router";

type NavbarItems = {
  href: string;
  value: string;
  icon?: ((props: SVGProps<SVGSVGElement>) => JSX.Element) | string;
  children?: (NavbarItems & { description?: string })[];
};

export const navbarItems: NavbarItems[] = [
  {
    href: routes.home,
    value: "Обмен криптовалюты",
    children: [
      {
        href: `${routes.home}`,
        value: "Безналичный Обмен",
        description: "Купить и продать криптовалюту с безналичной оплатой",
        icon: WalletIcon,
      },
      {
        href: `${routes.home}?direction=cash`,
        value: "наличный Обмен",
        description: "Купить и продать криптовалюту за наличные",
        icon: MoneyesIcon,
      },
    ],
  },
  {
    href: routes.exchangers,
    value: "Обменники",
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
        href: `${routes.partners}`,
        value: "Контакты",
        description: "Связаться с нами или предложить сотрудничество",
        icon: "public import",
      },
    ],
  },
  {
    href: routes.blog,
    value: "Блог",
  },
];
