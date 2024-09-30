import { LucideIcon, WalletIcon } from "lucide-react";
import { ReactNode, SVGProps } from "react";
import { routes } from "@/shared/router";

type NavbarItems = {
  href: string;
  value: string;
  icon?: LucideIcon;
  children?: (NavbarItems & { description?: string })[];
};

export const navbarItems: NavbarItems[] = [
  {
    href: routes.home,
    value: "Купить криптовалюту",
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
        icon: WalletIcon,
      },
    ],
  },
  {
    href: routes.exchangers,
    value: "Обменники",
  },
  {
    href: routes.help,
    value: "Поддержка",
    children: [
      {
        href: `${routes.about}`,
        value: "О проекте",
        description: "узнать о проекте Moneyswap",
        icon: WalletIcon,
      },
      {
        href: `${routes.questions}`,
        value: "FAQ",
        description: "Ответы на главные вопросы о платформе",
        icon: WalletIcon,
      },
      {
        href: `${routes.help}`,
        value: "Помощь",
        description: "Подробно о том, как пользоваться платформой",
        icon: WalletIcon,
      },
      {
        href: `${routes.contacts}`,
        value: "Контакты",
        description: "Связаться с нами или предложить сотрудничество",
        icon: WalletIcon,
      },
    ],
  },
  {
    href: routes.blog,
    value: "Блог",
  },
];
