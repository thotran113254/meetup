"use client";

import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminContactFaqCategoryRow } from "@/components/admin/admin-contact-faq-category-row";
import type { ContactFaqCategory } from "@/lib/types/contact-cms-types";

type Props = {
  data: ContactFaqCategory[];
  saving: boolean;
  onSave: (items: ContactFaqCategory[]) => Promise<void>;
};

/** Inline CRUD editor for Contact FAQ categories + nested questions. */
export function AdminContactFaqTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<ContactFaqCategory[]>(data);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const toggleExpand = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const addCategory = () => {
    const newCat: ContactFaqCategory = { id: Date.now(), title: "", questions: [], fullWidth: false };
    setLocal((prev) => [...prev, newCat]);
    setExpanded((prev) => new Set([...prev, newCat.id]));
  };

  const removeCategory = (id: number) =>
    setLocal((prev) => prev.filter((c) => c.id !== id));

  const updateField = <K extends keyof ContactFaqCategory>(
    id: number, field: K, val: ContactFaqCategory[K]
  ) => setLocal((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: val } : c)));

  const addQuestion = (catId: number) =>
    setLocal((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, questions: [...c.questions, ""] } : c))
    );

  const updateQuestion = (catId: number, qIdx: number, val: string) =>
    setLocal((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, questions: c.questions.map((q, i) => (i === qIdx ? val : q)) }
          : c
      )
    );

  const removeQuestion = (catId: number, qIdx: number) =>
    setLocal((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, questions: c.questions.filter((_, i) => i !== qIdx) } : c
      )
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">{local.length} danh muc</p>
        <Button size="sm" variant="outline" onClick={addCategory} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Them danh muc
        </Button>
      </div>

      {local.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">
          Chua co danh muc FAQ nao
        </p>
      )}

      <div className="space-y-3">
        {local.map((cat, idx) => (
          <AdminContactFaqCategoryRow
            key={cat.id}
            category={cat}
            index={idx}
            isOpen={expanded.has(cat.id)}
            onToggle={() => toggleExpand(cat.id)}
            onRemove={() => removeCategory(cat.id)}
            onUpdateField={(field, val) => updateField(cat.id, field, val)}
            onAddQuestion={() => addQuestion(cat.id)}
            onUpdateQuestion={(qIdx, val) => updateQuestion(cat.id, qIdx, val)}
            onRemoveQuestion={(qIdx) => removeQuestion(cat.id, qIdx)}
          />
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
