/**
 * lib/site-url.ts — canonical origin for absolute URLs (metadataBase,
 * sitemap, robots, OG tags).
 *
 * Env-optional: `NEXT_PUBLIC_SITE_URL` wins when set (e.g. a preview
 * deployment); otherwise we fall back to the studio's intended domain.
 * TODO(content): confirm the production domain — the fallback
 * https://argonathgroup.com is assumed, not confirmed (D-011).
 *
 * The env value is normalized (D-016): trimmed, stripped of any
 * trailing slash, and given an `https://` prefix when it has no
 * protocol — Vercel env vars are commonly entered without one, and the
 * raw value must stay safe for `new URL()` at module scope.
 */
function normalizeSiteUrl(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim().replace(/\/+$/, "");
  if (!trimmed) return "https://argonathgroup.com";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
