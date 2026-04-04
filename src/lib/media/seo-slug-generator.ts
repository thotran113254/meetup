import { getStorageAdapter } from "@/lib/storage/storage-adapter";

/**
 * Generate SEO-friendly filename from alt text or original filename.
 * Examples:
 *   alt="Tour Hạ Long Bay hoàng hôn" → "tour-ha-long-bay-hoang-hon.webp"
 *   alt="" + filename="IMG_123.jpg"  → "img-123.webp"
 *   collision → append "-2", "-3", etc.
 */
export async function generateSeoFilename(
  alt: string | undefined,
  originalFilename: string,
  ext: string
): Promise<string> {
  // Prefer alt text, fallback to original filename without extension
  const raw = (alt?.trim() || originalFilename.replace(/\.[^.]+$/, "")).trim();

  // Slugify: lowercase, remove Vietnamese diacritics, replace non-alphanumeric with dash
  const slug = slugify(raw);

  // Limit to 60 chars (SEO best practice), trim trailing dashes
  const trimmed = slug.slice(0, 60).replace(/-+$/, "");

  // Collision check: append -2, -3, etc.
  const storage = getStorageAdapter();
  let candidate = `${trimmed}.${ext}`;
  let counter = 2;
  while (await storage.exists(candidate)) {
    candidate = `${trimmed}-${counter}.${ext}`;
    counter++;
  }

  return candidate;
}

/** Slugify with Vietnamese diacritics removal */
function slugify(text: string): string {
  return text
    .toLowerCase()
    // Replace Vietnamese đ/Đ before NFD decomposition (they don't decompose to base+diacritic)
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric → dash
    .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
    .replace(/-{2,}/g, "-"); // collapse multiple dashes
}
