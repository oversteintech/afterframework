import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, matchAcceptLanguage } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return;

  const cookie = request.cookies.get(localeCookie)?.value;
  const locale = isLocale(cookie)
    ? cookie
    : matchAcceptLanguage(request.headers.get("accept-language")) ?? defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  matcher: [
    // Everything except Next internals, metadata routes and files with an extension.
    "/((?!_next|api|icon|apple-icon|opengraph-image|twitter-image|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|.*\\.[\\w]+$).*)",
  ],
};
