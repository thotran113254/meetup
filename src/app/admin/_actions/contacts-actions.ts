"use server";

import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/db/connection";
import { contactSubmissions } from "@/db/schema";

export type ContactRow = typeof contactSubmissions.$inferSelect;
export type PaginationMeta = { total: number; page: number; limit: number; totalPages: number };

export async function fetchAdminContacts(
  page = 1,
  limit = 10,
  readFilter?: boolean
): Promise<{ data: ContactRow[]; pagination: PaginationMeta }> {
  const offset = (page - 1) * limit;
  const db = getDb();
  const where = readFilter !== undefined ? eq(contactSubmissions.read, readFilter) : undefined;

  const [data, total] = await Promise.all([
    where
      ? db.select().from(contactSubmissions).where(where).orderBy(desc(contactSubmissions.createdAt)).limit(limit).offset(offset)
      : db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(limit).offset(offset),
    where ? db.$count(contactSubmissions, where) : db.$count(contactSubmissions),
  ]);

  return { data, pagination: { total: Number(total), page, limit, totalPages: Math.ceil(Number(total) / limit) } };
}

export async function toggleContactRead(id: string): Promise<{ data?: ContactRow; error?: string }> {
  const db = getDb();
  const existing = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1);
  if (!existing[0]) return { error: "Khong tim thay tin nhan" };

  const result = await db
    .update(contactSubmissions)
    .set({ read: !existing[0].read })
    .where(eq(contactSubmissions.id, id))
    .returning();

  revalidatePath("/admin/contacts");
  return { data: result[0] };
}

export async function deleteContact(id: string): Promise<{ error?: string }> {
  const db = getDb();
  const existing = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1);
  if (!existing[0]) return { error: "Khong tim thay tin nhan" };

  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  revalidatePath("/admin/contacts");
  return {};
}
