"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import type { ServiceFeature } from "@/lib/types/services-cms-types";

type Props = {
  data: ServiceFeature[];
  saving: boolean;
  onSave: (d: ServiceFeature[]) => Promise<void>;
};

/** CRUD editor for the "Why Choose Us" features on the Services page. */
export function AdminServicesFeaturesTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<ServiceFeature[]>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const update = (idx: number, field: keyof ServiceFeature, value: string) =>
    setLocal((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );

  const addFeature = () =>
    setLocal((prev) => [
      ...prev,
      { id: Date.now(), featureId: "", icon: "", title: "", description: "" },
    ]);

  const removeFeature = (idx: number) =>
    setLocal((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">{local.length} tính năng</p>
        <Button variant="outline" size="sm" onClick={addFeature} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mới
        </Button>
      </div>

      {local.length === 0 && (
        <p className="text-center py-10 text-sm text-[var(--color-muted-foreground)]">
          Chưa có tính năng nào
        </p>
      )}

      <div className="space-y-4">
        {local.map((feature, idx) => (
          <div
            key={feature.id}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                Tính năng #{idx + 1}
              </span>
              <button
                onClick={() => removeFeature(idx)}
                className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Xóa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Feature ID" htmlFor={`feat-fid-${idx}`}>
                <input
                  id={`feat-fid-${idx}`}
                  className={inputStyles}
                  value={feature.featureId}
                  onChange={(e) => update(idx, "featureId", e.target.value)}
                  placeholder="customized"
                />
              </FormField>

              <FormField label="Tiêu đề" htmlFor={`feat-title-${idx}`}>
                <input
                  id={`feat-title-${idx}`}
                  className={inputStyles}
                  value={feature.title}
                  onChange={(e) => update(idx, "title", e.target.value)}
                  placeholder="Customized Itineraries"
                />
              </FormField>

              <div className="sm:col-span-2">
                <AdminImageField
                  value={feature.icon}
                  onChange={(url) => update(idx, "icon", url)}
                  label="URL icon"
                  alt={feature.title}
                  placeholder="/images/feature-customized-itinerary.svg"
                  folder="services"
                />
              </div>

              <FormField label="Mô tả" htmlFor={`feat-desc-${idx}`} className="sm:col-span-2">
                <textarea
                  id={`feat-desc-${idx}`}
                  rows={3}
                  className={inputStyles}
                  value={feature.description}
                  onChange={(e) => update(idx, "description", e.target.value)}
                  placeholder="Mô tả tính năng..."
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
