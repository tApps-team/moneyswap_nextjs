import { CmsEntry } from "@/cms/api/content-manager";
import { isHiddenField } from "@/cms/config/collections";
import { CmsAttribute, CmsAttributes, isNumeric, isRelation, isToMany, SYSTEM_FIELDS } from "@/cms/schema/attributes";
import { relationLabel } from "../list/cell";
import { CmsMedia } from "../media";

/** Элемент связи в форме: достаточно id и подписи, иконка — для чипов. */
export interface RelationItem {
  id: number;
  label: string;
  icon?: string | null;
  publishedAt?: string | null;
}

export type FormValues = Record<string, unknown>;

/** Ключ для React у элементов repeatable-компонента (у новых ещё нет id). */
export const TEMP_KEY = "__key";
let tempCounter = 0;
export const newTempKey = () => `tmp-${++tempCounter}`;

/**
 * Поля, которые редактирует форма. Устаревший richtext (markdown) и пароли
 * в форму не входят — значит, никогда не попадают в запрос, и Strapi
 * оставляет их как есть. Обратные связи меняются со стороны владельца.
 */
export const isFormField = (name: string, a: CmsAttribute) =>
  !SYSTEM_FIELDS.includes(name) &&
  !isHiddenField(name) &&
  a.type !== "richtext" &&
  a.type !== "password" &&
  !(isRelation(a) && (a.mappedBy || !(a.targetModel ?? a.target).startsWith("api::")));

/** Обратные связи (mappedBy) — показываем, но не редактируем в этой форме. */
export const isInverseRelation = (a: CmsAttribute) => isRelation(a) && Boolean(a.mappedBy);

export const toRelationItem = (raw: CmsEntry, iconOf?: (id: number) => string | null | undefined): RelationItem => ({
  id: raw.id,
  label: relationLabel(raw),
  icon: iconOf?.(raw.id),
  publishedAt: raw.publishedAt ?? null,
});

/** Компонент из ответа Strapi → значения формы (рекурсивно для вложенных). */
function componentToValues(raw: Record<string, unknown>, attrs: CmsAttributes | undefined): FormValues {
  const out: FormValues = { [TEMP_KEY]: raw.id ? `id-${raw.id}` : newTempKey() };
  if (raw.id) out.id = raw.id;
  // Тип блока dynamic zone нужен Strapi при сохранении — сохраняем его.
  if (raw.__component) out.__component = raw.__component;
  for (const [name, value] of Object.entries(raw)) {
    if (name === "id" || name === "__component") continue;
    const a = attrs?.[name];
    if (a?.type === "component") {
      out[name] = a.repeatable
        ? ((value as Record<string, unknown>[] | null) ?? []).map((v) => componentToValues(v, undefined))
        : value
          ? componentToValues(value as Record<string, unknown>, undefined)
          : null;
    } else {
      out[name] = value;
    }
  }
  return out;
}

/**
 * Запись из Strapi → начальные значения формы.
 * Связи приходят из ответа записи как `{ count }` — их значения подгружаются
 * отдельно и передаются в `relations`.
 */
export function entryToFormValues(
  entry: CmsEntry | null,
  attributes: CmsAttributes,
  relations: Record<string, RelationItem[] | RelationItem | null>,
  componentAttrs: (uid: string) => CmsAttributes | undefined,
): FormValues {
  const values: FormValues = {};
  for (const [name, a] of Object.entries(attributes)) {
    if (!isFormField(name, a)) continue;
    const raw = entry?.[name];
    if (isRelation(a)) {
      values[name] = relations[name] ?? (isToMany(a) ? [] : null);
    } else if (a.type === "component") {
      const attrs = componentAttrs(a.component);
      values[name] = a.repeatable
        ? ((raw as Record<string, unknown>[] | null) ?? []).map((c) => componentToValues(c, attrs))
        : raw
          ? componentToValues(raw as Record<string, unknown>, attrs)
          : null;
    } else if (a.type === "dynamiczone") {
      values[name] = ((raw as Record<string, unknown>[] | null) ?? []).map((c) =>
        componentToValues(c, componentAttrs(String(c.__component))),
      );
    } else if (a.type === "blocks") {
      values[name] = Array.isArray(raw) && raw.length ? raw : null;
    } else if (a.type === "media") {
      values[name] = a.multiple ? ((raw as CmsMedia[] | null) ?? []) : ((raw as CmsMedia | null) ?? null);
    } else if (a.type === "boolean") {
      values[name] = raw ?? a.default ?? false;
    } else if (a.type === "enumeration") {
      values[name] = raw ?? (entry ? null : a.default ?? null);
    } else {
      values[name] = raw ?? null;
    }
  }
  return values;
}

/** Нормализация скалярного значения перед отправкой. */
function serializeScalar(a: CmsAttribute, value: unknown): unknown {
  if (value === "" || value === undefined) return null;
  if (isNumeric(a) && value !== null) {
    const n = Number(String(value).replace(",", ".").replace(/\s/g, ""));
    if (!Number.isFinite(n)) return null;
    // biginteger Strapi принимает строкой — так не теряется точность.
    return a.type === "biginteger" ? String(Math.trunc(n)) : n;
  }
  return value;
}

