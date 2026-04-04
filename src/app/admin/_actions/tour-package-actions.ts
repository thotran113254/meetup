"use server";

import { revalidatePath } from "next/cache";
import {
  getAllTourPackages,
  getTourPackageBySlug,
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
} from "@/db/queries/tour-packages-queries";
import type { TourPackage, TourPackageInput } from "@/lib/types/tours-cms-types";

export async function fetchAllTourPackagesAction(): Promise<TourPackage[]> {
  return getAllTourPackages();
}

export async function fetchTourPackageBySlugAction(slug: string): Promise<TourPackage | null> {
  return getTourPackageBySlug(slug);
}

export async function createTourPackageAction(
  data: TourPackageInput,
): Promise<{ data?: TourPackage; error?: string }> {
  if (!data.slug || !data.title) return { error: "Slug và tiêu đề không được trống" };
  try {
    const result = await createTourPackage(data);
    revalidatePath("/tours");
    revalidatePath("/", "layout");
    return { data: result };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("unique")) return { error: "Slug đã tồn tại, vui lòng dùng slug khác" };
    return { error: "Lỗi khi tạo tour" };
  }
}

export async function updateTourPackageAction(
  slug: string,
  data: Partial<TourPackageInput>,
): Promise<{ data?: TourPackage; error?: string }> {
  try {
    const result = await updateTourPackage(slug, data);
    if (!result) return { error: "Không tìm thấy tour" };
    revalidatePath("/tours");
    revalidatePath("/", "layout");
    return { data: result };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("unique")) return { error: "Slug đã tồn tại" };
    return { error: "Lỗi khi cập nhật tour" };
  }
}

export async function deleteTourPackageAction(slug: string): Promise<{ error?: string }> {
  try {
    await deleteTourPackage(slug);
    revalidatePath("/tours");
    revalidatePath("/", "layout");
    return {};
  } catch {
    return { error: "Lỗi khi xóa tour" };
  }
}
