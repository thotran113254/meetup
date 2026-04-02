import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/connection";
import { navigation } from "@/db/schema";
import { navigationSchema } from "@/lib/validations/navigation-schema";
import { checkApiAccess } from "@/lib/api-auth";
import { getNavigationTree } from "@/db/queries/navigation-queries";

/** GET /api/navigation — returns tree structure */
export async function GET() {
  try {
    const tree = await getNavigationTree();
    return Response.json({ data: tree });
  } catch (err) {
    console.error("[GET /api/navigation]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/navigation — auth required */
export async function POST(request: NextRequest) {
  const authError = checkApiAccess(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = navigationSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await getDb()
      .insert(navigation)
      .values({
        ...parsed.data,
        parentId: parsed.data.parentId ?? null,
      })
      .returning();

    revalidatePath("/");

    return Response.json({ data: result[0] }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/navigation]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
