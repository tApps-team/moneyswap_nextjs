import { CmsAttribute, isNumeric, isRelation } from "@/cms/schema/attributes";

/** Ключ фильтра по статусу публикации — такого поля в схеме нет. */
export const STATUS_FILTER = "__status";

/** Значение одного фильтра в состоянии списка (и в URL). */
export type FilterValue =
  | { kind: "in"; values: (string | number)[] }
  | { kind: "bool"; value: boolean }
  | { kind: "range"; min?: string; max?: string }
  | { kind: "status"; value: "draft" | "published" };

export type FilterState = Record<string, FilterValue>;

const isEmpty = (v: FilterValue) =>
  (v.kind === "in" && v.values.length === 0) || (v.kind === "range" && !v.min && !v.max);

/** Убирает пустые фильтры — чтобы не плодить мусор в URL. */
export const compactFilters = (state: FilterState): FilterState =>
  Object.fromEntries(Object.entries(state).filter(([, v]) => !isEmpty(v)));

/** Конец дня для верхней границы диапазона дат: «по 10.09» включает весь день. */
const endOfDay = (date: string) => `${date}T23:59:59.999Z`;

/** Состояние фильтров → условия Strapi (объединяются через $and). */
export function toStrapiFilters(
  state: FilterState,
  attributeOf: (field: string) => CmsAttribute | undefined,
): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];

  for (const [field, value] of Object.entries(compactFilters(state))) {
    if (value.kind === "status") {
      out.push({ publishedAt: value.value === "draft" ? { $null: true } : { $notNull: true } });
      continue;
    }

    const attr = attributeOf(field);
    if (!attr) continue;

    if (value.kind === "in") {
      out.push(isRelation(attr) ? { [field]: { id: { $in: value.values } } } : { [field]: { $in: value.values } });
    } else if (value.kind === "bool") {
      // false в Strapi может храниться и как null (поле не трогали) — учитываем оба.
      out.push(
        value.value
          ? { [field]: { $eq: true } }
          : { $or: [{ [field]: { $eq: false } }, { [field]: { $null: true } }] },
      );
    } else if (value.kind === "range") {
      const cond: Record<string, unknown> = {};
      const isDate = attr.type === "date" || attr.type === "datetime";
      if (value.min) cond.$gte = isNumeric(attr) ? Number(value.min) : value.min;
      if (value.max) cond.$lte = isNumeric(attr) ? Number(value.max) : isDate && attr.type === "datetime" ? endOfDay(value.max) : value.max;
      out.push({ [field]: cond });
    }
  }
  return out;
}

/** Сколько фильтров активно — для бейджа на кнопке. */
export const activeFilterCount = (state: FilterState) => Object.keys(compactFilters(state)).length;
