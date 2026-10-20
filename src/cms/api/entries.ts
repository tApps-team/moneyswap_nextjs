import { cmsFetch } from "./client";
import { CmsEntry, CmsPagination } from "./content-manager";
import { toQueryString } from "./qs";

const collection = (uid: string) => `content-manager/collection-types/${uid}`;
const single = (uid: string) => `content-manager/single-types/${uid}`;

/**
 * Адресация записи: у коллекций — по id, у single type запись одна.
 * Один интерфейс, чтобы редактор не различал эти случаи.
 */
export interface EntryRef {
  uid: string;
  kind: "collectionType" | "singleType";
  /** Для коллекций. У новой записи — null. */
  id: number | null;
}

const entryPath = (ref: EntryRef) =>
  ref.kind === "singleType" ? single(ref.uid) : `${collection(ref.uid)}/${ref.id}`;

export const getEntry = (ref: EntryRef) => cmsFetch<CmsEntry>(entryPath(ref));

export const createEntry = (uid: string, data: Record<string, unknown>) =>
  cmsFetch<CmsEntry>(collection(uid), { method: "POST", body: JSON.stringify(data) });

/** У single type PUT и создаёт, и обновляет. */
export const updateEntry = (ref: EntryRef, data: Record<string, unknown>) =>
  cmsFetch<CmsEntry>(entryPath(ref), { method: "PUT", body: JSON.stringify(data) });

export const publishEntry = (ref: EntryRef) =>
  cmsFetch<CmsEntry>(`${entryPath(ref)}/actions/publish`, { method: "POST" });

export const unpublishEntry = (ref: EntryRef) =>
  cmsFetch<CmsEntry>(`${entryPath(ref)}/actions/unpublish`, { method: "POST" });

export const deleteEntry = (ref: EntryRef) => cmsFetch<CmsEntry>(entryPath(ref), { method: "DELETE" });

/** Текущая связь записи. Для «ко многим» — все страницы, для «к одному» — объект или null. */
export async function getRelationValues(
  model: string,
  id: number,
  field: string,
  toMany: boolean,
): Promise<CmsEntry[] | CmsEntry | null> {
  const path = `content-manager/relations/${model}/${id}/${field}`;
  if (!toMany) {
    const res = await cmsFetch<{ data: CmsEntry | null }>(path);
    return res.data;
  }
  const all: CmsEntry[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await cmsFetch<{ results: CmsEntry[]; pagination: CmsPagination }>(
      `${path}?${toQueryString({ page, pageSize: 100 })}`,
    );
    all.push(...res.results);
    if (page >= res.pagination.pageCount) break;
  }
  // Strapi отдаёт связи от новых к старым — показываем в порядке добавления.
  return all.reverse();
}

/** Несколько связанных записей для ячейки списка: новые первыми, плюс общее число. */
export async function getRelationPreview(model: string, id: number, field: string, limit = 3) {
  const res = await cmsFetch<{ results: CmsEntry[]; pagination: CmsPagination }>(
    `content-manager/relations/${model}/${id}/${field}?${toQueryString({ page: 1, pageSize: limit })}`,
  );
  return { items: res.results, total: res.pagination.total };
}

/** Метаданные поля из конфигурации Content Manager. */
export interface CmsFieldMetadata {
  edit: {
    label?: string;
    description?: string;
    placeholder?: string;
    visible?: boolean;
    editable?: boolean;
    mainField?: string | { name: string };
  };
}

export interface CmsTypeConfiguration {
  settings: { mainField?: string; defaultSortBy?: string; defaultSortOrder?: string; pageSize?: number };
  metadatas: Record<string, CmsFieldMetadata>;
  layouts: { edit: { name: string; size: number }[][]; list?: string[] };
}

export interface CmsConfigurationResponse {
  data: {
    contentType: CmsTypeConfiguration & { uid: string };
    components: Record<string, CmsTypeConfiguration & { uid: string }>;
  };
}

export const getConfiguration = (uid: string) =>
  cmsFetch<CmsConfigurationResponse>(`content-manager/content-types/${uid}/configuration`);
