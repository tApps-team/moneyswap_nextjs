import { routes } from "@/shared/router";

type NavbarItems = {
  href: string;
  value: string;
};
export const navbarItems: NavbarItems[] = [
  {
    href: routes.home,
    value: "Купить криптовалюту",
  },
  {
    href: routes.exchangers,
    value: "Обменники",
  },
  {
    href: routes.help,
    value: "Поддержка",
  },
  {
    href: routes.blog,
    value: "Блог",
  },
];
