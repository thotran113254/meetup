"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { ContactPageInfo } from "@/lib/types/contact-cms-types";

type Props = {
  data: ContactPageInfo;
  saving: boolean;
  onSave: (d: ContactPageInfo) => Promise<void>;
};

/** Editor for Contact page info: title, timezone, operating hours. */
export function AdminContactInfoTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<ContactPageInfo>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.timezone || data.operatingHours || data.infoTitle) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const set = <K extends keyof ContactPageInfo>(key: K, val: ContactPageInfo[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <FormField label="Tieu de chinh (info title)" htmlFor="ci-infoTitle">
        <textarea
          id="ci-infoTitle"
          rows={2}
          className={inputStyles}
          value={local.infoTitle}
          onChange={(e) => set("infoTitle", e.target.value)}
        />
      </FormField>

      <FormField label="Mui gio (timezone)" htmlFor="ci-timezone">
        <input
          id="ci-timezone"
          className={inputStyles}
          value={local.timezone}
          onChange={(e) => set("timezone", e.target.value)}
          placeholder="Asia/Saigon, GMT+7"
        />
      </FormField>

      <FormField label="Gio hoat dong (operating hours)" htmlFor="ci-hours">
        <input
          id="ci-hours"
          className={inputStyles}
          value={local.operatingHours}
          onChange={(e) => set("operatingHours", e.target.value)}
          placeholder="Mon-Sun: 06:00 AM - 12:00 AM"
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
