"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionKey } from "@/hooks/use-admin-homepage";

type Props = {
  tab: SectionKey;
  items: Record<string, unknown>[];
  loading: boolean;
  saving: boolean;
  onAdd: () => void;
  onEdit: (item: Record<string, unknown>) => void;
  onDelete: (item: Record<string, unknown>) => void;
};

/** Generic items table for array-based homepage sections (tours/services/reviews/videos). */
export function AdminHomepageItemsTab({ tab, items, loading, saving, onAdd, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {loading ? "Đang tải..." : `${items.length} mục`}
        </p>
        <Button onClick={onAdd} disabled={loading || saving}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mới
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Chưa có dữ liệu</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Ảnh</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Thông tin</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--color-muted-foreground)]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <ItemRow
                  key={item.id as number}
                  tab={tab}
                  item={item}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function ItemRow({ tab, item, onEdit, onDelete }: {
  tab: SectionKey;
  item: Record<string, unknown>;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const imgSrc = (item.image ?? item.photo ?? item.avatar ?? "") as string;
  const label = getLabel(tab, item);
  const sub = getSubLabel(tab, item);

  return (
    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/40 transition-colors">
      <td className="px-4 py-3 w-16">
        {imgSrc ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--color-border)] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgSrc} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[var(--color-muted)] shrink-0" />
        )}
      </td>
      <td className="px-4 py-3">
        <p className="font-medium text-[var(--color-foreground)] line-clamp-1">{label}</p>
        {sub && <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{sub}</p>}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}
            className="text-red-500 hover:text-red-600 hover:border-red-200">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function getLabel(tab: SectionKey, item: Record<string, unknown>): string {
  switch (tab) {
    case "tours": return (item.title ?? "—") as string;
    case "services": return (item.name ?? "—") as string;
    case "reviews": return (item.name ?? "—") as string;
    case "videos": return (item.label ?? "—") as string;
    case "experience": return (item.title ?? "—") as string;
  }
}

function getSubLabel(tab: SectionKey, item: Record<string, unknown>): string {
  switch (tab) {
    case "tours": return `$${item.price} · ${item.duration} · ${(item.tags as string[] ?? []).join(", ")}`;
    case "services": return (item.price ?? "") as string;
    case "reviews": return `${item.date} · "${String(item.title ?? "").slice(0, 40)}"`;
    case "videos": return (item.url ?? item.stagger ?? "") as string;
    case "experience": return `${item.price} · ${(item.tags as string[] ?? []).join(", ")}`;
  }
}
