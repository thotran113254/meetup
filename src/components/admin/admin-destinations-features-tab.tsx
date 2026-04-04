"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import type { DestinationFeatureItem } from "@/lib/types/destinations-cms-types";

type Props = {
  data: DestinationFeatureItem[];
  saving: boolean;
  onSave: (d: DestinationFeatureItem[]) => Promise<void>;
};

/** CRUD editor for destination feature cards (icon, title, description). */
export function AdminDestinationsFeaturesTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<DestinationFeatureItem[]>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const update = (idx: number, field: keyof DestinationFeatureItem, value: string) =>
    setLocal((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );

  const addItem = () =>
    setLocal((prev) => [
      ...prev,
      { id: Date.now(), icon: "", title: "", description: "" },
    ]);

  const removeItem = (idx: number) =>
    setLocal((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">{local.length} đặc điểm</p>
        <Button variant="outline" size="sm" onClick={addItem} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mới
        </Button>
      </div>

      {local.length === 0 && (
        <p className="text-center py-10 text-sm text-[var(--color-muted-foreground)]">
          Chưa có đặc điểm nào. Trang sẽ hiển thị giá trị mặc định.
        </p>
      )}

      <div className="space-y-4">
        {local.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                Đặc điểm #{idx + 1}
              </span>
              <button
                onClick={() => removeItem(idx)}
                className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Xóa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminImageField
                value={item.icon}
                onChange={(url) => update(idx, "icon", url)}
                label="URL icon (SVG)"
                alt={item.title}
                placeholder="/images/destinations/icon-itinerary.svg"
                folder="destinations"
              />

              <FormField label="Tiêu đề" htmlFor={`feat-title-${idx}`}>
                <input
                  id={`feat-title-${idx}`}
                  className={inputStyles}
                  value={item.title}
                  onChange={(e) => update(idx, "title", e.target.value)}
                  placeholder="Customized Itineraries"
                />
              </FormField>

              <FormField label="Mô tả" htmlFor={`feat-desc-${idx}`} className="sm:col-span-2">
                <textarea
                  id={`feat-desc-${idx}`}
                  rows={3}
                  className={inputStyles}
                  value={item.description}
                  onChange={(e) => update(idx, "description", e.target.value)}
                  placeholder="Mô tả về đặc điểm..."
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      {local.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={() => onSave(local)} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      )}
    </div>
  );
}
