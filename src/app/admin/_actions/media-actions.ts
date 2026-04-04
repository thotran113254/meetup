"use server";

import { eq, desc, sql, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/connection";
import { media, posts, slides, tourPackages, siteSettings, pages } from "@/db/schema";
import { mediaSchema } from "@/lib/validations/media-schema";
import { getStorageAdapter } from "@/lib/storage/storage-adapter";

export type MediaRow = typeof media.$inferSelect;
export type PaginationMeta = { total: number; page: number; limit: number; totalPages: number };

export async function fetchAdminMedia(
  page = 1,
  limit = 20,
  type?: string,
  folder?: string | null
): Promise<{ data: MediaRow[]; pagination: PaginationMeta }> {
  const offset = (page - 1) * limit;
  const db = getDb();

  // Build where conditions
  const conditions = [];
  if (type) conditions.push(eq(media.type, type));
  if (folder === null) conditions.push(isNull(media.folder)); // root folder
  else if (folder) conditions.push(eq(media.folder, folder));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, total] = await Promise.all([
    where
      ? db.select().from(media).where(where).orderBy(desc(media.createdAt)).limit(limit).offset(offset)
      : db.select().from(media).orderBy(desc(media.createdAt)).limit(limit).offset(offset),
    where ? db.$count(media, where) : db.$count(media),
  ]);

  return { data, pagination: { total: Number(total), page, limit, totalPages: Math.ceil(Number(total) / limit) } };
}

/** Get folder names with item counts */
export async function fetchMediaFolders(): Promise<{ name: string; count: number }[]> {
  const db = getDb();
  const result = await db
    .select({
      folder: media.folder,
      count: sql<number>`count(*)::int`,
    })
    .from(media)
    .where(sql`${media.folder} IS NOT NULL AND ${media.folder} != ''`)
    .groupBy(media.folder)
    .orderBy(media.folder);
  return result.map((r) => ({ name: r.folder!, count: r.count }));
}

/** Get count of items without folder (root) */
export async function fetchRootMediaCount(): Promise<number> {
  const db = getDb();
  return Number(await db.$count(media, isNull(media.folder)));
}

/** Update folder for a media item */
export async function updateMediaFolder(id: string, folder: string | null) {
  await getDb().update(media).set({ folder: folder || null }).where(eq(media.id, id));
  revalidatePath("/admin/media");
  return {};
}

/** Rename all media in a folder */
export async function renameMediaFolder(oldName: string, newName: string) {
  await getDb().update(media).set({ folder: newName }).where(eq(media.folder, oldName));
  revalidatePath("/admin/media");
  return {};
}

/** Move all media from a folder to root (unfiled), effectively deleting the folder */
export async function deleteMediaFolder(folderName: string) {
  await getDb().update(media).set({ folder: null }).where(eq(media.folder, folderName));
  revalidatePath("/admin/media");
  return {};
}

/**
 * Count how many places a media URL is referenced across all CMS tables.
 * Checks: posts (coverImage, ogImage, content), slides (image),
 * tourPackages (image, gallery), siteSettings (jsonb values), pages (sections jsonb).
 */
export async function getMediaUsage(url: string): Promise<{ total: number; details: string[] }> {
  if (!url) return { total: 0, details: [] };

  const db = getDb();
  const details: string[] = [];
  let total = 0;

  // Use raw SQL for efficiency — single query scanning all tables
  const [
    postCover,
    postOg,
    postContent,
    slideCount,
    tourImage,
    tourGallery,
    settingsCount,
    pagesCount,
  ] = await Promise.all([
    db.$count(posts, eq(posts.coverImage, url)),
    db.$count(posts, eq(posts.ogImage, url)),
    db.$count(posts, sql`${posts.content} LIKE ${"%" + url + "%"}`),
    db.$count(slides, eq(slides.image, url)),
    db.$count(tourPackages, eq(tourPackages.image, url)),
    db.$count(tourPackages, sql`${tourPackages.gallery}::text LIKE ${"%" + url + "%"}`),
    db.$count(siteSettings, sql`${siteSettings.value}::text LIKE ${"%" + url + "%"}`),
    db.$count(pages, sql`${pages.sections}::text LIKE ${"%" + url + "%"}`),
  ]);

  const pc = Number(postCover);
  const po = Number(postOg);
  const pco = Number(postContent);
  const sc = Number(slideCount);
  const ti = Number(tourImage);
  const tg = Number(tourGallery);
  const stc = Number(settingsCount);
  const pgc = Number(pagesCount);

  if (pc > 0) { details.push(`${pc} bài viết (ảnh bìa)`); total += pc; }
  if (po > 0) { details.push(`${po} bài viết (OG image)`); total += po; }
  if (pco > 0) { details.push(`${pco} bài viết (nội dung)`); total += pco; }
  if (sc > 0) { details.push(`${sc} slide`); total += sc; }
  if (ti > 0) { details.push(`${ti} tour (ảnh bìa)`); total += ti; }
  if (tg > 0) { details.push(`${tg} tour (gallery)`); total += tg; }
  if (stc > 0) { details.push(`${stc} cài đặt`); total += stc; }
  if (pgc > 0) { details.push(`${pgc} trang`); total += pgc; }

  return { total, details };
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

  // Delete storage file if it exists
  if (existing[0].storagePath) {
    try {
      const storage = getStorageAdapter();
      await storage.delete(existing[0].storagePath);
    } catch (err) {
      console.error("[deleteMedia] storage delete failed:", err);
    }
  }

  await db.delete(media).where(eq(media.id, id));
  revalidatePath("/admin/media");
  return {};
}
