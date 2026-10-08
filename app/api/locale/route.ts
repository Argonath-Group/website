import { NextResponse } from "next/server";
import { locales } from "@/content/site";
import { isLocale, LOCALE_COOKIE } from "@/lib/locale";

/**
 * app/api/locale/route.ts — locale switch endpoint (D-021).
 *
 * POST { "locale": "en" | "es" } → sets the persistent `locale` cookie.
 * The LocaleToggle client component then calls router.refresh(), which
 * re-renders the server tree with the new locale (dynamic rendering is
 * the accepted consequence of cookie-only i18n — see D-021).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const locale = (body as Record<string, unknown> | null)?.locale;
  if (typeof locale !== "string" || !isLocale(locale)) {
    return NextResponse.json(
      { ok: false, error: `locale must be one of: ${locales.join(", ")}` },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
