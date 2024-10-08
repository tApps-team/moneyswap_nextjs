import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname, href, searchParams } = request.nextUrl;
  const exchnagerMarker = searchParams.get("exchanger-marker");

  // return NextResponse.redirect(new URL(`/`, request.url));
}
export const config: MiddlewareConfig = {
  matcher: "/crypto-exchangers/exchanger-:exchanger*",
};
