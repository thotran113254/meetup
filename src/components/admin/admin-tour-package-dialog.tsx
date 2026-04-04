"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminTourBasicTab } from "@/components/admin/admin-tour-basic-tab";
import type { TourPackageInput } from "@/lib/types/tours-cms-types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TourPackageInput) => Promise<{ error?: string }>;
  saving: boolean;
};

const EMPTY: TourPackageInput = {
  slug: "", title: "", image: "", price: 0, duration: "", spots: 0, tags: [], flights: 0,
  description: "", category: "general", published: true, sortOrder: 0,
  gallery: [], groupSize: "", tripType: "", rangeLabel: "", tourPace: "",
  physicalRating: 1, places: [], itinerary: [], pricingOptions: [],
};

/**
 * Quick-create dialog — basic fields only.
 * For full editing (gallery, itinerary, pricing) go to /admin/tours-list/[slug].
 */
export function AdminTourPackageDialog({ open, onOpenChange, onSave, saving }: Props) {
  const [form, setForm] = useState<TourPackageInput>(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) { setForm(EMPTY); setError(""); }
  }, [open]);

  const onChange = <K extends keyof TourPackageInput>(key: K, value: TourPackageInput[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setError("");
    const result = await onSave(form);
    if (result.error) setError(result.error);
    else onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm tour mới</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[var(--color-muted-foreground)] -mt-2">
          Sau khi tạo, mở trang chỉnh sửa để thêm gallery, lịch trình và bảng giá.
        </p>

        <AdminTourBasicTab form={form} onChange={onChange} />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Hủy</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Đang tạo..." : "Tạo tour"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
