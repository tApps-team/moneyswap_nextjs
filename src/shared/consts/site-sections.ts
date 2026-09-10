import { ArrowLeftRight, Ban, LucideIcon, ShieldCheck } from "lucide-react";
import { routes } from "../router";
import { RATING_SECTIONS, RatingSectionKey } from "./rating-sections";

/**
 * Общая форма раздела витрины — и рейтинга из Strapi, и сервиса обмена.
 * Нужна, чтобы меню, футер и главная строились из одного описания.
 */
export interface SiteSection {
  key: string;
  href: string;
  /** Короткое название — для меню, карточек и футера. */
  title: string;
  description: string;
  icon: LucideIcon;
}

/** Разделы обмена: своих страниц-рейтингов в Strapi у них нет. */
export type ExchangeSectionKey = "exchangers" | "exchange" | "blacklist";

export const EXCHANGE_SECTIONS: SiteSection[] = [
  {
    key: "exchangers",
    href: routes.exchangers,
    title: "Обменники",
    description: "Проверенные вручную обменные пункты с отзывами пользователей",
    icon: ShieldCheck,
  },
  {
    key: "exchange",
    href: routes.exchange,
    title: "Обмен валюты",
    description: "Поиск выгодного курса по нужной паре валют и городу",
    icon: ArrowLeftRight,
  },
  {
    key: "blacklist",
    href: routes.blacklist,
    title: "Чёрный список",
    description: "Обменники, к которым стоит относиться с осторожностью",
    icon: Ban,
  },
];

export type SiteSectionKey = ExchangeSectionKey | RatingSectionKey;

/**
 * Все разделы витрины.
 * Важно: рейтинги остаются отдельным списком (RATING_SECTIONS) — только они
 * имеют страницы в Strapi и попадают в хаб /ratings и его JSON-LD.
 */
export const ALL_SECTIONS: SiteSection[] = [...EXCHANGE_SECTIONS, ...RATING_SECTIONS];

export const SECTION_BY_KEY = Object.fromEntries(
  ALL_SECTIONS.map((section) => [section.key, section]),
) as Record<SiteSectionKey, SiteSection>;
