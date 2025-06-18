import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Проверяем, что есть query-параметр exchanger-marker
  if (
    pathname.startsWith('/crypto-exchangers/exchanger-') &&
    searchParams.has('exchanger-marker')
  ) {
    const marker = searchParams.get('exchanger-marker');
    const match = pathname.match(/exchanger-(\d+)/);
    if (match && marker) {
      const exchangerId = match[1];
      // Собираем новый путь
      const newUrl = `/crypto-exchangers/exchanger-${exchangerId}__${marker}`;
      // 301 редирект
      return NextResponse.redirect(new URL(newUrl, request.url), 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/crypto-exchangers/exchanger-:exchanger*",
};
