/**
 * Атрибуты типов контента в том виде, в каком их отдаёт /content-manager/init.
 * Описаны только поля, которые используются CMS.
 */
export type CmsAttribute =
  | { type: "string" | "text" | "email" | "password" | "uid" | "richtext"; required?: boolean; maxLength?: number; unique?: boolean }
  | { type: "integer" | "biginteger" | "decimal" | "float"; required?: boolean; min?: number; max?: number }
  | { type: "boolean"; required?: boolean; default?: boolean }
  | { type: "enumeration"; enum: string[]; required?: boolean; default?: string }
  | { type: "date" | "datetime" | "time" | "timestamp"; required?: boolean }
  | { type: "json"; required?: boolean }
  | { type: "blocks"; required?: boolean }
  | { type: "media"; multiple?: boolean; required?: boolean; allowedTypes?: string[] }
  | {
      type: "relation";
      relation: string;
      target: string;
      targetModel?: string;
      relationType?: string;
      inversedBy?: string;
      mappedBy?: string;
      required?: boolean;
    }
  | { type: "component"; component: string; repeatable?: boolean; required?: boolean }
  | { type: "dynamiczone"; components: string[]; required?: boolean };

export type CmsAttributes = Record<string, CmsAttribute>;

/** Служебные поля Strapi: в формах не редактируются, в списке — по выбору. */
/**
 * Поля-названия записи в порядке приоритета: заголовки, чипы связей, карточки.
 * Русские подписи тегов и категорий блога идут раньше их латинских слагов.
 */
export const MAIN_FIELD_CANDIDATES = [
  "name",
  "title",
  "tag_name_ru",
  "category_name_ru",
  "name_ru",
  "preview_title",
  "article_title",
  "question",
  "username",
  "code",
  "header_title",
];

export const SYSTEM_FIELDS = ["id", "createdAt", "updatedAt", "publishedAt", "createdBy", "updatedBy", "locale", "localizations"];

export const isNumeric = (a: CmsAttribute) =>
  a.type === "integer" || a.type === "biginteger" || a.type === "decimal" || a.type === "float";

export const isRelation = (a: CmsAttribute): a is Extract<CmsAttribute, { type: "relation" }> =>
  a.type === "relation";

/** Связь «ко многим» (в списке Strapi отдаёт её как `{ count }`). */
export const isToMany = (a: CmsAttribute) =>
  isRelation(a) && /(oneToMany|manyToMany)$/i.test(a.relationType ?? a.relation);

/** Связь с типом контента сайта (а не с админ-пользователем и т.п.). */
export const isContentRelation = (a: CmsAttribute) =>
  isRelation(a) && (a.targetModel ?? a.target).startsWith("api::");

export const relationTarget = (a: Extract<CmsAttribute, { type: "relation" }>) =>
  a.targetModel ?? a.target;

/** По каким полям Strapi умеет сортировать список. */
export const isSortable = (name: string, a: CmsAttribute) =>
  name === "id" ||
  !["relation", "media", "component", "dynamiczone", "blocks", "json", "richtext", "password"].includes(
    a.type,
  );
