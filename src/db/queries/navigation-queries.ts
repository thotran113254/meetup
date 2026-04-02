import { eq, asc, isNull } from "drizzle-orm";
import { getDb } from "../connection";
import { navigation } from "../schema";

/** Return full nav list as tree: top-level items with nested children */
export async function getNavigationTree() {
  const all = await getDb()
    .select()
    .from(navigation)
    .where(eq(navigation.active, true))
    .orderBy(asc(navigation.sortOrder));

  const topLevel = all.filter((n) => !n.parentId);
  return topLevel.map((parent) => ({
    ...parent,
    children: all.filter((n) => n.parentId === parent.id),
  }));
}

export async function getNavItemById(id: string) {
  const result = await getDb().select().from(navigation).where(eq(navigation.id, id)).limit(1);
  return result[0] ?? null;
}

export async function listNavigation() {
  return getDb().select().from(navigation).orderBy(asc(navigation.sortOrder));
}
