import { NextResponse } from "next/server";
import { CMS_BASE, CMS_COOKIE, sessionCookieOptions } from "@/cms/server/strapi-admin";

export const dynamic = "force-dynamic";

/**
 * Выход. Strapi JWT не отзывает, поэтому выход — это удаление cookie.
 *
 * POST — из интерфейса. GET — для серверного редиректа, когда сессия
 * оказалась недействительной: серверный компонент cookie удалить не может,
 * поэтому отправляет сюда, а маршрут чистит cookie и ведёт на вход.
 */
const clear = (res: NextResponse) => {
  res.cookies.set(CMS_COOKIE, "", sessionCookieOptions(0));
  return res;
};

export async function POST() {
  return clear(NextResponse.json({ ok: true }));
}

export async function GET(req: Request) {
  const reason = new URL(req.url).searchParams.get("reason");
  const location = `${CMS_BASE}/login${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`;
  // Относительный Location: за обратным прокси req.url может указывать на
  // внутренний адрес Next, а браузеру нужен его собственный хост.
  return clear(new NextResponse(null, { status: 307, headers: { Location: location } }));
}
