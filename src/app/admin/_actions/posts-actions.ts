"use server";

import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { posts } from "@/db/schema";
import { postFormSchema } from "@/lib/validations/post-schema";

export type PostRow = typeof posts.$inferSelect;
export type PaginationMeta = { total: number; page: number; limit: number; totalPages: number };

export async function fetchAdminPosts(
  page = 1,
  limit = 10,
  publishedFilter?: boolean,
  category?: string
): Promise<{ data: PostRow[]; pagination: PaginationMeta }> {
  const offset = (page - 1) * limit;
  const db = getDb();
  const conditions = [];
  if (publishedFilter !== undefined) conditions.push(eq(posts.published, publishedFilter));
  if (category) conditions.push(eq(posts.category, category));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, total] = await Promise.all([
    where
      ? db.select().from(posts).where(where).orderBy(desc(posts.createdAt)).limit(limit).offset(offset)
      : db.select().from(posts).orderBy(desc(posts.createdAt)).limit(limit).offset(offset),
    where ? db.$count(posts, where) : db.$count(posts),
  ]);

  return { data, pagination: { total: Number(total), page, limit, totalPages: Math.ceil(Number(total) / limit) } };
}

export async function createPost(formData: unknown): Promise<{ data?: PostRow; error?: string }> {
  const parsed = postFormSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.flatten().formErrors.join(", ") || "Du lieu khong hop le" };

  const result = await getDb()
    .insert(posts)
    .values({ ...parsed.data, excerpt: parsed.data.excerpt ?? "", publishedAt: parsed.data.published ? new Date() : null })
    .returning();

  revalidatePath("/blog");
  revalidatePath("/");
  return { data: result[0] };
}

export async function updatePost(
  slug: string,
  formData: unknown
): Promise<{ data?: PostRow; error?: string }> {
  const parsed = postFormSchema.partial().safeParse(formData);
  if (!parsed.success) return { error: "Du lieu khong hop le" };

  const db = getDb();
  const existing = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!existing[0]) return { error: "Khong tim thay bai viet" };

  const result = await db
    .update(posts)
    .set({ ...parsed.data, updatedAt: new Date(), publishedAt: parsed.data?.published ? (existing[0].publishedAt ?? new Date()) : null })
    .where(eq(posts.slug, slug))
    .returning();

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { data: result[0] };
}

export async function deletePost(slug: string): Promise<{ error?: string }> {
  const db = getDb();
  const existing = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!existing[0]) return { error: "Khong tim thay bai viet" };

  await db.delete(posts).where(eq(posts.slug, slug));
  revalidatePath("/blog");
  revalidatePath("/");
  return {};
}
