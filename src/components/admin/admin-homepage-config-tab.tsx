"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTION_LABELS } from "@/lib/constants/homepage-section-defaults";
import type { SectionConfig } from "@/lib/types/homepage-cms-types";

type Props = {
  config: SectionConfig[];
  saving: boolean;
  onSave: (config: SectionConfig[]) => Promise<void>;
};

/** Section ordering + visibility toggle UI for the homepage config tab. */
export function AdminHomepageConfigTab({ config, saving, onSave }: Props) {
  const [local, setLocal] = useState<SectionConfig[]>(() =>
    [...config].sort((a, b) => a.order - b.order)
  );
  const initialized = useRef(false);

  /* Sync from parent once when real data loads from DB */
  useEffect(() => {
    if (initialized.current) return;
    if (config.length > 0) {
      setLocal([...config].sort((a, b) => a.order - b.order));
      initialized.current = true;
    }
  }, [config]);

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...local];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    // Swap order values
    const tmpOrder = next[idx].order;
    next[idx] = { ...next[idx], order: next[swapIdx].order };
    next[swapIdx] = { ...next[swapIdx], order: tmpOrder };
    // Re-sort by order
    next.sort((a, b) => a.order - b.order);
    setLocal(next);
  };

  const toggleVisible = (idx: number) => {
    setLocal((prev) =>
      prev.map((s, i) => i === idx ? { ...s, visible: !s.visible } : s)
    );
  };

  const setTitle = (idx: number, title: string) => {
    setLocal((prev) =>
      prev.map((s, i) => i === idx ? { ...s, title: title || undefined } : s)
    );
  };

  const handleSave = async () => {
    await onSave(local);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-muted-foreground)]">
        Sắp xếp thứ tự và bật/tắt hiển thị các section trên trang chủ.
      </p>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Thứ tự</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Section</th>
              <th className="px-4 py-3 text-center font-medium text-[var(--color-muted-foreground)]">Hiển thị</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Tiêu đề tuỳ chỉnh</th>
            </tr>
          </thead>
          <tbody>
            {local.map((section, idx) => (
              <tr
                key={section.key}
                className={`border-b border-[var(--color-border)] last:border-0 transition-colors ${
                  section.visible ? "hover:bg-[var(--color-muted)]/40" : "opacity-50 bg-[var(--color-muted)]/20"
                }`}
              >
                {/* Order controls */}
                <td className="px-4 py-3 w-24">
                  <div className="flex gap-1">
                    <button
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-[var(--color-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Lên"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => move(idx, 1)}
                      disabled={idx === local.length - 1}
                      className="p-1 rounded hover:bg-[var(--color-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Xuống"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                {/* Label */}
                <td className="px-4 py-3 font-medium text-[var(--color-foreground)]">
                  {SECTION_LABELS[section.key]}
                </td>
                {/* Visibility toggle */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleVisible(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      section.visible
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    {section.visible ? "Bật" : "Tắt"}
                  </button>
                </td>
                {/* Custom title */}
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={section.title ?? ""}
                    onChange={(e) => setTitle(idx, e.target.value)}
                    placeholder={SECTION_LABELS[section.key]}
                    className="w-full px-2 py-1 text-sm rounded border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu cấu hình"}
        </Button>
      </div>
    </div>
  );
}
