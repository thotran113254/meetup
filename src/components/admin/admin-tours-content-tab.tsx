"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { ToursPageContent } from "@/lib/types/tours-cms-types";

type Props = {
  data: ToursPageContent;
  saving: boolean;
  onSave: (d: ToursPageContent) => Promise<void>;
};

/** Editor for Tours page intro title and description. */
export function AdminToursContentTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<ToursPageContent>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.introTitle || data.introDescription) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const set = <K extends keyof ToursPageContent>(key: K, val: ToursPageContent[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <FormField label="Tieu de gioi thieu" htmlFor="tc-introTitle">
        <input
          id="tc-introTitle"
          className={inputStyles}
          value={local.introTitle}
          onChange={(e) => set("introTitle", e.target.value)}
        />
      </FormField>

      <FormField label="Mo ta gioi thieu" htmlFor="tc-introDesc">
        <textarea
          id="tc-introDesc"
          rows={5}
          className={inputStyles}
          value={local.introDescription}
          onChange={(e) => set("introDescription", e.target.value)}
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
