import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site-config";
import { BLOG_POSTS } from "@/lib/blog-data";

/**
 * Dynamic sitemap - returns all static routes + blog posts.
 * Next.js auto-serves this at /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
