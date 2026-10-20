/**
 * Серверная часть CMS: общение с админ-API Strapi и cookie сессии.
 *
 * Импортировать только из route handlers и серверных компонентов — здесь
 * читается STRAPI_BASE_URL и живёт JWT админа, в браузер это попадать не должно.
 */
import { CMS_BASE, CMS_COOKIE } from "../config/paths";
import { CmsComponent, CmsContentType, CmsPermission, CmsSession, CmsUser } from "../model/types";

export { CMS_BASE, CMS_COOKIE };

/**
 * Срок жизни cookie. JWT Strapi живёт 30 дней, но сессию держим короче и
 * продлеваем через renew-token при каждом открытии CMS (скользящая сессия):
 * выход в Strapi токен не отзывает, поэтому короткий хвост безопаснее.
 */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const sessionCookieOptions = (maxAge = SESSION_MAX_AGE) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: CMS_BASE,
  maxAge,
});

export const strapiUrl = (path: string) => {
  const base = process.env.STRAPI_BASE_URL;
  if (!base) throw new Error("STRAPI_BASE_URL не задан");
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};

/** Ошибка ответа Strapi с сохранённым HTTP-статусом. */
export class StrapiAdminError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Достаёт человекочитаемое сообщение из ответа об ошибке Strapi. */
export async function readStrapiError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body?.error?.message || body?.message || res.statusText;
  } catch {
    return res.statusText;
  }
}

/** GET к админ-API Strapi от имени пользователя. Кэш выключен — данные живые. */
export async function strapiAdminGet<T>(token: string, path: string): Promise<T> {
  const res = await fetch(strapiUrl(path), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new StrapiAdminError(res.status, await readStrapiError(res));
  return res.json() as Promise<T>;
}

/** Вход по email и паролю админа Strapi. */
export async function strapiLogin(email: string, password: string) {
  const res = await fetch(strapiUrl("admin/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!res.ok) throw new StrapiAdminError(res.status, await readStrapiError(res));
  const body = (await res.json()) as { data: { token: string; user: CmsUser } };
  return body.data;
}

/** Продление JWT. Strapi принимает только ещё не истёкший токен. */
export async function strapiRenewToken(token: string): Promise<string> {
  const res = await fetch(strapiUrl("admin/renew-token"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  if (!res.ok) throw new StrapiAdminError(res.status, await readStrapiError(res));
  const body = (await res.json()) as { data: { token: string } };
  return body.data.token;
}

/**
 * Сессия целиком: пользователь, его права и схемы типов контента.
 * Возвращает null, если токен недействителен (истёк, пользователь отключён).
 */
export async function loadSession(token: string): Promise<CmsSession | null> {
  try {
    const [me, permissions, init] = await Promise.all([
      strapiAdminGet<{ data: CmsUser }>(token, "admin/users/me"),
      strapiAdminGet<{ data: CmsPermission[] }>(token, "admin/users/me/permissions"),
      strapiAdminGet<{ data: { contentTypes: CmsContentType[]; components: CmsComponent[] } }>(
        token,
        "content-manager/init",
      ),
    ]);
    return {
      user: me.data,
      permissions: permissions.data,
      contentTypes: init.data.contentTypes,
      components: init.data.components,
      strapiUrl: strapiUrl("").replace(/\/+$/, ""),
    };
  } catch (error) {
    if (error instanceof StrapiAdminError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

/**
 * Проверка, что небезопасный запрос пришёл со страницы нашего же сайта.
 * Cookie стоит с SameSite=Lax, это вторая линия защиты от CSRF.
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") === "same-origin";
  // За обратным прокси req.url может содержать внутренний адрес (localhost:3000),
  // поэтому сверяемся с тем хостом, на который реально пришёл браузер.
  const host =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? new URL(req.url).host;
  try {
    return new URL(origin).host === host.split(",")[0].trim();
  } catch {
    return false;
  }
}
