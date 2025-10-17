import { NextRequest, NextResponse } from "next/server";
import { handleBannerExchanger } from "./src/shared/consts/banner-exchangers";

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Обрабатываем только crypto-exchangers
  if (pathname.startsWith('/crypto-exchangers/exchanger-')) {
    // Проверяем редирект для banner exchangers
    const match_id = pathname.match(/exchanger-(\d+)/);
    if (match_id) {
      const exchangerId = match_id[1];
      const newPath = handleBannerExchanger(exchangerId);
      if (newPath) {
        return NextResponse.redirect(new URL(`/crypto-exchangers/exchanger-${newPath}`, request.url), 301);
      }
    }

    // Проверяем, что есть query-параметр exchanger-marker
    if (searchParams.has('exchanger-marker')) {
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

    // Редирект для crypto-exchangers с маркерами в пути
    const match = pathname.match(/exchanger-(\d+)__(.+)/);
    if (match) {
      const exchangerId = match[1];
      const newUrl = `/crypto-exchangers/exchanger-${exchangerId}`;
      return NextResponse.redirect(new URL(newUrl, request.url), 301);
    }
  }

  // Редирект для blacklist с маркерами в пути
  if (pathname.startsWith('/blacklist/exchanger-')) {
    const match = pathname.match(/exchanger-(\d+)__(.+)/);
    if (match) {
      const exchangerId = match[1];
      const newUrl = `/blacklist/exchanger-${exchangerId}`;
      return NextResponse.redirect(new URL(newUrl, request.url), 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/crypto-exchangers/exchanger-:exchanger*",
    "/blacklist/exchanger-:exchanger*"
  ],
};
