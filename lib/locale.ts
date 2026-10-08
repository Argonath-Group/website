import { cookies } from "next/headers";
import { locales, type Locale } from "@/content/site";

/**
 * lib/locale.ts — locale resolution for the cookie-only i18n mechanism
 * (D-021). The detection core is a PURE function (unit-testable, no
 * Next.js imports); the server wrapper below it is a thin adapter over
 * the `locale` cookie.
 */

/**
 * Country codes (ISO 3166-1 alpha-2) that count as "Latin America" for
 * detection tiebreak purposes. Ecuador (EC) first — the studio's home
 * market (D-021).
 */
export const LATAM_COUNTRIES = [
  "EC",
  "MX",
  "CO",
  "AR",
  "PE",
  "CL",
  "VE",
  "BO",
  "PY",
  "UY",
  "CR",
  "PA",
  "NI",
  "GT",
  "HN",
  "SV",
  "DO",
  "CU",
  "PR",
] as const;

const COOKIE_NAME = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return (locales as readonly string[]).includes(value ?? "");
}

/**
 * Pure detection (D-021):
 *  1. Accept-Language starts with "es"            → "es"
 *  2. Accept-Language ambiguous/absent ("" / "*")
 *     AND country is in the LatAm set             → "es"
 *  3. otherwise                                    → "en"
 *
 * "en" is never inferred from country alone — a non-Spanish explicit
 * language preference wins over geography.
 */
export function detectLocale(
  acceptLanguage: string | null,
  country: string | null
): Locale {
  const al = (acceptLanguage ?? "").trim().toLowerCase();
  if (al.startsWith("es")) return "es";

  const ambiguous = al === "" || al === "*";
  if (ambiguous && country) {
    const cc = country.trim().toUpperCase();
    if ((LATAM_COUNTRIES as readonly string[]).includes(cc)) return "es";
  }

  return "en";
}

/**
 * Server wrapper: read the `locale` cookie. Unknown/absent values fall
 * back to "en" — middleware guarantees the cookie is set on first visit,
 * so this is only a defensive default.
 */
export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  return isLocale(value) ? value : "en";
}

export { COOKIE_NAME as LOCALE_COOKIE };
