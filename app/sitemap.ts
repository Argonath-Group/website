import type { MetadataRoute } from "next";
import { labEntries, workEntries } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

/**
 * app/sitemap.ts — every indexable route: the static pages plus every
 * work-archive and lab slug from content/site.ts. No lastModified (the
 * dates are TODO(content) stubs), so the sitemap stays fully static.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/lab", "/about", "/contact"];
  const workRoutes = workEntries.map((entry) => entry.href);
  const labRoutes = labEntries.map((entry) => `/lab/${entry.slug}`);

  return [...staticRoutes, ...workRoutes, ...labRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
