import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { pages } from "@/db/schema";
import { pageSchema } from "@/lib/validations/page-schema";
import { checkApiAccess } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const result = await getDb().select().from(pages).where(eq(pages.slug, slug)).limit(1);
    if (!result[0]) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: result[0] });
  } catch (err) {
    console.error("[GET /api/pages/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const { slug } = await params;
    const db = getDb();
    const existing = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    if (!existing[0]) return Response.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const parsed = pageSchema.partial().safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await db
      .update(pages)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(pages.slug, slug))
      .returning();

    revalidatePath("/");
    revalidatePath(`/${slug}`);

    return Response.json({ data: result[0] });
  } catch (err) {
    console.error("[PUT /api/pages/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const { slug } = await params;
    const db = getDb();
    const existing = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    if (!existing[0]) return Response.json({ error: "Not found" }, { status: 404 });

    await db.delete(pages).where(eq(pages.slug, slug));
    revalidatePath("/");

    return Response.json({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/pages/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
