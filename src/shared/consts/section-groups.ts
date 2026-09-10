import { Bitcoin, LucideIcon, Plane, WalletCards } from "lucide-react";
import { routes } from "../router";
import { RATING_SECTIONS, RatingSection } from "./rating-sections";
import { SECTION_BY_KEY, SiteSection, SiteSectionKey } from "./site-sections";

export type SectionGroupKey = "crypto" | "abroad-services" | "cards";

export interface SectionGroup {
  key: SectionGroupKey;
  title: string;
  /** Короткое имя для навбара: полное название не влезает в строку на 1024. */
  shortTitle?: string;
  /** Одна строка для меню, карточки группы на главной и шапки хаба. */
  subtitle: string;
  icon: LucideIcon;
  /** Хаб группы: и пункт меню, и «Подробнее», и средняя хлебная крошка ведут сюда. */
  href: string;
  sectionKeys: SiteSectionKey[];
}

/**
 * Смысловые группы разделов — единый источник для меню, футера,
 * хабов и подборок на главной.
 *
 * Группа означает ровно одно: у направления есть своя страница-хаб. Разделы без
 * группы (ВЭД, Займы, Кредиты) живут в NAV_ENTRIES отдельным видом записи.
 */
export const SECTION_GROUPS: SectionGroup[] = [
  {
    key: "crypto",
    title: "Криптовалюты",
    subtitle: "Обменники криптовалюты, курсы и проверка на добросовестность",
    icon: Bitcoin,
    href: routes.crypto_services,
    sectionKeys: ["exchangers", "exchange", "blacklist"],
  },
  {
    key: "abroad-services",
    title: "Сервисы за рубежом",
    shortTitle: "За рубежом",
    subtitle: "Оплата зарубежных подписок, игр и мобильная связь",
    icon: Plane,
    href: routes.abroad_services,
    sectionKeys: ["payment-services", "esim"],
  },
  {
    key: "cards",
    title: "Карты",
    subtitle: "Кредитные, дебетовые и виртуальные карты для оплаты где угодно",
    icon: WalletCards,
    href: routes.cards_services,
    sectionKeys: ["credit-cards", "debit-cards", "virtual-cards"],
  },
];

/** Все разделы группы — включая те, у которых нет коллекции в Strapi. */
export const getGroupSections = (group: SectionGroup): SiteSection[] =>
  group.sectionKeys.map((key) => SECTION_BY_KEY[key]);

/** Только разделы с коллекцией в Strapi: для подборок карточек. */
export const getGroupRatingSections = (group: SectionGroup): RatingSection[] =>
  group.sectionKeys
    .map((key) => RATING_SECTIONS.find((section) => section.key === key))
    .filter((section): section is RatingSection => Boolean(section));

/** Группа раздела — для хлебных крошек и точечной инвалидации хаба. */
export const GROUP_BY_SECTION_KEY = Object.fromEntries(
  SECTION_GROUPS.flatMap((group) => group.sectionKeys.map((key) => [key, group])),
) as Partial<Record<SiteSectionKey, SectionGroup>>;
