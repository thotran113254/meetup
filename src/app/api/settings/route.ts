import { NextRequest } from "next/server";
import { getDb } from "@/db/connection";
import { siteSettings } from "@/db/schema";
import { validateApiKey, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const settings = await getDb().select().from(siteSettings);
    return Response.json({ settings });
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const body = await request.json();

    if (!body.key || typeof body.key !== "string") {
      return Response.json({ error: "Field 'key' is required" }, { status: 400 });
    }
    if (body.value === undefined) {
      return Response.json({ error: "Field 'value' is required" }, { status: 400 });
    }

    const result = await getDb()
      .insert(siteSettings)
      .values({ key: body.key, value: body.value })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: body.value, updatedAt: new Date() },
      })
      .returning();

    return Response.json({ setting: result[0] });
  } catch (err) {
    console.error("[PUT /api/settings]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
