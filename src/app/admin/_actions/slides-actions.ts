"use server";

import { revalidatePath } from "next/cache";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { slides } from "@/db/schema";
import { slideSchema } from "@/lib/validations/slide-schema";

export type SlideRow = typeof slides.$inferSelect;

export async function fetchAdminSlides(): Promise<SlideRow[]> {
  return getDb().select().from(slides).orderBy(asc(slides.sortOrder));
}

export async function createSlide(formData: unknown): Promise<{ data?: SlideRow; error?: string }> {
  const parsed = slideSchema.safeParse(formData);
  if (!parsed.success) return { error: "Du lieu khong hop le" };

  const result = await getDb()
    .insert(slides)
    .values({ ...parsed.data, subtitle: parsed.data.subtitle || null, link: parsed.data.link || null })
    .returning();

  revalidatePath("/");
  return { data: result[0] };
}

export async function updateSlide(id: string, formData: unknown): Promise<{ data?: SlideRow; error?: string }> {
  const parsed = slideSchema.partial().safeParse(formData);
  if (!parsed.success) return { error: "Du lieu khong hop le" };

  const db = getDb();
  const existing = await db.select().from(slides).where(eq(slides.id, id)).limit(1);
  if (!existing[0]) return { error: "Khong tim thay slide" };

  const result = await db
    .update(slides)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(slides.id, id))
    .returning();

  revalidatePath("/");
  return { data: result[0] };
}

export async function deleteSlide(id: string): Promise<{ error?: string }> {
  const db = getDb();
  const existing = await db.select().from(slides).where(eq(slides.id, id)).limit(1);
  if (!existing[0]) return { error: "Khong tim thay slide" };

  await db.delete(slides).where(eq(slides.id, id));
  revalidatePath("/");
  return {};
}
