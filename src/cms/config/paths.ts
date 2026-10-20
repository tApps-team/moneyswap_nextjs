/** Базовый путь CMS на сайте. Меняется только здесь (и в robots.ts). */
export const CMS_BASE = "/strapi";

/** httpOnly-cookie с JWT админа Strapi. Ограничена путём CMS — сайт её не видит. */
export const CMS_COOKIE = "ms_cms_token";
