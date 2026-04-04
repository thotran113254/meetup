import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/connection";
import { media } from "@/db/schema";
import { checkApiAccess } from "@/lib/api-auth";
import { getStorageAdapter } from "@/lib/storage/storage-adapter";
import { optimizeImage } from "@/lib/media/image-optimizer";
import { generateSeoFilename } from "@/lib/media/seo-slug-generator";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** POST /api/media/upload — multipart file upload with optimization */
export async function POST(request: NextRequest) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const alt = (formData.get("alt") as string) || "";
    const folder = (formData.get("folder") as string) || null;

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "Only image uploads supported" },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const optimized = await optimizeImage(buffer, file.type);
    const filename = await generateSeoFilename(alt, file.name, optimized.ext);

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

    return Response.json({ data: result[0] }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/media/upload]", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
