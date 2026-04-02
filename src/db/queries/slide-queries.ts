import { eq, asc } from "drizzle-orm";
import { getDb } from "../connection";
import { slides } from "../schema";

export async function getActiveSlides() {
  return getDb()
    .select()
    .from(slides)
    .where(eq(slides.active, true))
    .orderBy(asc(slides.sortOrder));
}

export async function getSlideById(id: string) {
  const result = await getDb().select().from(slides).where(eq(slides.id, id)).limit(1);
  return result[0] ?? null;
}

export async function listSlides(limit = 50, offset = 0) {
  const db = getDb();
  const [data, countResult] = await Promise.all([
    db.select().from(slides).orderBy(asc(slides.sortOrder)).limit(limit).offset(offset),
    db.$count(slides),
  ]);
  return { data, total: Number(countResult) };
}
