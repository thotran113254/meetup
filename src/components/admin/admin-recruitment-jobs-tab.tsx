"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { RecruitmentJob } from "@/lib/types/recruitment-cms-types";

type Props = {
  data: RecruitmentJob[];
  saving: boolean;
  onSave: (items: RecruitmentJob[]) => Promise<void>;
};

/** Inline CRUD list editor for Recruitment job postings. */
export function AdminRecruitmentJobsTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<RecruitmentJob[]>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const add = () =>
    setLocal((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        description: "",
        jdLink: "#",
        jdLabel: "View full job description",
      },
    ]);

  const remove = (id: number) =>
    setLocal((prev) => prev.filter((j) => j.id !== id));

  const update = (id: number, field: keyof RecruitmentJob, val: string) =>
    setLocal((prev) =>
      prev.map((j) => (j.id === id ? { ...j, [field]: val } : j))
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {local.length} vi tri tuyen dung
        </p>
        <Button size="sm" variant="outline" onClick={add} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Them vi tri
        </Button>
      </div>

      {local.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">
          Chua co vi tri tuyen dung nao
        </p>
      )}

      <div className="space-y-4">
        {local.map((job, idx) => (
          <div
            key={job.id}
            className="p-4 rounded-lg border border-[var(--color-border)] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
                Vi tri #{idx + 1}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => remove(job.id)}
                className="text-red-500 hover:text-red-600 hover:border-red-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <FormField label="Ten vi tri" htmlFor={`job-title-${job.id}`}>
              <input
                id={`job-title-${job.id}`}
                className={inputStyles}
                value={job.title}
                onChange={(e) => update(job.id, "title", e.target.value)}
                placeholder="SALE TOUR"
              />
            </FormField>

            <FormField label="Mo ta" htmlFor={`job-desc-${job.id}`}>
              <textarea
                id={`job-desc-${job.id}`}
                rows={3}
                className={inputStyles}
                value={job.description}
                onChange={(e) => update(job.id, "description", e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Link JD" htmlFor={`job-link-${job.id}`}>
                <input
                  id={`job-link-${job.id}`}
                  className={inputStyles}
                  value={job.jdLink}
                  onChange={(e) => update(job.id, "jdLink", e.target.value)}
                  placeholder="https://..."
                />
              </FormField>

              <FormField label="Nhan link JD" htmlFor={`job-label-${job.id}`}>
                <input
                  id={`job-label-${job.id}`}
                  className={inputStyles}
                  value={job.jdLabel}
                  onChange={(e) => update(job.id, "jdLabel", e.target.value)}
                  placeholder="View full job description"
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? "Dang luu..." : "Luu"}
        </Button>
      </div>
    </div>
  );
}
