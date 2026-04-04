import { eq, asc, inArray } from "drizzle-orm";
import { getDb } from "../connection";
import { tourPackages } from "../schema";
import type { TourPackage, TourPackageInput, ItineraryDay, PricingGroup } from "@/lib/types/tours-cms-types";

/** Cast raw DB row (jsonb as unknown) to fully-typed TourPackage */
function toTourPackage(row: typeof tourPackages.$inferSelect): TourPackage {
  return {
    ...row,
    tags: (row.tags as string[]) ?? [],
    gallery: (row.gallery as string[]) ?? [],
    places: (row.places as string[]) ?? [],
    itinerary: (row.itinerary as ItineraryDay[]) ?? [],
    pricingOptions: (row.pricingOptions as PricingGroup[]) ?? [],
  };
}

/** All tours ordered by sortOrder then createdAt — for admin */
export async function getAllTourPackages(): Promise<TourPackage[]> {
  const rows = await getDb()
    .select()
    .from(tourPackages)
    .orderBy(asc(tourPackages.sortOrder), asc(tourPackages.createdAt));
  return rows.map(toTourPackage);
}

/** Published tours only — for public-facing pages */
export async function getPublishedTourPackages(): Promise<TourPackage[]> {
  const rows = await getDb()
    .select()
    .from(tourPackages)
    .where(eq(tourPackages.published, true))
    .orderBy(asc(tourPackages.sortOrder), asc(tourPackages.createdAt));
  return rows.map(toTourPackage);
}

/** Single tour by slug — returns null if not found */
export async function getTourPackageBySlug(slug: string): Promise<TourPackage | null> {
  const rows = await getDb()
    .select()
    .from(tourPackages)
    .where(eq(tourPackages.slug, slug))
    .limit(1);
  return rows[0] ? toTourPackage(rows[0]) : null;
}

/** Published tours filtered to a specific slug list (preserves DB sort order) */
export async function getTourPackagesBySlugs(slugs: string[]): Promise<TourPackage[]> {
  if (slugs.length === 0) return [];
  const rows = await getDb()
    .select()
    .from(tourPackages)
    .where(inArray(tourPackages.slug, slugs))
    .orderBy(asc(tourPackages.sortOrder), asc(tourPackages.createdAt));
  return rows.map(toTourPackage);
}

export async function createTourPackage(data: TourPackageInput): Promise<TourPackage> {
  const result = await getDb().insert(tourPackages).values(data).returning();
  return toTourPackage(result[0]);
}

export async function updateTourPackage(
  slug: string,
  data: Partial<TourPackageInput>,
): Promise<TourPackage | null> {
  const result = await getDb()
    .update(tourPackages)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tourPackages.slug, slug))
    .returning();
  return result[0] ? toTourPackage(result[0]) : null;
}

export async function deleteTourPackage(slug: string): Promise<void> {
  await getDb().delete(tourPackages).where(eq(tourPackages.slug, slug));
}
