"use client";

import type { TourPackage } from "@/lib/types/tours-cms-types";

type Props = {
  availableTours: TourPackage[];
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
  emptyLabel?: string;
};

/**
 * Shared checkbox-list picker for selecting tours from the DB.
 * Used in both "Gói nổi bật" and "Danh sách tour" admin tabs.
 */
export function AdminTourPickerList({ availableTours, selectedSlugs, onChange, emptyLabel }: Props) {
  const toggle = (slug: string) => {
    onChange(
      selectedSlugs.includes(slug)
        ? selectedSlugs.filter((s) => s !== slug)
        : [...selectedSlugs, slug],
    );
  };

  if (availableTours.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-[var(--color-muted-foreground)]">
        Chưa có tour nào trong hệ thống.{" "}
        <a href="/admin/tours-list" className="underline text-[var(--color-primary)]">
          Thêm tour tại đây
        </a>
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {emptyLabel && selectedSlugs.length === 0 && (
        <p className="text-xs text-[var(--color-muted-foreground)] mb-3 italic">{emptyLabel}</p>
      )}
      {availableTours.map((tour) => {
        const checked = selectedSlugs.includes(tour.slug);
        return (
          <label
            key={tour.slug}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              checked
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                : "border-[var(--color-border)] hover:bg-[var(--color-muted)]/50"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(tour.slug)}
              className="mt-0.5 w-4 h-4 accent-[var(--color-primary)] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug truncate">{tour.title}</p>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                /{tour.slug} · ${tour.price} · {tour.duration}
                {!tour.published && (
                  <span className="ml-2 text-amber-600 font-medium">· Chưa xuất bản</span>
                )}
              </p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
