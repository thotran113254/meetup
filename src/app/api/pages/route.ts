import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/connection";
import { pages } from "@/db/schema";
import { pageSchema } from "@/lib/validations/page-schema";
import { checkApiAccess } from "@/lib/api-auth";
import { listPages } from "@/db/queries/page-queries";

/** GET /api/pages?limit=10&page=1 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    const page = Math.max(parseInt(searchParams.get("page") ?? "1"), 1);
    const offset = (page - 1) * limit;

    const { data, total } = await listPages(limit, offset);
    const totalPages = Math.ceil(total / limit);

    return Response.json({ data, pagination: { total, page, limit, totalPages } });
  } catch (err) {
    console.error("[GET /api/pages]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/pages — auth required */
export async function POST(request: NextRequest) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = pageSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await getDb()
      .insert(pages)
      .values({
        ...parsed.data,
        metaTitle: parsed.data.metaTitle || null,
        metaDescription: parsed.data.metaDescription || null,
      })
      .returning();

    revalidatePath("/");

    return Response.json({ data: result[0] }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/pages]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
