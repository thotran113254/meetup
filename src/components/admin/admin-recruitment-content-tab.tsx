"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { RecruitmentPageContent } from "@/lib/types/recruitment-cms-types";

type Props = {
  data: RecruitmentPageContent;
  saving: boolean;
  onSave: (d: RecruitmentPageContent) => Promise<void>;
};

/** Editor for Recruitment page section headings and descriptions. */
export function AdminRecruitmentContentTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<RecruitmentPageContent>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.heading || data.subheading || data.connectTitle) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const set = <K extends keyof RecruitmentPageContent>(
    key: K,
    val: RecruitmentPageContent[K]
  ) => setLocal((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <FormField label="Tieu de danh sach viec lam" htmlFor="rc-heading">
        <input
          id="rc-heading"
          className={inputStyles}
          value={local.heading}
          onChange={(e) => set("heading", e.target.value)}
          placeholder="Current openings"
        />
      </FormField>

      <FormField label="Mo ta danh sach viec lam" htmlFor="rc-subheading">
        <textarea
          id="rc-subheading"
          rows={3}
          className={inputStyles}
          value={local.subheading}
          onChange={(e) => set("subheading", e.target.value)}
        />
      </FormField>

      <FormField label="Tieu de 'Connect with us'" htmlFor="rc-connectTitle">
        <input
          id="rc-connectTitle"
          className={inputStyles}
          value={local.connectTitle}
          onChange={(e) => set("connectTitle", e.target.value)}
          placeholder="Connect with us"
        />
      </FormField>

      <FormField label="Mo ta 'Connect with us'" htmlFor="rc-connectDesc">
        <textarea
          id="rc-connectDesc"
          rows={3}
          className={inputStyles}
          value={local.connectDescription}
          onChange={(e) => set("connectDescription", e.target.value)}
        />
      </FormField>

      <FormField label="Tieu de 'Join our Team'" htmlFor="rc-joinTitle">
        <input
          id="rc-joinTitle"
          className={inputStyles}
          value={local.joinTitle}
          onChange={(e) => set("joinTitle", e.target.value)}
          placeholder="Join our Team"
        />
      </FormField>

      <FormField label="Mo ta 'Join our Team'" htmlFor="rc-joinDesc">
        <textarea
          id="rc-joinDesc"
          rows={3}
          className={inputStyles}
          value={local.joinDescription}
          onChange={(e) => set("joinDescription", e.target.value)}
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
