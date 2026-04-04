import { mkdir, readFile, writeFile, unlink, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import type { StorageAdapter } from "./storage-adapter";

/** MIME type lookup by extension */
const MIME_MAP: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};

/**
 * Local filesystem storage adapter.
 * Stores files in UPLOAD_DIR (default: data/uploads/ at project root).
 */
export class LocalStorageAdapter implements StorageAdapter {
  private readonly baseDir: string;

  constructor() {
    this.baseDir = process.env.UPLOAD_DIR ?? join(process.cwd(), "data", "uploads");
  }

  // contentType not stored — MIME derived from file extension on read (safe because
  // image-optimizer.ts always sets the correct extension: .webp, .svg, .gif)
  async put(key: string, data: Buffer, _contentType: string): Promise<string> {
    await mkdir(this.baseDir, { recursive: true });
    const filePath = join(this.baseDir, key);
    await writeFile(filePath, data);
    return key;
  }

  async get(key: string): Promise<{ data: Buffer; contentType: string } | null> {
    try {
      const filePath = join(this.baseDir, key);
      const data = await readFile(filePath);
      const ext = extname(key).toLowerCase();
      const contentType = MIME_MAP[ext] ?? "application/octet-stream";
      return { data, contentType };
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await unlink(join(this.baseDir, key));
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await stat(join(this.baseDir, key));
      return true;
    } catch {
      return false;
    }
  }
}
