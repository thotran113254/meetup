import sharp from "sharp";

export interface OptimizedImage {
  data: Buffer;
  width: number;
  height: number;
  mimeType: string;
  ext: string; // "webp" | "svg" | "gif"
}

const MAX_DIMENSION = 2048;
const WEBP_QUALITY = 80;

// MIME types that should NOT be processed by sharp — preserve vectors/animation
const PASSTHROUGH_TYPES = new Set(["image/svg+xml", "image/gif"]);

/**
 * Optimize image buffer: resize to max 2048px on longest side, convert to WebP q80.
 * SVG and GIF pass through unchanged (preserve vectors/animation).
 */
export async function optimizeImage(
  buffer: Buffer,
  mimeType: string
): Promise<OptimizedImage> {
  // SVG / GIF: pass through unchanged, only read metadata for dimensions
  if (PASSTHROUGH_TYPES.has(mimeType)) {
    const ext = mimeType === "image/svg+xml" ? "svg" : "gif";
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        data: buffer,
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
        mimeType,
        ext,
      };
    } catch {
      // SVG metadata may fail in some sharp builds — return 0,0
      return { data: buffer, width: 0, height: 0, mimeType, ext };
    }
  }

  // Raster images: resize within bounds + convert to WebP
  const optimized = await sharp(buffer)
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside", // preserve aspect ratio
      withoutEnlargement: true, // don't upscale small images
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  return {
    data: optimized.data,
    width: optimized.info.width,
    height: optimized.info.height,
    mimeType: "image/webp",
    ext: "webp",
  };
}
