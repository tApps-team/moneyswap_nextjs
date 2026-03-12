import { NextRequest, NextResponse } from "next/server";
import { handleBannerExchanger } from "./src/shared/consts/banner-exchangers";

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Обрабатываем только crypto-exchangers
  if (pathname.startsWith('/crypto-exchangers/exchanger-')) {
    // Возвращаем 404 для конкретной ссылки exchanger-169__both
    if (pathname === '/crypto-exchangers/exchanger-169__both') {
      return new NextResponse(null, { status: 404 });
    }

    // Проверяем редирект для banner exchangers
    // const match_id = pathname.match(/exchanger-(\d+)/);
    // if (match_id) {
    //   const exchangerId = match_id[1];
    //   const newPath = handleBannerExchanger(exchangerId);
    //   if (newPath) {
    //     return NextResponse.redirect(new URL(`/crypto-exchangers/exchanger-${newPath}`, request.url), 301);
    //   }
    // }

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

  // Не даём браузеру кешировать HTML страниц (решает проблему со старым кодом после деплоя)
  const isPageRequest =
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !/\.(ico|png|svg|webp|js|css|woff2?)$/i.test(pathname);
  if (isPageRequest) {
    const res = NextResponse.next();
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/crypto-exchangers/exchanger-:exchanger*",
    "/blacklist/exchanger-:exchanger*",
    // Запросы к страницам (не _next, не api, не статика) — для Cache-Control
    "/((?!_next|api|favicon\\.ico|.*\\.(?:ico|png|svg|webp|js|css|woff2?)$).*)",
  ],
};
