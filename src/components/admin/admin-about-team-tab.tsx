"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { AboutTeamMember } from "@/lib/types/about-cms-types";

type Props = {
  data: AboutTeamMember[];
  saving: boolean;
  onSave: (items: AboutTeamMember[]) => Promise<void>;
};

/** Inline CRUD list editor for About page team members. */
export function AdminAboutTeamTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<AboutTeamMember[]>(data);
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
      { id: Date.now(), name: "", role: "", bio: "" },
    ]);

  const remove = (id: number) =>
    setLocal((prev) => prev.filter((m) => m.id !== id));

  const update = (id: number, field: keyof AboutTeamMember, val: string) =>
    setLocal((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {local.length} thành viên
        </p>
        <Button size="sm" variant="outline" onClick={add} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mới
        </Button>
      </div>

      {local.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">
          Chưa có thành viên nào
        </p>
      )}

      <div className="space-y-4">
        {local.map((member, idx) => (
          <div
            key={member.id}
            className="p-4 rounded-lg border border-[var(--color-border)] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
                Thành viên #{idx + 1}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => remove(member.id)}
                className="text-red-500 hover:text-red-600 hover:border-red-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Họ tên" htmlFor={`tm-name-${member.id}`}>
                <input
                  id={`tm-name-${member.id}`}
                  className={inputStyles}
                  value={member.name}
                  onChange={(e) => update(member.id, "name", e.target.value)}
                />
              </FormField>

              <FormField label="Vị trí" htmlFor={`tm-role-${member.id}`}>
                <input
                  id={`tm-role-${member.id}`}
                  className={inputStyles}
                  value={member.role}
                  onChange={(e) => update(member.id, "role", e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Tiểu sử (bio)" htmlFor={`tm-bio-${member.id}`}>
              <textarea
                id={`tm-bio-${member.id}`}
                rows={2}
                className={inputStyles}
                value={member.bio}
                onChange={(e) => update(member.id, "bio", e.target.value)}
              />
            </FormField>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
}
