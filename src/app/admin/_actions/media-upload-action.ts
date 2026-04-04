"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/connection";
import { media } from "@/db/schema";
import { getStorageAdapter } from "@/lib/storage/storage-adapter";
import { optimizeImage } from "@/lib/media/image-optimizer";
import { generateSeoFilename } from "@/lib/media/seo-slug-generator";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** Validate uploaded file, return error string or null */
function validateFile(file: unknown): string | null {
  if (!file || !(file instanceof File)) return "No file provided";
  if (!file.type.startsWith("image/")) return "Only image uploads supported";
  if (file.size > MAX_FILE_SIZE) return "File too large (max 10MB)";
  return null;
}

/**
 * Upload new media file from admin UI.
 * Creates a new file with SEO-friendly filename.
 */
export async function uploadMediaFile(formData: FormData) {
  try {
    const file = formData.get("file");
    const alt = (formData.get("alt") as string) || "";
    const folder = (formData.get("folder") as string) || null;

    const err = validateFile(file);
    if (err) return { error: err };

    const buffer = Buffer.from(await (file as File).arrayBuffer());
    const optimized = await optimizeImage(buffer, (file as File).type);
    const filename = await generateSeoFilename(alt, (file as File).name, optimized.ext);

    const storage = getStorageAdapter();
    await storage.put(filename, optimized.data, optimized.mimeType);

    const url = `/media/${filename}`;
    const result = await getDb()
      .insert(media)
      .values({
        url,
        alt: alt || null,
        type: "image",
        filename,
        size: optimized.data.length,
        storagePath: filename,
        mimeType: optimized.mimeType,
        width: optimized.width,
        height: optimized.height,
        folder,
      })
      .returning();

    revalidatePath("/admin/media");
    return { data: result[0] };
  } catch (err) {
    console.error("[uploadMediaFile]", err);
    return { error: "Upload failed" };
  }
}

/**
 * Replace existing media file in-place — keeps the same URL.
 * Overwrites the storage file, updates DB metadata (size, dimensions).
 */
export async function replaceMediaFile(formData: FormData) {
  try {
    const file = formData.get("file");
    const existingUrl = (formData.get("existingUrl") as string) || "";

    const err = validateFile(file);
    if (err) return { error: err };

    if (!existingUrl.startsWith("/media/")) {
      return { error: "Can only replace uploaded media files" };
    }

    // Find existing record by URL
    const db = getDb();
    const existing = await db.select().from(media).where(eq(media.url, existingUrl)).limit(1);
    if (!existing[0] || !existing[0].storagePath) {
      return { error: "Media record not found" };
    }

    const buffer = Buffer.from(await (file as File).arrayBuffer());
    const optimized = await optimizeImage(buffer, (file as File).type);

    // Overwrite same storage key — URL stays the same
    const storage = getStorageAdapter();
    await storage.put(existing[0].storagePath, optimized.data, optimized.mimeType);

    // Update DB metadata only (url, filename, storagePath unchanged)
    const result = await db
      .update(media)
      .set({
        size: optimized.data.length,
        mimeType: optimized.mimeType,
        width: optimized.width,
        height: optimized.height,
      })
      .where(eq(media.id, existing[0].id))
      .returning();

    revalidatePath("/admin/media");
    return { data: result[0] };
  } catch (err) {
    console.error("[replaceMediaFile]", err);
    return { error: "Replace failed" };
  }
}
