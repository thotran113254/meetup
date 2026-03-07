import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { contactSubmissions } from "@/db/schema";
import { validateApiKey, unauthorizedResponse } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await request.json();

    if (typeof body.read !== "boolean") {
      return Response.json({ error: "Field 'read' must be a boolean" }, { status: 400 });
    }

    const db = getDb();
    const existing = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);

    if (!existing[0]) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const result = await db
      .update(contactSubmissions)
      .set({ read: body.read })
      .where(eq(contactSubmissions.id, id))
      .returning();

    return Response.json({ submission: result[0] });
  } catch (err) {
    console.error("[PUT /api/contacts/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const { id } = await params;
    const db = getDb();

    const existing = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);

    if (!existing[0]) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));

    return Response.json({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/contacts/[id]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
