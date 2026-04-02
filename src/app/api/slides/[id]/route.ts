import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { slides } from "@/db/schema";
import { slideSchema } from "@/lib/validations/slide-schema";
import { checkApiAccess } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await getDb().select().from(slides).where(eq(slides.id, id)).limit(1);
    if (!result[0]) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: result[0] });
  } catch (err) {
    console.error("[GET /api/slides/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const db = getDb();
    const existing = await db.select().from(slides).where(eq(slides.id, id)).limit(1);
    if (!existing[0]) return Response.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const parsed = slideSchema.partial().safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await db
      .update(slides)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(slides.id, id))
      .returning();

    revalidatePath("/");

    return Response.json({ data: result[0] });
  } catch (err) {
    console.error("[PUT /api/slides/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const db = getDb();
    const existing = await db.select().from(slides).where(eq(slides.id, id)).limit(1);
    if (!existing[0]) return Response.json({ error: "Not found" }, { status: 404 });

    await db.delete(slides).where(eq(slides.id, id));
    revalidatePath("/");

    return Response.json({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/slides/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
