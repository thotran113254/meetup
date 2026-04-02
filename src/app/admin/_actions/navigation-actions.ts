"use server";

import { revalidatePath } from "next/cache";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { navigation } from "@/db/schema";
import { navigationSchema } from "@/lib/validations/navigation-schema";

export type NavRow = typeof navigation.$inferSelect;

export async function fetchAdminNavigation(): Promise<NavRow[]> {
  return getDb().select().from(navigation).orderBy(asc(navigation.sortOrder));
}

export async function createNavItem(formData: unknown): Promise<{ data?: NavRow; error?: string }> {
  const parsed = navigationSchema.safeParse(formData);
  if (!parsed.success) return { error: "Du lieu khong hop le" };

  const result = await getDb()
    .insert(navigation)
    .values({ ...parsed.data, parentId: parsed.data.parentId ?? null })
    .returning();

  revalidatePath("/");
  return { data: result[0] };
}

export async function updateNavItem(id: string, formData: unknown): Promise<{ data?: NavRow; error?: string }> {
  const parsed = navigationSchema.partial().safeParse(formData);
  if (!parsed.success) return { error: "Du lieu khong hop le" };

  const db = getDb();
  const existing = await db.select().from(navigation).where(eq(navigation.id, id)).limit(1);
  if (!existing[0]) return { error: "Khong tim thay muc dieu huong" };

  const result = await db
    .update(navigation)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(navigation.id, id))
    .returning();

  revalidatePath("/");
  return { data: result[0] };
}

export async function deleteNavItem(id: string): Promise<{ error?: string }> {
  const db = getDb();
  const existing = await db.select().from(navigation).where(eq(navigation.id, id)).limit(1);
  if (!existing[0]) return { error: "Khong tim thay muc dieu huong" };

  await db.delete(navigation).where(eq(navigation.id, id));
  revalidatePath("/");
  return {};
}
