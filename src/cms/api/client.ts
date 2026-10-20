import { CMS_BASE } from "../config/paths";

/** Ошибка запроса к Strapi через прокси CMS. */
export class CmsApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

/** Сессия кончилась — уводим на вход, сохранив, куда пользователь шёл. */
function redirectToLogin() {
  if (typeof window === "undefined") return;
  const next = window.location.pathname + window.location.search;
  window.location.href = `${CMS_BASE}/login?reason=expired&next=${encodeURIComponent(next)}`;
}

/**
 * Запрос к админ-API Strapi через прокси CMS.
 * `path` — путь Strapi без ведущего слэша, например `content-manager/init`.
 */
export async function cmsFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  const res = await fetch(`${CMS_BASE}/api/proxy/${path.replace(/^\/+/, "")}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body && !isForm ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    credentials: "same-origin",
  });

  if (res.status === 401) {
    redirectToLogin();
    throw new CmsApiError(401, "Сессия истекла");
  }

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // Не JSON (например, HTML-страница ошибки прокси) — отдадим статус.
    if (res.ok) throw new CmsApiError(res.status, "Некорректный ответ сервера");
  }
  if (!res.ok) {
    const message = body?.error?.message || body?.message || `Ошибка ${res.status}`;
    throw new CmsApiError(res.status, message, body?.error?.details);
  }
  return body as T;
}
