import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { posts } from "@/db/schema";
import { validateApiKey, unauthorizedResponse } from "@/lib/api-auth";

type SeoIssue = { slug: string; type: string; message: string };

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const publishedPosts = await getDb()
      .select()
      .from(posts)
      .where(eq(posts.published, true));

    const issues: SeoIssue[] = [];

    for (const post of publishedPosts) {
      if (!post.metaTitle) {
        issues.push({ slug: post.slug, type: "missing_meta_title", message: "Missing meta title" });
      }
      if (!post.metaDescription) {
        issues.push({ slug: post.slug, type: "missing_meta_description", message: "Missing meta description" });
      }
      if (!post.excerpt || post.excerpt.length < 10) {
        issues.push({ slug: post.slug, type: "missing_excerpt", message: "Missing or too short excerpt" });
      }
      if (!post.content || post.content.length < 300) {
        issues.push({ slug: post.slug, type: "short_content", message: "Content is too short (< 300 chars)" });
      }
    }

    const totalChecks = publishedPosts.length * 4;
    const score = totalChecks > 0
      ? Math.round(((totalChecks - issues.length) / totalChecks) * 100)
      : 100;

    return Response.json({ issues, score, postsAnalyzed: publishedPosts.length });
  } catch (err) {
    console.error("[GET /api/seo/audit]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
