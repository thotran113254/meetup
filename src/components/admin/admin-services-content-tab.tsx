"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { ServicesPageContent } from "@/lib/types/services-cms-types";

type Props = {
  data: ServicesPageContent;
  saving: boolean;
  onSave: (d: ServicesPageContent) => Promise<void>;
};

/** Editor for Services page section titles/descriptions. */
export function AdminServicesContentTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<ServicesPageContent>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.gridTitle || data.gridDescription || data.featuresTitle) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const set = <K extends keyof ServicesPageContent>(key: K, val: ServicesPageContent[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <FormField label="Tieu de luoi dich vu" htmlFor="sc-gridTitle">
        <input
          id="sc-gridTitle"
          className={inputStyles}
          value={local.gridTitle}
          onChange={(e) => set("gridTitle", e.target.value)}
        />
      </FormField>

      <FormField label="Mo ta luoi dich vu" htmlFor="sc-gridDesc">
        <textarea
          id="sc-gridDesc"
          rows={3}
          className={inputStyles}
          value={local.gridDescription}
          onChange={(e) => set("gridDescription", e.target.value)}
        />
      </FormField>

      <FormField label="Tieu de tinh nang" htmlFor="sc-featuresTitle">
        <input
          id="sc-featuresTitle"
          className={inputStyles}
          value={local.featuresTitle}
          onChange={(e) => set("featuresTitle", e.target.value)}
        />
      </FormField>

      <div className="flex justify-end">
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? "Dang luu..." : "Luu"}
        </Button>
      </div>
    </div>
  );
}
