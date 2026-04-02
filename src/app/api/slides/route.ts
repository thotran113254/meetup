import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/connection";
import { slides } from "@/db/schema";
import { slideSchema } from "@/lib/validations/slide-schema";
import { checkApiAccess } from "@/lib/api-auth";
import { listSlides } from "@/db/queries/slide-queries";

/** GET /api/slides?limit=10&offset=0 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") ?? "0"), 0);
    const page = Math.max(parseInt(searchParams.get("page") ?? "1"), 1);
    const effectiveOffset = searchParams.has("page") ? (page - 1) * limit : offset;

    const { data, total } = await listSlides(limit, effectiveOffset);
    const totalPages = Math.ceil(total / limit);

    return Response.json({
      data,
      pagination: { total, page: searchParams.has("page") ? page : Math.floor(effectiveOffset / limit) + 1, limit, totalPages },
    });
  } catch (err) {
    console.error("[GET /api/slides]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/slides — auth required */
export async function POST(request: NextRequest) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = slideSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await getDb()
      .insert(slides)
      .values({
        ...parsed.data,
        subtitle: parsed.data.subtitle || null,
        link: parsed.data.link || null,
      })
      .returning();

    revalidatePath("/");

    return Response.json({ data: result[0] }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/slides]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
