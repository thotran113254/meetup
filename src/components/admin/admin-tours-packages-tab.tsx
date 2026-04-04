"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminTourPickerList } from "@/components/admin/admin-tour-picker-list";
import type { TourPackageGridContent, TourPackage } from "@/lib/types/tours-cms-types";

type Props = {
  data: TourPackageGridContent;
  availableTours: TourPackage[];
  saving: boolean;
  onSave: (d: TourPackageGridContent) => Promise<void>;
};

/**
 * Editor for Tour Package Grid section.
 * Admin sets section title and picks which tours to show.
 * Empty selection = show all published tours.
 */
export function AdminToursPackagesTab({ data, availableTours, saving, onSave }: Props) {
  const [local, setLocal] = useState<TourPackageGridContent>(data);
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
      <FormField label="Tiêu đề section" htmlFor="pkg-section-title">
        <input
          id="pkg-section-title"
          className={inputStyles}
          value={local.sectionTitle}
          onChange={(e) => setLocal((p) => ({ ...p, sectionTitle: e.target.value }))}
          placeholder="Tour package"
        />
      </FormField>

      <div>
        <p className="text-sm font-medium mb-2">
          Chọn tour hiển thị trong lưới{" "}
          <span className="text-[var(--color-muted-foreground)] font-normal">
            ({local.tourSlugs.length} đã chọn · không chọn = hiển thị tất cả đã xuất bản)
          </span>
        </p>
        <AdminTourPickerList
          availableTours={availableTours}
          selectedSlugs={local.tourSlugs}
          onChange={(slugs) => setLocal((p) => ({ ...p, tourSlugs: slugs }))}
          emptyLabel="Chưa chọn tour cụ thể — trang sẽ hiển thị tất cả tour đã xuất bản."
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
