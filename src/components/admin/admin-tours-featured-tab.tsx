"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminTourPickerList } from "@/components/admin/admin-tour-picker-list";
import type { MostLikedContent, TourPackage } from "@/lib/types/tours-cms-types";

type Props = {
  data: MostLikedContent;
  availableTours: TourPackage[];
  saving: boolean;
  onSave: (d: MostLikedContent) => Promise<void>;
};

/**
 * Editor for "Most Liked Package" section.
 * Admin sets section title and picks which tours to feature via checkbox list.
 */
export function AdminToursFeaturedTab({ data, availableTours, saving, onSave }: Props) {
  const [local, setLocal] = useState<MostLikedContent>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.sectionTitle || data.tourSlugs.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  return (
    <div className="space-y-5">
      <FormField label="Tiêu đề section" htmlFor="mf-section-title">
        <input
          id="mf-section-title"
          className={inputStyles}
          value={local.sectionTitle}
          onChange={(e) => setLocal((p) => ({ ...p, sectionTitle: e.target.value }))}
          placeholder="Most Liked Package"
        />
      </FormField>

      <div>
        <p className="text-sm font-medium mb-2">
          Chọn tour nổi bật{" "}
          <span className="text-[var(--color-muted-foreground)] font-normal">
            ({local.tourSlugs.length} đã chọn · không chọn = 2 tour đầu tiên)
          </span>
        </p>
        <AdminTourPickerList
          availableTours={availableTours}
          selectedSlugs={local.tourSlugs}
          onChange={(slugs) => setLocal((p) => ({ ...p, tourSlugs: slugs }))}
          emptyLabel="Chưa chọn tour nào — trang sẽ hiển thị 2 tour đầu tiên đã xuất bản."
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
}
