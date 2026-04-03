"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { NewsletterData } from "@/lib/types/homepage-cms-types";

type Props = {
  newsletter: NewsletterData;
  saving: boolean;
  onSave: (data: NewsletterData) => Promise<void>;
};

/** Editor for the Newsletter section — title + description. */
export function AdminHomepageNewsletterTab({ newsletter, saving, onSave }: Props) {
  const [local, setLocal] = useState<NewsletterData>(newsletter);

  useEffect(() => { setLocal(newsletter); }, [newsletter]);

  return (
    <div className="space-y-4 max-w-lg">
      <FormField label="Tiêu đề" htmlFor="nl-title">
        <input
          id="nl-title"
          className={inputStyles}
          value={local.title}
          onChange={(e) => setLocal((p) => ({ ...p, title: e.target.value }))}
        />
      </FormField>
      <FormField label="Mô tả" htmlFor="nl-desc">
        <textarea
          id="nl-desc"
          rows={4}
          className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          value={local.description}
          onChange={(e) => setLocal((p) => ({ ...p, description: e.target.value }))}
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
