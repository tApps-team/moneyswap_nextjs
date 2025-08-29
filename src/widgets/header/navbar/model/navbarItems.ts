import { Ban, Headset, ShieldCheck } from "lucide-react";
import { SVGProps } from "react";
import {
  FileIcon,
  MoneyesIcon,
  PeopleIcon,
  QuestionIcon,
  WalletIcon,
} from "@/shared/assets";
import { routes } from "@/shared/router";

const HeadsetIcon = Headset as ((props: SVGProps<SVGSVGElement>) => JSX.Element);

type NavbarItems = {
  href: string;
  value: string;
  icon?: ((props: SVGProps<SVGSVGElement> & { className?: string }) => JSX.Element) | string;
  className?: string;
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
    value: "Продукты",
    children: [
      {
        href: `${routes.exchangers}`,
        value: "Обменники",
        description: "Полный список обменников с актуальным статусом работы",
        icon: ShieldCheck as ((props: SVGProps<SVGSVGElement> & { className?: string }) => JSX.Element),
      },
      {
        href: `${routes.blacklist}`,
        value: "Черный список",
        description: "Остерегайтесь мошенников! Крайне не рекомендуемые обменники",
        icon: Ban as ((props: SVGProps<SVGSVGElement> & { className?: string }) => JSX.Element),
      },
    ],
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
  {
    href: routes.blog,
    value: "Блог",
  },
];
