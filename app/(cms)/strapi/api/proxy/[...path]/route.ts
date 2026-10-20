import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CMS_COOKIE,
  isSameOrigin,
  sessionCookieOptions,
  strapiUrl,
} from "@/cms/server/strapi-admin";

export const dynamic = "force-dynamic";

/**
 * Прокси из браузера в админ-API Strapi.
 *
 * Подставляет JWT из httpOnly-cookie и пропускает только то, что нужно
 * контент-менеджеру. Управление пользователями, ролями, вебхуками и схемами
 * (content-type-builder) остаётся в штатной админке Strapi и здесь закрыто —
 * это вторая линия обороны поверх RBAC самого Strapi.
 */
const ALLOWED: { test: (path: string) => boolean; methods: string[] }[] = [
  { test: (p) => p.startsWith("content-manager/"), methods: ["GET", "POST", "PUT", "DELETE"] },
  { test: (p) => p === "upload" || p.startsWith("upload/"), methods: ["GET", "POST", "PUT", "DELETE"] },
  { test: (p) => p === "admin/users/me" || p === "admin/users/me/permissions", methods: ["GET"] },
];

const UNSAFE = new Set(["POST", "PUT", "DELETE"]);

/** Сегменты пути из URL: отбрасываем всё, что похоже на попытку выйти за пределы. */
function buildPath(segments: string[]): string | null {
  if (!segments.length) return null;
  for (const s of segments) {
    if (!s || s === "." || s === ".." || /[\\/?#]/.test(s)) return null;
  }
  return segments.join("/");
}

async function handle(req: Request, { params }: { params: { path: string[] } }) {
  const path = buildPath(params.path ?? []);
  const method = req.method.toUpperCase();

  if (!path) return NextResponse.json({ message: "Некорректный путь" }, { status: 400 });

  const rule = ALLOWED.find((r) => r.test(path));
  if (!rule || !rule.methods.includes(method)) {
    return NextResponse.json({ message: "Недоступно из CMS" }, { status: 403 });
  }
  if (UNSAFE.has(method) && !isSameOrigin(req)) {
    return NextResponse.json({ message: "Запрос с чужого источника" }, { status: 403 });
  }

  const token = cookies().get(CMS_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Нет сессии" }, { status: 401 });

  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Accept", req.headers.get("accept") ?? "application/json");

  const target = strapiUrl(path) + new URL(req.url).search;
  const hasBody = method !== "GET" && method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      // Тело передаём потоком: так без буферизации проходит и JSON,
      // и multipart с файлами для медиатеки.
      body: hasBody ? req.body : undefined,
      // Обязательный флаг Node fetch для потокового тела запроса.
      ...(hasBody ? ({ duplex: "half" } as Record<string, unknown>) : {}),
      cache: "no-store",
    });
  } catch (error) {
    console.error("[cms] proxy error:", path, error);
    return NextResponse.json({ message: "Strapi недоступен" }, { status: 502 });
  }

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
  // Токен отозван или истёк — чистим cookie, клиент уведёт на вход.
  if (upstream.status === 401) res.cookies.set(CMS_COOKIE, "", sessionCookieOptions(0));
  return res;
}

export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
