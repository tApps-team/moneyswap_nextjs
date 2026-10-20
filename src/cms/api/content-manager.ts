import { cmsFetch } from "./client";
import { toQueryString } from "./qs";

/** Запись в ответах Content Manager: плоский объект без обёртки data/attributes. */
export type CmsEntry = { id: number; publishedAt?: string | null; [field: string]: unknown };

export interface CmsPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface CmsListResponse {
  results: CmsEntry[];
  pagination: CmsPagination;
}

export interface CmsListParams {
  page: number;
  pageSize: number;
  /** «field:ASC» или «field:DESC». */
  sort?: string;
  /** Поиск по строковым полям (и по числовым, если запрос похож на число). */
  q?: string;
  /** Фильтры Strapi, объединяются через $and. */
  filters?: Record<string, unknown>[];
}

const collectionPath = (uid: string) => `content-manager/collection-types/${uid}`;

export function listEntries(uid: string, params: CmsListParams) {
  const query = toQueryString({
    page: params.page,
    pageSize: params.pageSize,
    sort: params.sort,
    _q: params.q || undefined,
    filters: params.filters?.length ? { $and: params.filters } : undefined,
  });
  return cmsFetch<CmsListResponse>(`${collectionPath(uid)}?${query}`);
}

export type BulkAction = "bulkPublish" | "bulkUnpublish" | "bulkDelete";

export function bulkAction(uid: string, action: BulkAction, ids: number[]) {
  return cmsFetch<{ count: number }>(`${collectionPath(uid)}/actions/${action}`, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

/** Кандидат для связи из /content-manager/relations: id и mainField цели. */
export type CmsRelationOption = { id: number; publishedAt?: string | null; [field: string]: unknown };

/**
 * Записи, которые можно привязать к полю `field` типа `uid`. Этот эндпоинт
 * Strapi проверяет права на исходный тип, поэтому подходит для фильтров:
 * даже без доступа к самому справочнику пользователь увидит его значения.
 */
export function searchRelation(uid: string, field: string, opts: { q?: string; page?: number; pageSize?: number }) {
  const query = toQueryString({
    _q: opts.q || undefined,
    page: opts.page ?? 1,
    pageSize: opts.pageSize ?? 100,
  });
  return cmsFetch<{ results: CmsRelationOption[]; pagination: CmsPagination }>(
    `content-manager/relations/${uid}/${field}?${query}`,
  );
}

/** Все кандидаты связи — для небольших справочников, постранично по 100. */
export async function searchRelationAll(uid: string, field: string, maxPages = 10) {
  const first = await searchRelation(uid, field, { page: 1 });
  const all = [...first.results];
  const pages = Math.min(first.pagination.pageCount, maxPages);
  for (let page = 2; page <= pages; page++) {
    const next = await searchRelation(uid, field, { page });
    all.push(...next.results);
  }
  return all;
}
