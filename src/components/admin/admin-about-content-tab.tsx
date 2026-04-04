"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { AboutPageContent } from "@/lib/types/about-cms-types";

type Props = {
  data: AboutPageContent;
  saving: boolean;
  onSave: (d: AboutPageContent) => Promise<void>;
};

/** Editor for About page hero/mission/headings/CTA content fields. */
export function AdminAboutContentTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<AboutPageContent>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.heroTitle || data.heroDescription) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const set = <K extends keyof AboutPageContent>(key: K, val: AboutPageContent[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <FormField label="Tiêu đề hero" htmlFor="ac-heroTitle">
        <input
          id="ac-heroTitle"
          className={inputStyles}
          value={local.heroTitle}
          onChange={(e) => set("heroTitle", e.target.value)}
        />
      </FormField>

      <FormField label="Mô tả hero" htmlFor="ac-heroDesc">
        <textarea
          id="ac-heroDesc"
          rows={4}
          className={inputStyles}
          value={local.heroDescription}
          onChange={(e) => set("heroDescription", e.target.value)}
        />
      </FormField>

      <FormField label="Sứ mệnh (mission)" htmlFor="ac-mission">
        <textarea
          id="ac-mission"
          rows={3}
          className={inputStyles}
          value={local.mission}
          onChange={(e) => set("mission", e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Tiêu đề giá trị" htmlFor="ac-valuesHeading">
          <input
            id="ac-valuesHeading"
            className={inputStyles}
            value={local.valuesHeading}
            onChange={(e) => set("valuesHeading", e.target.value)}
          />
        </FormField>

        <FormField label="Tiêu đề đội ngũ" htmlFor="ac-teamHeading">
          <input
            id="ac-teamHeading"
            className={inputStyles}
            value={local.teamHeading}
            onChange={(e) => set("teamHeading", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Tiêu đề CTA" htmlFor="ac-ctaTitle">
        <input
          id="ac-ctaTitle"
          className={inputStyles}
          value={local.ctaTitle}
          onChange={(e) => set("ctaTitle", e.target.value)}
        />
      </FormField>

      <FormField label="Mô tả CTA" htmlFor="ac-ctaDesc">
        <textarea
          id="ac-ctaDesc"
          rows={2}
          className={inputStyles}
          value={local.ctaDescription}
          onChange={(e) => set("ctaDescription", e.target.value)}
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
