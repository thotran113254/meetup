"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { DestinationItem } from "@/lib/types/destinations-cms-types";

type Props = {
  data: DestinationItem[];
  saving: boolean;
  onSave: (d: DestinationItem[]) => Promise<void>;
};

/** CRUD editor for the destinations grid list. */
export function AdminDestinationsListTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<DestinationItem[]>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const update = (idx: number, field: keyof DestinationItem, value: string) =>
    setLocal((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );

  const addItem = () =>
    setLocal((prev) => [
      ...prev,
      { id: Date.now(), name: "", slug: "", image: "", description: "" },
    ]);

  const removeItem = (idx: number) =>
    setLocal((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">{local.length} diem den</p>
        <Button variant="outline" size="sm" onClick={addItem} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Them moi
        </Button>
      </div>

      {local.length === 0 && (
        <p className="text-center py-10 text-sm text-[var(--color-muted-foreground)]">
          Chua co diem den nao
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
                Diem den #{idx + 1}
              </span>
              <button
                onClick={() => removeItem(idx)}
                className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Xoa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Ten diem den" htmlFor={`dest-name-${idx}`}>
                <input
                  id={`dest-name-${idx}`}
                  className={inputStyles}
                  value={item.name}
                  onChange={(e) => update(idx, "name", e.target.value)}
                  placeholder="Hanoi"
                />
              </FormField>

              <FormField label="Slug (URL)" htmlFor={`dest-slug-${idx}`}>
                <input
                  id={`dest-slug-${idx}`}
                  className={inputStyles}
                  value={item.slug}
                  onChange={(e) => update(idx, "slug", e.target.value)}
                  placeholder="hanoi"
                />
              </FormField>

              <FormField label="URL anh" htmlFor={`dest-img-${idx}`} className="sm:col-span-2">
                <input
                  id={`dest-img-${idx}`}
                  className={inputStyles}
                  value={item.image}
                  onChange={(e) => update(idx, "image", e.target.value)}
                  placeholder="/images/destinations/hanoi.jpg"
                />
              </FormField>

              <FormField label="Mo ta" htmlFor={`dest-desc-${idx}`} className="sm:col-span-2">
                <textarea
                  id={`dest-desc-${idx}`}
                  rows={3}
                  className={inputStyles}
                  value={item.description}
                  onChange={(e) => update(idx, "description", e.target.value)}
                  placeholder="Mo ta ve diem den..."
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      {local.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={() => onSave(local)} disabled={saving}>
            {saving ? "Dang luu..." : "Luu"}
          </Button>
        </div>
      )}
    </div>
  );
}
