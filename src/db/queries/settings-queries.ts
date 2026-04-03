import { eq } from "drizzle-orm";
import { getDb } from "../connection";
import { siteSettings } from "../schema";

/** Get a single setting value by key, typed as T. Returns null if not found. */
export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  const result = await getDb()
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);
  if (!result[0]) return null;
  return result[0].value as T;
}

/** Get multiple settings at once. Returns a map of key → value. */
export async function getSettings(keys: string[]): Promise<Record<string, unknown>> {
  if (keys.length === 0) return {};
  const rows = await getDb()
    .select({ key: siteSettings.key, value: siteSettings.value })
    .from(siteSettings);
  const map: Record<string, unknown> = {};
  for (const row of rows) {
    if (keys.includes(row.key)) map[row.key] = row.value;
  }
  return map;
}
