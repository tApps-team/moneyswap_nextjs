import { Banknote, Globe, LucideIcon, Plane, Repeat } from "lucide-react";
import { routes } from "../router";
import { RATING_SECTIONS, RatingSection } from "./rating-sections";
import { SECTION_BY_KEY, SiteSection, SiteSectionKey } from "./site-sections";

export type SectionGroupKey =
  | "currency-exchange"
  | "international-payments"
  | "abroad-services"
  | "bank-products";

export interface SectionGroup {
  key: SectionGroupKey;
  title: string;
  /** Одна строка для меню, карточки группы на главной и шапки блока-подборки. */
  subtitle: string;
  icon: LucideIcon;
  /** Куда ведёт заголовок группы: обмен — на свою страницу, остальные — на якорь хаба. */
  href: string;
  sectionKeys: SiteSectionKey[];
}

/**
 * Смысловые группы разделов — единый источник для меню, футера,
 * хаба /ratings и подборок на главной.
 */
export const SECTION_GROUPS: SectionGroup[] = [
  {
    key: "currency-exchange",
    title: "Обмен валют",
    subtitle: "Обменники криптовалюты, курсы и проверка на добросовестность",
    icon: Repeat,
    href: routes.exchangers,
    sectionKeys: ["exchangers", "exchange", "blacklist"],
  },
  {
    key: "international-payments",
    title: "Международные платежи",
    subtitle: "Переводы за рубеж и карты для оплаты в других странах",
    icon: Globe,
    href: `${routes.ratings}#international-payments`,
    sectionKeys: ["ved", "virtual-cards"],
  },
  {
    key: "abroad-services",
    title: "Сервисы за рубежом",
    subtitle: "Оплата зарубежных подписок, игр и мобильная связь",
    icon: Plane,
    href: `${routes.ratings}#abroad-services`,
    sectionKeys: ["payment-services", "esim"],
  },
  {
    key: "bank-products",
    title: "Банковские продукты",
    subtitle: "Карты, кредиты и займы российских банков и МФО",
    icon: Banknote,
    href: `${routes.ratings}#bank-products`,
    sectionKeys: ["debit-cards", "credit-cards", "credits", "microloans"],
  },
];

/** Все разделы группы — включая те, у которых нет страницы в Strapi. */
export const getGroupSections = (group: SectionGroup): SiteSection[] =>
  group.sectionKeys.map((key) => SECTION_BY_KEY[key]);

/** Только разделы-рейтинги: для подборок на главной и группировки хаба. */
export const getGroupRatingSections = (group: SectionGroup): RatingSection[] =>
  group.sectionKeys
    .map((key) => RATING_SECTIONS.find((section) => section.key === key))
    .filter((section): section is RatingSection => Boolean(section));
