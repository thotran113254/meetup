"use client";

import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { ContactFaqCategory } from "@/lib/types/contact-cms-types";

type Props = {
  category: ContactFaqCategory;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdateField: <K extends keyof ContactFaqCategory>(field: K, val: ContactFaqCategory[K]) => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (qIdx: number, val: string) => void;
  onRemoveQuestion: (qIdx: number) => void;
};

/** Single expandable FAQ category row with nested question CRUD. */
export function AdminContactFaqCategoryRow({
  category,
  index,
  isOpen,
  onToggle,
  onRemove,
  onUpdateField,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
}: Props) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-muted)]/30">
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
        >
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <span className="text-xs font-medium text-[var(--color-muted-foreground)] shrink-0">
          #{index + 1}
        </span>
        <span className="flex-1 text-sm font-medium truncate">
          {category.title || "(Chua dat ten)"}
        </span>
        <span className="text-xs text-[var(--color-muted-foreground)] shrink-0">
          {category.questions.length} cau hoi
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={onRemove}
          className="text-red-500 hover:text-red-600 hover:border-red-200 shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Expanded body */}
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1">
              <FormField label="Ten danh muc" htmlFor={`faq-title-${category.id}`}>
                <input
                  id={`faq-title-${category.id}`}
                  className={inputStyles}
                  value={category.title}
                  onChange={(e) => onUpdateField("title", e.target.value)}
                  placeholder="Booking Tours"
                />
              </FormField>
            </div>
            <label className="flex items-center gap-2 text-sm mt-6 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={!!category.fullWidth}
                onChange={(e) => onUpdateField("fullWidth", e.target.checked)}
                className="rounded border-[var(--color-border)]"
              />
              Chiem toan bo chieu rong
            </label>
          </div>

          {/* Questions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wide">
                Cac cau hoi ({category.questions.length})
              </p>
              <Button size="sm" variant="outline" onClick={onAddQuestion}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Them cau hoi
              </Button>
            </div>

            {category.questions.length === 0 && (
              <p className="text-xs text-[var(--color-muted-foreground)] py-2 text-center">
                Chua co cau hoi nao
              </p>
            )}

            {category.questions.map((q, qIdx) => (
              <div key={qIdx} className="flex gap-2 items-start">
                <input
                  className={`${inputStyles} flex-1`}
                  value={q}
                  onChange={(e) => onUpdateQuestion(qIdx, e.target.value)}
                  placeholder={`Cau hoi ${qIdx + 1}`}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveQuestion(qIdx)}
                  className="text-red-500 hover:text-red-600 hover:border-red-200 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
