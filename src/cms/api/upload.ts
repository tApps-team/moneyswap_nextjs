import { CmsMedia } from "../ui/media";
import { cmsFetch } from "./client";
import { CmsPagination } from "./content-manager";
import { toQueryString } from "./qs";

export interface MediaListParams {
  page: number;
  pageSize: number;
  q?: string;
  /** Только картинки — для полей с allowedTypes: ["images"]. */
  imagesOnly?: boolean;
}

export function listFiles(params: MediaListParams) {
  const query = toQueryString({
    page: params.page,
    pageSize: params.pageSize,
    sort: "updatedAt:DESC",
    _q: params.q || undefined,
    filters: params.imagesOnly ? { $and: [{ mime: { $startsWith: "image/" } }] } : undefined,
  });
  return cmsFetch<{ results: CmsMedia[]; pagination: CmsPagination }>(`upload/files?${query}`);
}

/**
 * Загрузка одного файла в медиатеку Strapi (как это делает штатная админка:
 * поле files + описание в fileInfo). Возвращает созданный файл.
 */
export async function uploadFile(file: File): Promise<CmsMedia> {
  const form = new FormData();
  form.append("files", file);
  form.append("fileInfo", JSON.stringify({ name: file.name, caption: null, alternativeText: null }));
  const res = await cmsFetch<CmsMedia[]>("upload", { method: "POST", body: form });
  return res[0];
}
