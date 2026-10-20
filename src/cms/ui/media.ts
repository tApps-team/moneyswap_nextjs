/** Медиа-объект Strapi в ответах Content Manager (только нужные поля). */
export interface CmsMedia {
  id: number;
  url: string;
  name?: string;
  alternativeText?: string | null;
  mime?: string;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, { url: string }> | null;
}

/** Абсолютный адрес файла: Strapi хранит относительные пути /uploads/…. */
export const mediaUrl = (strapiUrl: string, url: string | undefined | null) =>
  !url ? null : /^https?:\/\//.test(url) ? url : `${strapiUrl}${url}`;

/** Миниатюра для списков, если Strapi её сгенерировал; иначе оригинал. */
export const mediaThumb = (strapiUrl: string, media: CmsMedia | null | undefined) =>
  media ? mediaUrl(strapiUrl, media.formats?.thumbnail?.url ?? media.url) : null;
