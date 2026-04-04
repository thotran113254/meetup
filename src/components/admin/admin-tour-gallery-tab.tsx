"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminImageField } from "@/components/admin/admin-image-field";

type Props = {
  gallery: string[];
  onChange: (gallery: string[]) => void;
};

/** Gallery tab — manage additional image URLs for the tour detail page slideshow */
export function AdminTourGalleryTab({ gallery, onChange }: Props) {
  const add = () => onChange([...gallery, ""]);
  const remove = (i: number) => onChange(gallery.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) => onChange(gallery.map((img, idx) => (idx === i ? val : img)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Ảnh gallery</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
            Hiển thị trong slider ảnh trên trang chi tiết tour. Ảnh bìa lấy từ tab Cơ bản.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="h-4 w-4 mr-1" /> Thêm ảnh
        </Button>
      </div>

      {gallery.length === 0 && (
        <p className="py-6 text-center text-sm text-[var(--color-muted-foreground)]">
          Chưa có ảnh gallery nào — trang chi tiết dùng ảnh bìa.
        </p>
      )}

      <div className="space-y-2">
        {gallery.map((img, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-xs text-[var(--color-muted-foreground)] w-5 shrink-0 mt-1">{i + 1}.</span>
            <div className="flex-1">
              <AdminImageField
                value={img}
                onChange={(url) => update(i, url)}
                label=""
                folder="tours"
              />
            </div>
            <Button size="sm" variant="outline" onClick={() => remove(i)}
              className="shrink-0 text-red-500 hover:text-red-600 hover:border-red-200 mt-1">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
