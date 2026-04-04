import { eq, desc, and } from "drizzle-orm";
import { getDb } from "../connection";
import { posts } from "../schema";
import type { BlogPost, BlogSection } from "@/lib/blog-data";

/** Slugify a heading string for use as a DOM id */
function headingToId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || "section";
}

/** Parse Markdown string into BlogSection[] by splitting on ## headings.
 *  Content before the first heading becomes an intro section (no subtitle).
 *  Each ## heading starts a new section; its body is kept as Markdown.
 */
function parseMarkdownSections(markdown: string): BlogSection[] {
  const sections: BlogSection[] = [];
  // Split at each ## heading (keep the delimiter)
  const chunks = markdown.split(/(?=^## )/m);

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("## ")) {
      const newline = trimmed.indexOf("\n");
      const subtitle = (newline === -1 ? trimmed : trimmed.slice(0, newline)).replace(/^## /, "").trim();
      const body = newline === -1 ? "" : trimmed.slice(newline + 1).trim();
      sections.push({ id: headingToId(subtitle), subtitle, image: "", paragraphs: body ? [body] : [] });
    } else {
      // Intro block before first heading
      sections.push({ id: "intro", subtitle: "", image: "", paragraphs: [trimmed] });
    }
  }

  return sections.length > 0 ? sections : [{ id: "content", subtitle: "", image: "", paragraphs: [markdown] }];
}

/** Map a DB post row to the BlogPost interface expected by frontend components.
 *  content field is Markdown (new format) or legacy JSON BlogSection[] (backward compat).
 */
export function mapDbPostToBlogPost(dbPost: typeof posts.$inferSelect): BlogPost {
  let sections: BlogSection[] = [];

  const raw = dbPost.content || "";
  // Detect legacy JSON sections format
  if (raw.trimStart().startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) sections = parsed as BlogSection[];
    } catch { /* fall through to markdown */ }
  }

  if (sections.length === 0 && raw) {
    sections = parseMarkdownSections(raw);
  }

  const date = (dbPost.publishedAt ?? dbPost.createdAt).toISOString().split("T")[0];
  const wordCount = raw.split(/\s+/).length;
  const readTime = `${Math.max(2, Math.ceil(wordCount / 200))} phút đọc`;

  return {
    slug: dbPost.slug,
    title: dbPost.title,
    excerpt: dbPost.excerpt ?? "",
    date,
    author: dbPost.author,
    category: dbPost.category,
    readTime,
    image: dbPost.coverImage ?? "",
    sections,
  };
}

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
