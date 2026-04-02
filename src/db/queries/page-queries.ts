import { eq, desc } from "drizzle-orm";
import { getDb } from "../connection";
import { pages } from "../schema";

export async function getPageBySlug(slug: string) {
  const result = await getDb().select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return result[0] ?? null;
}

export async function listPages(limit = 50, offset = 0) {
  const db = getDb();
  const [data, countResult] = await Promise.all([
    db.select().from(pages).orderBy(desc(pages.createdAt)).limit(limit).offset(offset),
    db.$count(pages),
  ]);
  return { data, total: Number(countResult) };
}
