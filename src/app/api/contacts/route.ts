import { NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { contactSubmissions } from "@/db/schema";
import { validateApiKey, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const readParam = searchParams.get("read");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 100);
    const page = Math.max(parseInt(searchParams.get("page") ?? "1"), 1);
    const offset = (page - 1) * limit;

    const db = getDb();
    const whereClause = readParam !== null ? eq(contactSubmissions.read, readParam === "true") : undefined;

    const [data, total] = await Promise.all([
      whereClause
        ? db.select().from(contactSubmissions).where(whereClause).orderBy(desc(contactSubmissions.createdAt)).limit(limit).offset(offset)
        : db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(limit).offset(offset),
      whereClause ? db.$count(contactSubmissions, whereClause) : db.$count(contactSubmissions),
    ]);

    const totalPages = Math.ceil(Number(total) / limit);
    return Response.json({ data, pagination: { total: Number(total), page, limit, totalPages } });
  } catch (err) {
    console.error("[GET /api/contacts]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
