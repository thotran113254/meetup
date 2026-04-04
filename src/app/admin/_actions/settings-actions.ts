"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db/connection";
import { siteSettings } from "@/db/schema";

export type SettingRow = typeof siteSettings.$inferSelect;

export async function fetchAdminSettings(): Promise<SettingRow[]> {
  return getDb().select().from(siteSettings);
}

export async function upsertSetting(key: string, value: unknown): Promise<{ data?: SettingRow; error?: string }> {
  if (!key) return { error: "Key không được trống" };

  const result = await getDb()
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } })
    .returning();

  // Revalidate all pages using the root layout — covers all CMS-managed public pages
  revalidatePath("/", "layout");
  return { data: result[0] };
}
