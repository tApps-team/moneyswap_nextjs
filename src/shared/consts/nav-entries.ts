import { RatingSectionKey } from "./rating-sections";
import { SECTION_GROUPS, SectionGroup, SectionGroupKey } from "./section-groups";
import { SECTION_BY_KEY, SiteSection } from "./site-sections";

/**
 * Пункт витрины: либо группа со своим хабом, либо отдельный раздел.
 *
 * Ключ раздела сужен до RatingSectionKey — только у таких разделов есть
 * загрузчик подборки, поэтому полки типизируются без приведений.
 */
export type NavEntry =
  | { kind: "group"; key: SectionGroupKey; group: SectionGroup }
  | { kind: "section"; key: RatingSectionKey; section: SiteSection };

const group = (key: SectionGroupKey): NavEntry => ({
  kind: "group",
  key,
  group: SECTION_GROUPS.find((item) => item.key === key) as SectionGroup,
});

const section = (key: RatingSectionKey): NavEntry => ({
  kind: "section",
  key,
  section: SECTION_BY_KEY[key],
});

/** Разделы, которые показываются в меню сами по себе, без группы. */
export const STANDALONE_SECTION_KEYS: RatingSectionKey[] = ["ved", "microloans", "credits"];

/**
 * Порядок пунктов навигации — один на весь сайт: навбар, бургер, футер
 * и сетка направлений на главной строятся отсюда.
 */
export const NAV_ENTRIES: NavEntry[] = [
  group("crypto"),
  section("ved"),
  group("abroad-services"),
  group("cards"),
  section("microloans"),
  section("credits"),
];

/**
 * Порядок полок на главной. Отличается от меню намеренно: сначала идут
 * группы, у которых внутри несколько разделов, потом одиночные сервисы.
 */
export const HOME_SHELVES: NavEntry[] = [
  group("crypto"),
  group("cards"),
  group("abroad-services"),
  section("ved"),
  section("microloans"),
  section("credits"),
];

export const entryHref = (entry: NavEntry): string =>
  entry.kind === "group" ? entry.group.href : entry.section.href;

export const entryTitle = (entry: NavEntry): string =>
  entry.kind === "group" ? entry.group.title : entry.section.title;

/** Название для навбара: у групп с длинным именем — сокращённое. */
export const entryShortTitle = (entry: NavEntry): string =>
  entry.kind === "group" ? (entry.group.shortTitle ?? entry.group.title) : entry.section.title;

export const entrySubtitle = (entry: NavEntry): string =>
  entry.kind === "group" ? entry.group.subtitle : entry.section.description;

export const entryIcon = (entry: NavEntry) =>
  entry.kind === "group" ? entry.group.icon : entry.section.icon;
