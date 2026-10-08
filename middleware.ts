import { NextResponse, type NextRequest } from "next/server";
import { detectLocale, LOCALE_COOKIE } from "@/lib/locale";

/**
 * middleware.ts — cookie-only i18n (D-021).
 *
 * On the FIRST visit (no `locale` cookie), detect the visitor's locale
 * from Accept-Language + the Vercel `x-vercel-ip-country` header and SET
 * THE COOKIE — no redirect, no rewrite: the same URL keeps serving both
 * locales. Subsequent visits carry the cookie, so middleware is a no-op
 * (the layout resolves the locale per request and renders copy + lang).
 *
 * Runs on Vercel's edge runtime; the import chain is pure data (no
 * Node-only APIs), so the no-env build is unaffected.
 */
export function middleware(request: NextRequest) {
  if (request.cookies.has(LOCALE_COOKIE)) return NextResponse.next();

  const locale = detectLocale(
    request.headers.get("accept-language"),
    request.headers.get("x-vercel-ip-country")
  );

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // one year — same persistence register as a language preference
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * All pages except static assets, image optimization, the icon,
     * and API routes. No redirect/rewrite is ever issued — the matcher
     * only scopes where the first-visit cookie is set.
     */
    "/((?!_next/static|_next/image|icon|api).*)",
  ],
};
