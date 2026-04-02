"use server";

import { eq, desc } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { media } from "@/db/schema";
import { mediaSchema } from "@/lib/validations/media-schema";

export type MediaRow = typeof media.$inferSelect;
export type PaginationMeta = { total: number; page: number; limit: number; totalPages: number };

export async function fetchAdminMedia(
  page = 1,
  limit = 20,
  type?: string
): Promise<{ data: MediaRow[]; pagination: PaginationMeta }> {
  const offset = (page - 1) * limit;
  const db = getDb();
  const where = type ? eq(media.type, type) : undefined;

  const [data, total] = await Promise.all([
    where
      ? db.select().from(media).where(where).orderBy(desc(media.createdAt)).limit(limit).offset(offset)
      : db.select().from(media).orderBy(desc(media.createdAt)).limit(limit).offset(offset),
    where ? db.$count(media, where) : db.$count(media),
  ]);

  return { data, pagination: { total: Number(total), page, limit, totalPages: Math.ceil(Number(total) / limit) } };
}

export async function createMedia(formData: unknown): Promise<{ data?: MediaRow; error?: string }> {
  const parsed = mediaSchema.safeParse(formData);
  if (!parsed.success) return { error: "Du lieu khong hop le" };

  const result = await getDb()
    .insert(media)
    .values({ ...parsed.data, alt: parsed.data.alt || null, size: parsed.data.size ?? null })
    .returning();

  return { data: result[0] };
}

export async function deleteMedia(id: string): Promise<{ error?: string }> {
  const db = getDb();
  const existing = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!existing[0]) return { error: "Khong tim thay media" };

  await db.delete(media).where(eq(media.id, id));
  return {};
}
