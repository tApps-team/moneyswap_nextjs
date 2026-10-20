import { NextResponse } from "next/server";
import {
  CMS_COOKIE,
  StrapiAdminError,
  isSameOrigin,
  sessionCookieOptions,
  strapiLogin,
} from "@/cms/server/strapi-admin";

export const dynamic = "force-dynamic";

/** Вход: проверяем логин в Strapi и кладём JWT в httpOnly-cookie. */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ message: "Запрос с чужого источника" }, { status: 403 });
  }

  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ message: "Некорректный запрос" }, { status: 400 });
  }
  if (!email || !password) {
    return NextResponse.json({ message: "Укажите email и пароль" }, { status: 400 });
  }

  try {
    const { token, user } = await strapiLogin(email, password);
    // JWT в ответ не отдаём — он живёт только в httpOnly-cookie.
    const res = NextResponse.json({ user });
    res.cookies.set(CMS_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (error) {
    if (error instanceof StrapiAdminError) {
      const message =
        error.status === 429
          ? "Слишком много попыток входа. Подождите несколько минут."
          : error.message === "Invalid credentials"
            ? "Неверный email или пароль"
            : error.message === "User not active"
              ? "Пользователь отключён в Strapi"
              : "Не удалось войти";
      return NextResponse.json({ message }, { status: error.status === 429 ? 429 : 401 });
    }
    console.error("[cms] login error:", error);
    return NextResponse.json({ message: "Strapi недоступен" }, { status: 502 });
  }
}
