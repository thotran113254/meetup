"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { VietnamStat } from "@/lib/types/tours-cms-types";

type Props = {
  data: VietnamStat[];
  saving: boolean;
  onSave: (items: VietnamStat[]) => Promise<void>;
};

/** Inline CRUD list editor for Vietnam stats on the Tours page. */
export function AdminToursStatsTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<VietnamStat[]>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const add = () =>
    setLocal((prev) => [...prev, { id: Date.now(), value: "", description: "" }]);

  const remove = (id: number) =>
    setLocal((prev) => prev.filter((s) => s.id !== id));

  const update = (id: number, field: keyof VietnamStat, val: string) =>
    setLocal((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {local.length} chỉ số
        </p>
        <Button size="sm" variant="outline" onClick={add} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mới
        </Button>
      </div>

      {local.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">
          Chưa có chỉ số nào
        </p>
      )}

      <div className="space-y-4">
        {local.map((stat, idx) => (
          <div
            key={stat.id}
            className="p-4 rounded-lg border border-[var(--color-border)] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
                Chỉ số #{idx + 1}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => remove(stat.id)}
                className="text-red-500 hover:text-red-600 hover:border-red-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <FormField label="Gia tri (vd: 20 Million)" htmlFor={`st-value-${stat.id}`}>
              <input
                id={`st-value-${stat.id}`}
                className={inputStyles}
                value={stat.value}
                onChange={(e) => update(stat.id, "value", e.target.value)}
              />
            </FormField>

            <FormField label="Mô tả" htmlFor={`st-desc-${stat.id}`}>
              <textarea
                id={`st-desc-${stat.id}`}
                rows={2}
                className={inputStyles}
                value={stat.description}
                onChange={(e) => update(stat.id, "description", e.target.value)}
              />
            </FormField>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
}
