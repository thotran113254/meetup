"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { DestinationsPageContent } from "@/lib/types/destinations-cms-types";

type Props = {
  data: DestinationsPageContent;
  saving: boolean;
  onSave: (d: DestinationsPageContent) => Promise<void>;
};

/** Editor for Destinations page intro + grid heading content fields. */
export function AdminDestinationsContentTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<DestinationsPageContent>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.introTitle || data.introCity || data.gridTitle) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const set = <K extends keyof DestinationsPageContent>(key: K, val: DestinationsPageContent[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <FormField label="Tieu de gioi thieu" htmlFor="dc-introTitle">
        <input
          id="dc-introTitle"
          className={inputStyles}
          value={local.introTitle}
          onChange={(e) => set("introTitle", e.target.value)}
          placeholder="Introduce about"
        />
      </FormField>

      <FormField label="Ten thanh pho (chu viet thu phap)" htmlFor="dc-introCity">
        <input
          id="dc-introCity"
          className={inputStyles}
          value={local.introCity}
          onChange={(e) => set("introCity", e.target.value)}
          placeholder="Hanoi"
        />
      </FormField>

      <FormField label="Mo ta gioi thieu" htmlFor="dc-introDesc">
        <textarea
          id="dc-introDesc"
          rows={5}
          className={inputStyles}
          value={local.introDescription}
          onChange={(e) => set("introDescription", e.target.value)}
          placeholder="Mo ta ve thanh pho..."
        />
      </FormField>

      <FormField label="Tieu de luoi diem den" htmlFor="dc-gridTitle">
        <input
          id="dc-gridTitle"
          className={inputStyles}
          value={local.gridTitle}
          onChange={(e) => set("gridTitle", e.target.value)}
          placeholder="Where is your favorite place?"
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
