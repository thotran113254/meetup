import { eq, desc, and } from "drizzle-orm";
import { getDb } from "../connection";
import { posts } from "../schema";

/** Get all published posts ordered by date */
export async function getPublishedPosts() {
  return getDb()
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt));
}

/** Get a single post by slug */
export async function getPostBySlug(slug: string) {
  const result = await getDb()
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);
  return result[0] ?? null;
}

/** Get all published post slugs (for generateStaticParams) */
export async function getAllPostSlugs() {
  return getDb()
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.published, true));
}
