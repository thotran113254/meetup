"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { AboutCoreValue } from "@/lib/types/about-cms-types";

type Props = {
  data: AboutCoreValue[];
  saving: boolean;
  onSave: (items: AboutCoreValue[]) => Promise<void>;
};

/** Inline CRUD list editor for About page core values. */
export function AdminAboutValuesTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<AboutCoreValue[]>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const add = () =>
    setLocal((prev) => [...prev, { id: Date.now(), title: "", desc: "" }]);

  const remove = (id: number) =>
    setLocal((prev) => prev.filter((v) => v.id !== id));

  const update = (id: number, field: keyof AboutCoreValue, val: string) =>
    setLocal((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {local.length} giá trị
        </p>
        <Button size="sm" variant="outline" onClick={add} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mới
        </Button>
      </div>

      {local.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">
          Chưa có giá trị nào
        </p>
      )}

      <div className="space-y-4">
        {local.map((value, idx) => (
          <div
            key={value.id}
            className="p-4 rounded-lg border border-[var(--color-border)] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
                Giá trị #{idx + 1}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => remove(value.id)}
                className="text-red-500 hover:text-red-600 hover:border-red-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <FormField label="Tiêu đề" htmlFor={`cv-title-${value.id}`}>
              <input
                id={`cv-title-${value.id}`}
                className={inputStyles}
                value={value.title}
                onChange={(e) => update(value.id, "title", e.target.value)}
              />
            </FormField>

            <FormField label="Mô tả" htmlFor={`cv-desc-${value.id}`}>
              <textarea
                id={`cv-desc-${value.id}`}
                rows={3}
                className={inputStyles}
                value={value.desc}
                onChange={(e) => update(value.id, "desc", e.target.value)}
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
