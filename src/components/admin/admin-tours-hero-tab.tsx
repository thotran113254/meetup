"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import type { ToursHeroContent } from "@/lib/types/tours-cms-types";

type Props = {
  data: ToursHeroContent;
  saving: boolean;
  onSave: (d: ToursHeroContent) => Promise<void>;
};

/** Editor for Tours hero section: image URL, marquee text, breadcrumb label. */
export function AdminToursHeroTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<ToursHeroContent>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.heroImage || data.marqueeText) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const set = <K extends keyof ToursHeroContent>(key: K, val: ToursHeroContent[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <AdminImageField
        value={local.heroImage}
        onChange={(url) => set("heroImage", url)}
        label="Ảnh hero banner"
        folder="tours"
      />

      <FormField label="Chữ chạy (marquee)" htmlFor="th-marqueeText">
        <input
          id="th-marqueeText"
          className={inputStyles}
          value={local.marqueeText}
          onChange={(e) => set("marqueeText", e.target.value)}
          placeholder="TOUR PACKAGES"
        />
      </FormField>

      <FormField label="Nhãn breadcrumb" htmlFor="th-breadcrumbLabel">
        <input
          id="th-breadcrumbLabel"
          className={inputStyles}
          value={local.breadcrumbLabel}
          onChange={(e) => set("breadcrumbLabel", e.target.value)}
          placeholder="Tour Packages"
        />
      </FormField>

      <div className="flex justify-end">
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
}
