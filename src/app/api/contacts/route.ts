import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { contactSubmissions } from "@/db/schema";
import { validateApiKey, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const readParam = searchParams.get("read");

    const db = getDb();
    const results =
      readParam !== null
        ? await db
            .select()
            .from(contactSubmissions)
            .where(eq(contactSubmissions.read, readParam === "true"))
        : await db.select().from(contactSubmissions);

    return Response.json({ submissions: results, total: results.length });
  } catch (err) {
    console.error("[GET /api/contacts]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
