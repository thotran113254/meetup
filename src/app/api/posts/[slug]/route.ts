import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { posts } from "@/db/schema";
import { postFormSchema } from "@/lib/validations/post-schema";
import { validateApiKey, unauthorizedResponse } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const result = await getDb().select().from(posts).where(eq(posts.slug, slug)).limit(1);
    if (!result[0]) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ post: result[0] });
  } catch (err) {
    console.error("[GET /api/posts/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const { slug } = await params;
    const db = getDb();

    const existing = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    if (!existing[0]) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = postFormSchema.partial().safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
    if (parsed.data.published === true && !existing[0].publishedAt) {
      updateData.publishedAt = new Date();
    }

    const result = await db.update(posts).set(updateData).where(eq(posts.slug, slug)).returning();

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/");

    return Response.json({ post: result[0] });
  } catch (err) {
    console.error("[PUT /api/posts/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  try {
    const { slug } = await params;
    const db = getDb();

    const existing = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    if (!existing[0]) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await db.delete(posts).where(eq(posts.slug, slug));

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/");

    return Response.json({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/posts/[slug]]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
