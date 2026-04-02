import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { navigation } from "@/db/schema";
import { navigationSchema } from "@/lib/validations/navigation-schema";
import { checkApiAccess } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const db = getDb();
    const existing = await db.select().from(navigation).where(eq(navigation.id, id)).limit(1);
    if (!existing[0]) return Response.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const parsed = navigationSchema.partial().safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await db
      .update(navigation)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(navigation.id, id))
      .returning();

    revalidatePath("/");

    return Response.json({ data: result[0] });
  } catch (err) {
    console.error("[PUT /api/navigation/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const db = getDb();
    const existing = await db.select().from(navigation).where(eq(navigation.id, id)).limit(1);
    if (!existing[0]) return Response.json({ error: "Not found" }, { status: 404 });

    await db.delete(navigation).where(eq(navigation.id, id));
    revalidatePath("/");

    return Response.json({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/navigation/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
