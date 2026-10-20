import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CMS_COOKIE,
  StrapiAdminError,
  isSameOrigin,
  sessionCookieOptions,
  strapiRenewToken,
} from "@/cms/server/strapi-admin";

export const dynamic = "force-dynamic";

/** Продление сессии: новый JWT от Strapi и свежий срок у cookie. */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ message: "Запрос с чужого источника" }, { status: 403 });
  }
  const token = cookies().get(CMS_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Нет сессии" }, { status: 401 });

  try {
    const fresh = await strapiRenewToken(token);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(CMS_COOKIE, fresh, sessionCookieOptions());
    return res;
  } catch (error) {
    const res = NextResponse.json({ message: "Сессия истекла" }, { status: 401 });
    if (error instanceof StrapiAdminError) {
      res.cookies.set(CMS_COOKIE, "", sessionCookieOptions(0));
      return res;
    }
    console.error("[cms] renew error:", error);
    return NextResponse.json({ message: "Strapi недоступен" }, { status: 502 });
  }
}
