import { CMS_COLLECTIONS, CmsCollectionConfig, isHiddenField } from "../config/collections";
import { ENUM_LABELS, FIELD_LABELS, humanize } from "../config/labels";
import { CmsContentType } from "../model/types";
import { CmsAttribute, CmsAttributes, isContentRelation, isNumeric, isRelation, MAIN_FIELD_CANDIDATES } from "./attributes";

/** Поле, которое Strapi добавляет к каждой записи с draftAndPublish. */
const STATUS_FIELD = "publishedAt";


export interface CollectionModel {
  uid: string;
  title: string;
  hasDraftAndPublish: boolean;
  attributes: CmsAttributes;
  config: CmsCollectionConfig | undefined;
  /** Поле, по которому запись узнаётся в списке и заголовке. */
  mainField: string;
  /** Поле адреса записи и поле-источник для его генерации. */
  slug: { field: string; from: string };
  fieldLabel: (field: string) => string;
  enumLabel: (field: string, value: string) => string;
  /** Подпись записи для заголовков и сообщений: главное поле, иначе «#id». */
  entryLabel: (entry: Record<string, unknown> | null | undefined) => string;
  /** Колонки списка по умолчанию. */
  defaultColumns: string[];
  /** Все поля, которые можно вывести колонкой. */
  availableColumns: string[];
  /** Поля для панели фильтров. */
  filterFields: string[];
}

export function buildCollectionModel(ct: CmsContentType, title: string): CollectionModel {
  const config = CMS_COLLECTIONS[ct.uid];
  const attributes = Object.fromEntries(
    Object.entries(ct.attributes as CmsAttributes)
      .filter(([name]) => !isHiddenField(name))
      .map(([name, a]) => {
        // Strapi принимает изменения связи с любой стороны; без mappedBy
        // форма считает поле своим и отправляет diff вместе с записью.
        if (isRelation(a) && a.mappedBy && config?.editableInverse?.includes(name)) {
          const { mappedBy, ...rest } = a;
          return [name, { ...rest, inversedBy: mappedBy }];
        }
        return [name, a];
      }),
  ) as CmsAttributes;
  const hasDraftAndPublish = Boolean(ct.options?.draftAndPublish);

  const fieldLabel = (field: string) =>
    config?.fieldLabels?.[field] ?? FIELD_LABELS[field] ?? humanize(field);
  const enumLabel = (field: string, value: string) =>
    config?.enumLabels?.[field]?.[value] ?? ENUM_LABELS[field]?.[value] ?? value;

  // Без текстового названия (SEO-тексты) запись узнаётся по enum — «Страница: Главная».
  const mainField =
    MAIN_FIELD_CANDIDATES.find((f) => attributes[f]?.type === "string" || attributes[f]?.type === "text") ??
    Object.keys(attributes).find((f) => attributes[f].type === "enumeration") ??
    "id";

  const entryLabel = (entry: Record<string, unknown> | null | undefined) => {
    const v = entry?.[mainField];
    if (v === null || v === undefined || v === "") return entry?.id ? `#${entry.id}` : "";
    return attributes[mainField]?.type === "enumeration" ? enumLabel(mainField, String(v)) : String(v);
  };

  // Колонкой можно вывести всё, кроме тяжёлых и вложенных структур.
  const columnable = (name: string, a: CmsAttribute) =>
    !["component", "dynamiczone", "blocks", "json", "richtext", "password"].includes(a.type) &&
    !(isRelation(a) && !isContentRelation(a));

  const availableColumns = [
    ...Object.entries(attributes)
      .filter(([name, a]) => columnable(name, a))
      .map(([name]) => name),
    ...(hasDraftAndPublish ? [STATUS_FIELD] : []),
    "createdAt",
    "updatedAt",
  ].filter((f, i, arr) => arr.indexOf(f) === i);

  const defaultColumns = (
    config?.columns ?? [
      mainField,
      ...availableColumns.filter((f) => f !== mainField && attributes[f]?.type !== "relation").slice(0, 4),
      ...(hasDraftAndPublish ? [STATUS_FIELD] : []),
      "updatedAt",
    ]
  ).filter((f) => availableColumns.includes(f) || f === mainField);

  const filterFields =
    config?.filters ??
    Object.entries(attributes)
      .filter(
        ([, a]) =>
          a.type === "enumeration" ||
          a.type === "boolean" ||
          (isRelation(a) && isContentRelation(a) && !a.mappedBy && a.relation !== "oneToMany"),
      )
      .map(([name]) => name);

  return {
    uid: ct.uid,
    title,
    hasDraftAndPublish,
    attributes,
    config,
    mainField,
    slug: config?.slug ?? { field: "slug", from: mainField },
    fieldLabel,
    enumLabel,
    entryLabel,
    defaultColumns,
    availableColumns,
    filterFields,
  };
}

/** Тип атрибута с учётом служебных полей, которых нет в схеме. */
export function attributeOf(model: CollectionModel, field: string): CmsAttribute | undefined {
  if (field === "createdAt" || field === "updatedAt" || field === STATUS_FIELD) {
    return { type: "datetime" };
  }
  if (field === "id") return { type: "integer" };
  return model.attributes[field];
}

export const isRangeFilterable = (a: CmsAttribute) =>
  isNumeric(a) || a.type === "date" || a.type === "datetime";
