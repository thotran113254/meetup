"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { AboutData } from "@/lib/types/homepage-cms-types";

type Props = {
  about: AboutData;
  saving: boolean;
  onSave: (data: AboutData) => Promise<void>;
};

const IMAGE_FIELDS: { key: keyof AboutData; label: string }[] = [
  { key: "desktopImage", label: "Ảnh Desktop" },
  { key: "teamImage", label: "Ảnh Team" },
  { key: "dragonImage", label: "Ảnh Rồng" },
  { key: "templeImage", label: "Ảnh Đền" },
  { key: "cloudImage", label: "Ảnh Mây" },
];

/** Editor for the About section — syncs from parent once on initial load only. */
export function AdminHomepageAboutTab({ about, saving, onSave }: Props) {
  const [local, setLocal] = useState<AboutData>(about);
  const initialized = useRef(false);

  /* Sync from parent only once when real data arrives */
  useEffect(() => {
    if (initialized.current) return;
    if (about.title || about.quote || about.desktopImage) {
      setLocal(about);
      initialized.current = true;
    }
  }, [about]);

  const set = <K extends keyof AboutData>(key: K, val: AboutData[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  const addPhoto = () =>
    set("mobilePhotos", [...local.mobilePhotos, { src: "", alt: "", deg: 0, left: "0%", top: "0%", stringH: 20 }]);

  const removePhoto = (idx: number) =>
    set("mobilePhotos", local.mobilePhotos.filter((_, i) => i !== idx));

  const setPhoto = (idx: number, field: string, val: string | number) =>
    set("mobilePhotos", local.mobilePhotos.map((p, i) => i === idx ? { ...p, [field]: val } : p));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <FormField label="Tiêu đề" htmlFor="ab-title">
          <input id="ab-title" className={inputStyles} value={local.title}
            onChange={(e) => set("title", e.target.value)} />
        </FormField>
        <FormField label="Câu trích dẫn (quote)" htmlFor="ab-quote">
          <textarea id="ab-quote" rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            value={local.quote} onChange={(e) => set("quote", e.target.value)} />
        </FormField>
      </div>

      {/* Image URL fields */}
      <div>
        <p className="text-sm font-medium mb-3">URL Ảnh</p>
        <div className="grid grid-cols-1 gap-3">
          {IMAGE_FIELDS.map(({ key, label }) => (
            <FormField key={key} label={label} htmlFor={`ab-${key}`}>
              <input id={`ab-${key}`} className={inputStyles} placeholder="/images/..."
                value={(local[key] as string) ?? ""}
                onChange={(e) => set(key, e.target.value as AboutData[typeof key])} />
            </FormField>
          ))}
        </div>
      </div>

      {/* Mobile photos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">Ảnh Mobile ({local.mobilePhotos.length})</p>
          <Button size="sm" variant="outline" onClick={addPhoto}>
            <Plus className="h-4 w-4 mr-1" /> Thêm ảnh
          </Button>
        </div>
        <div className="space-y-4">
          {local.mobilePhotos.map((photo, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-[var(--color-border)] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[var(--color-muted-foreground)]">Ảnh #{idx + 1}</span>
                <Button size="sm" variant="outline" onClick={() => removePhoto(idx)}
                  className="text-red-500 hover:text-red-600 hover:border-red-200">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="URL ảnh" htmlFor={`ph-src-${idx}`}>
                  <input id={`ph-src-${idx}`} className={inputStyles} value={photo.src}
                    onChange={(e) => setPhoto(idx, "src", e.target.value)} />
                </FormField>
                <FormField label="Alt text" htmlFor={`ph-alt-${idx}`}>
                  <input id={`ph-alt-${idx}`} className={inputStyles} value={photo.alt}
                    onChange={(e) => setPhoto(idx, "alt", e.target.value)} />
                </FormField>
                <FormField label="Góc xoay (deg)" htmlFor={`ph-deg-${idx}`}>
                  <input id={`ph-deg-${idx}`} type="number" className={inputStyles} value={photo.deg}
                    onChange={(e) => setPhoto(idx, "deg", Number(e.target.value))} />
                </FormField>
                <FormField label="Chiều cao (stringH)" htmlFor={`ph-sh-${idx}`}>
                  <input id={`ph-sh-${idx}`} type="number" className={inputStyles} value={photo.stringH}
                    onChange={(e) => setPhoto(idx, "stringH", Number(e.target.value))} />
                </FormField>
                <FormField label="Left (%)" htmlFor={`ph-left-${idx}`}>
                  <input id={`ph-left-${idx}`} className={inputStyles} value={photo.left}
                    onChange={(e) => setPhoto(idx, "left", e.target.value)} />
                </FormField>
                <FormField label="Top (%)" htmlFor={`ph-top-${idx}`}>
                  <input id={`ph-top-${idx}`} className={inputStyles} value={photo.top}
                    onChange={(e) => setPhoto(idx, "top", e.target.value)} />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
}
