import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { media } from "@/db/schema";
import { checkApiAccess } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await getDb().select().from(media).where(eq(media.id, id)).limit(1);
    if (!result[0]) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: result[0] });
  } catch (err) {
    console.error("[GET /api/media/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const db = getDb();
    const existing = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (!existing[0]) return Response.json({ error: "Not found" }, { status: 404 });

    await db.delete(media).where(eq(media.id, id));

    return Response.json({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/media/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