const mediaId = (m: unknown) => (m && typeof m === "object" ? (m as CmsMedia).id : null);

/** Значения компонента → payload (медиа — id, вложенные компоненты — рекурсивно). */
function serializeComponent(values: FormValues, attrs: CmsAttributes | undefined): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(values)) {
    if (name === TEMP_KEY) continue;
    if (name === "id") {
      out.id = value;
      continue;
    }
    const a = attrs?.[name];
    if (!a) {
      out[name] = value;
    } else if (a.type === "media") {
      out[name] = a.multiple ? ((value as CmsMedia[]) ?? []).map(mediaId) : mediaId(value);
    } else if (a.type === "component") {
      out[name] = a.repeatable
        ? ((value as FormValues[]) ?? []).map((v) => serializeComponent(v, undefined))
        : value
          ? serializeComponent(value as FormValues, undefined)
          : null;
    } else {
      out[name] = serializeScalar(a, value);
    }
  }
  return out;
}

/** Diff связи «ко многим» в формате Content Manager. */
function relationDiff(initial: RelationItem[], current: RelationItem[]) {
  const before = new Set(initial.map((r) => r.id));
  const after = new Set(current.map((r) => r.id));
  return {
    connect: current.filter((r) => !before.has(r.id)).map((r) => ({ id: r.id, position: { end: true } })),
    disconnect: initial.filter((r) => !after.has(r.id)).map((r) => ({ id: r.id })),
  };
}

/**
 * Сравнение значений формы без ложных срабатываний: число из Strapi (0.5)
 * и та же строка из поля ввода ("0.5") — одно значение, пустая строка — это null.
 */
const normalize = (v: unknown) =>
  JSON.stringify(v ?? null, (_, x) => (typeof x === "number" ? String(x) : x === "" ? null : x));
const same = (a: unknown, b: unknown) => normalize(a) === normalize(b);

/** Изменённые поля формы. */
export function dirtyFields(values: FormValues, initial: FormValues): string[] {
  return Object.keys(values).filter((k) => !same(values[k], initial[k]));
}

/**
 * Payload для Strapi. У существующей записи — только изменённые поля;
 * у новой — все заполненные. Связи уходят как { connect, disconnect }.
 */
export function buildPayload(
  attributes: CmsAttributes,
  values: FormValues,
  initial: FormValues,
  isNew: boolean,
  componentAttrs: (uid: string) => CmsAttributes | undefined,
): Record<string, unknown> {
  const fields = isNew ? Object.keys(values) : dirtyFields(values, initial);
  const data: Record<string, unknown> = {};

  for (const name of fields) {
    const a = attributes[name];
    if (!a || !isFormField(name, a)) continue;
    const value = values[name];

    if (isRelation(a)) {
      if (isToMany(a)) {
        const diff = relationDiff(isNew ? [] : ((initial[name] as RelationItem[]) ?? []), (value as RelationItem[]) ?? []);
        if (diff.connect.length || diff.disconnect.length) data[name] = diff;
      } else {
        const before = isNew ? null : (initial[name] as RelationItem | null);
        const after = value as RelationItem | null;
        if (before?.id !== after?.id) {
          data[name] = {
            connect: after ? [{ id: after.id }] : [],
            disconnect: before ? [{ id: before.id }] : [],
          };
        }
      }
    } else if (a.type === "media") {
      data[name] = a.multiple ? ((value as CmsMedia[]) ?? []).map(mediaId) : mediaId(value);
    } else if (a.type === "component") {
      const attrs = componentAttrs(a.component);
      data[name] = a.repeatable
        ? ((value as FormValues[]) ?? []).map((v) => serializeComponent(v, attrs))
        : value
          ? serializeComponent(value as FormValues, attrs)
          : null;
    } else if (a.type === "dynamiczone") {
      // Весь список целиком: блоки с id Strapi обновит, без id — создаст,
      // а отсутствующие в списке удалит.
      data[name] = ((value as FormValues[]) ?? []).map((v) =>
        serializeComponent(v, componentAttrs(String(v.__component))),
      );
    } else if (a.type === "blocks") {
      if (isNew && !value) continue;
      data[name] = value ?? null;
    } else {
      const v = serializeScalar(a, value);
      if (isNew && (v === null || v === undefined)) continue;
      data[name] = v;
    }
  }
  return data;
}

/** Обязательные поля без значения — проверяем до отправки, чтобы не гонять запрос. */
export function missingRequired(attributes: CmsAttributes, values: FormValues): string[] {
  return Object.entries(attributes)
    .filter(([name, a]) => isFormField(name, a) && a.required)
    .filter(([name, a]) => {
      const v = values[name];
      if (a.type === "boolean") return false;
      if (Array.isArray(v)) return v.length === 0;
      return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
    })
    .map(([name]) => name);
}
