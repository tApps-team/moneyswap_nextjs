import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  // return NextResponse.redirect(new URL(`/`, request.url));
}
export const config: MiddlewareConfig = {
  matcher: "/crypto-exchangers/exchanger-:exchanger*",
};
