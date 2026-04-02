import { NextRequest } from "next/server";
import { getDb } from "@/db/connection";
import { media } from "@/db/schema";
import { mediaSchema } from "@/lib/validations/media-schema";
import { checkApiAccess } from "@/lib/api-auth";
import { listMedia } from "@/db/queries/media-queries";

/** GET /api/media?limit=10&page=1&type=image */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    const page = Math.max(parseInt(searchParams.get("page") ?? "1"), 1);
    const offset = (page - 1) * limit;
    const type = searchParams.get("type") ?? undefined;

    const { data, total } = await listMedia(limit, offset, type);
    const totalPages = Math.ceil(total / limit);

    return Response.json({ data, pagination: { total, page, limit, totalPages } });
  } catch (err) {
    console.error("[GET /api/media]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/media — auth required */
export async function POST(request: NextRequest) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = mediaSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await getDb()
      .insert(media)
      .values({
        ...parsed.data,
        alt: parsed.data.alt || null,
        size: parsed.data.size ?? null,
      })
      .returning();

    return Response.json({ data: result[0] }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/media]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
