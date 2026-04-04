"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { TourFaqItem } from "@/lib/types/tours-cms-types";

type Props = {
  data: TourFaqItem[];
  saving: boolean;
  onSave: (d: TourFaqItem[]) => Promise<void>;
};

/** CRUD editor for Tours FAQ accordion items. */
export function AdminToursFaqTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<TourFaqItem[]>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const update = (idx: number, field: keyof TourFaqItem, value: string) =>
    setLocal((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );

  const addItem = () =>
    setLocal((prev) => [
      ...prev,
      { id: Date.now(), question: "", answer: "" },
    ]);

  const removeItem = (idx: number) =>
    setLocal((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">{local.length} câu hỏi</p>
        <Button variant="outline" size="sm" onClick={addItem} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mới
        </Button>
      </div>

      {local.length === 0 && (
        <p className="text-center py-10 text-sm text-[var(--color-muted-foreground)]">
          Chưa có câu hỏi nào. Trang sẽ hiển thị nội dung mặc định.
        </p>
      )}

      <div className="space-y-4">
        {local.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                Câu hỏi #{idx + 1}
              </span>
              <button
                onClick={() => removeItem(idx)}
                className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Xóa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <FormField label="Câu hỏi" htmlFor={`faq-q-${idx}`}>
              <input
                id={`faq-q-${idx}`}
                className={inputStyles}
                value={item.question}
                onChange={(e) => update(idx, "question", e.target.value)}
                placeholder="How do I book a tour?"
              />
            </FormField>

            <FormField label="Câu trả lời" htmlFor={`faq-a-${idx}`}>
              <textarea
                id={`faq-a-${idx}`}
                rows={4}
                className={inputStyles}
                value={item.answer}
                onChange={(e) => update(idx, "answer", e.target.value)}
                placeholder="Câu trả lời chi tiết..."
              />
            </FormField>
          </div>
        ))}
      </div>

      {local.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={() => onSave(local)} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      )}
    </div>
  );
}
