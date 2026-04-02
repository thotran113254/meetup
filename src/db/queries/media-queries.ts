import { eq, desc } from "drizzle-orm";
import { getDb } from "../connection";
import { media } from "../schema";

export async function getMediaById(id: string) {
  const result = await getDb().select().from(media).where(eq(media.id, id)).limit(1);
  return result[0] ?? null;
}

export async function listMedia(limit = 50, offset = 0, type?: string) {
  const db = getDb();
  const baseQuery = db.select().from(media);
  const filtered = type ? baseQuery.where(eq(media.type, type)) : baseQuery;
  const [data, countResult] = await Promise.all([
    filtered.orderBy(desc(media.createdAt)).limit(limit).offset(offset),
    type ? db.$count(media, eq(media.type, type)) : db.$count(media),
  ]);
  return { data, total: Number(countResult) };
}
