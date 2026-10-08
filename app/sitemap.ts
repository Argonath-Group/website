import type { MetadataRoute } from "next";
import { labEntries, projectEntries } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

/**
 * app/sitemap.ts — every indexable route: the static pages plus every
 * project-archive and lab slug from content. No lastModified (the
 * dates are TODO(content) stubs), so the sitemap stays fully static.
 * Entries with an empty href (Labeler, D-023) have no page and are
 * excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/projects",
    "/lab",
    "/partners",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];
  const projectRoutes = projectEntries
    .filter((entry) => entry.href !== "")
    .map((entry) => entry.href);
  const labRoutes = labEntries.map((entry) => `/lab/${entry.slug}`);

  return [...staticRoutes, ...projectRoutes, ...labRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
