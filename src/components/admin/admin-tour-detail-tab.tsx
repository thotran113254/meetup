"use client";

import { FormField, inputStyles } from "@/components/ui/form-field";
import type { TourPackageInput } from "@/lib/types/tours-cms-types";

type Props = {
  form: TourPackageInput;
  onChange: <K extends keyof TourPackageInput>(key: K, value: TourPackageInput[K]) => void;
};

/** Detail fields tab: overview stats, places visited (shown on /tours/[slug] detail page) */
export function AdminTourDetailTab({ form, onChange }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-muted-foreground)]">
        Thông tin hiển thị trong phần "Overviews" và "Place visited" trên trang chi tiết tour.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Cỡ nhóm (Group size)" htmlFor="td-groupSize">
          <input id="td-groupSize" className={inputStyles} value={form.groupSize}
            onChange={(e) => onChange("groupSize", e.target.value)}
            placeholder="Min 2 - Max 24" />
        </FormField>
        <FormField label="Loại chuyến (Trip type)" htmlFor="td-tripType">
          <input id="td-tripType" className={inputStyles} value={form.tripType}
            onChange={(e) => onChange("tripType", e.target.value)}
            placeholder="Group Tours" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Phân khúc (Range)" htmlFor="td-range">
          <input id="td-range" className={inputStyles} value={form.rangeLabel}
            onChange={(e) => onChange("rangeLabel", e.target.value)}
            placeholder="Signature Journeys" />
        </FormField>
        <FormField label="Nhịp độ (Tour pace)" htmlFor="td-pace">
          <input id="td-pace" className={inputStyles} value={form.tourPace}
            onChange={(e) => onChange("tourPace", e.target.value)}
            placeholder="Medium" />
        </FormField>
      </div>

      <FormField label="Thể lực yêu cầu (Physical rating 1–5)" htmlFor="td-rating">
        <div className="flex items-center gap-3">
          <input id="td-rating" type="range" min={1} max={5} step={1}
            value={form.physicalRating}
            onChange={(e) => onChange("physicalRating", Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]" />
          <span className="text-sm font-bold w-6 text-center">{form.physicalRating}</span>
        </div>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
          1 = Rất dễ · 3 = Trung bình · 5 = Khó
        </p>
      </FormField>

      <FormField label="Địa điểm tham quan (cách nhau bằng dấu phẩy)" htmlFor="td-places">
        <input id="td-places" className={inputStyles}
          value={form.places.join(", ")}
          onChange={(e) => onChange("places", e.target.value.split(",").map((p) => p.trim()).filter(Boolean))}
          placeholder="Hanoi, Danang, Ho Chi Minh city" />
      </FormField>
    </div>
  );
}
