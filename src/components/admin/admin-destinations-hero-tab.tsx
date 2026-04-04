"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import type { DestinationsHeroContent } from "@/lib/types/destinations-cms-types";

type Props = {
  data: DestinationsHeroContent;
  saving: boolean;
  onSave: (d: DestinationsHeroContent) => Promise<void>;
};

/** Editor for Destinations hero section: image, marquee text, breadcrumb. */
export function AdminDestinationsHeroTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<DestinationsHeroContent>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.heroImage || data.marqueeText) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const set = <K extends keyof DestinationsHeroContent>(key: K, val: DestinationsHeroContent[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <AdminImageField
        value={local.heroImage}
        onChange={(url) => set("heroImage", url)}
        label="Ảnh hero banner"
        folder="destinations"
      />

      <FormField label="Chữ chạy (marquee)" htmlFor="dh-marqueeText">
        <input
          id="dh-marqueeText"
          className={inputStyles}
          value={local.marqueeText}
          onChange={(e) => set("marqueeText", e.target.value)}
          placeholder="DESTINATION"
        />
      </FormField>

      <FormField label="Nhãn breadcrumb" htmlFor="dh-breadcrumbLabel">
        <input
          id="dh-breadcrumbLabel"
          className={inputStyles}
          value={local.breadcrumbLabel}
          onChange={(e) => set("breadcrumbLabel", e.target.value)}
          placeholder="Destination"
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
