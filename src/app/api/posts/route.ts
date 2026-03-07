import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { posts } from "@/db/schema";
import { postFormSchema } from "@/lib/validations/post-schema";
import { validateApiKey, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const publishedParam = searchParams.get("published");
    const category = searchParams.get("category");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

    const db = getDb();
    let query = db.select().from(posts);

    const conditions = [];
    if (publishedParam !== null) {
      conditions.push(eq(posts.published, publishedParam === "true"));
    }
    if (category) {
      conditions.push(eq(posts.category, category));
    }

    const results = await (conditions.length > 0
      ? query.where(and(...conditions)).limit(limit)
      : query.limit(limit));

    return Response.json({ posts: results, total: results.length });
  } catch (err) {
    console.error("[GET /api/posts]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsed = postFormSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const db = getDb();
    const result = await db
      .insert(posts)
      .values({
        ...data,
        excerpt: data.excerpt ?? "",
        coverImage: data.coverImage ?? null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        publishedAt: data.published ? new Date() : null,
      })
      .returning();

    revalidatePath("/blog");
    revalidatePath("/");

    return Response.json({ post: result[0], message: "Created" }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/posts]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
