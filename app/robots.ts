import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/** app/robots.ts — everything is crawlable; point crawlers at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
