import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site-config";

/**
 * robots.txt - served at /robots.txt by Next.js.
 * Allows all crawlers and points to sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
