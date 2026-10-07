/**
 * lib/site-url.ts — canonical origin for absolute URLs (metadataBase,
 * sitemap, robots, OG tags).
 *
 * Env-optional: `NEXT_PUBLIC_SITE_URL` wins when set (e.g. a preview
 * deployment); otherwise we fall back to the studio's intended domain.
 * TODO(content): confirm the production domain — the fallback
 * https://argonathgroup.com is assumed, not confirmed (D-011).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://argonathgroup.com";
