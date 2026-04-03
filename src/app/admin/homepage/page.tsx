"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminHomepageTourDialog } from "@/components/admin/admin-homepage-tour-dialog";
import { AdminHomepageServiceDialog } from "@/components/admin/admin-homepage-service-dialog";
import { AdminHomepageReviewDialog } from "@/components/admin/admin-homepage-review-dialog";
import { AdminHomepageVideoDialog } from "@/components/admin/admin-homepage-video-dialog";
import { useAdminHomepage, type SectionKey } from "@/hooks/use-admin-homepage";
import type { TourCardProps } from "@/components/ui/tour-card";
import type { ServiceItem } from "@/components/sections/homepage/services-carousel";
import type { ReviewItem } from "@/components/sections/homepage/reviews-carousel";
import type { VideoItem } from "@/components/sections/homepage/youtube-grid";

const TABS: { key: SectionKey; label: string }[] = [
  { key: "tours", label: "Tour Packages" },
  { key: "services", label: "Dịch vụ" },
  { key: "reviews", label: "Đánh giá" },
  { key: "videos", label: "YouTube" },
];

export default function AdminHomepagePage() {
  const { data, loading, saving, addItem, editItem, removeItem } = useAdminHomepage();
  const [tab, setTab] = useState<SectionKey>("tours");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null);
  const [editTarget, setEditTarget] = useState<Record<string, unknown> | null>(null);

  const openAdd = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (item: Record<string, unknown>) => { setEditTarget(item); setDialogOpen(true); };
  const isSaving = saving === tab;

  const handleSave = async (item: Record<string, unknown>) => {
    if (editTarget) await editItem(tab, item);
    else await addItem(tab, item);
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeItem(tab, deleteTarget.id);
    setDeleteTarget(null);
  };

  const items = data[tab] as Array<Record<string, unknown>>;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nội dung Homepage</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Quản lý các section hiển thị trên trang chủ
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.key
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            }`}
          >
            {t.label} {!loading && `(${data[t.key].length})`}
          </button>
        ))}
      </div>

      {/* List header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {loading ? "Đang tải..." : `${items.length} mục`}
        </p>
        <Button onClick={openAdd} disabled={loading || isSaving}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mới
        </Button>
      </div>

      {/* Items table */}
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
                  onEdit={() => openEdit(item)}
                  onDelete={() => setDeleteTarget({ id: item.id as number, label: getLabel(tab, item) })}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Dialogs */}
      {tab === "tours" && (
        <AdminHomepageTourDialog
          open={dialogOpen} onOpenChange={setDialogOpen}
          initialData={editTarget as (TourCardProps & { id: number }) | null}
          onSave={handleSave} saving={isSaving}
        />
      )}
      {tab === "services" && (
        <AdminHomepageServiceDialog
          open={dialogOpen} onOpenChange={setDialogOpen}
          initialData={editTarget as (ServiceItem & { id: number }) | null}
          onSave={handleSave} saving={isSaving}
        />
      )}
      {tab === "reviews" && (
        <AdminHomepageReviewDialog
          open={dialogOpen} onOpenChange={setDialogOpen}
          initialData={editTarget as (ReviewItem & { id: number }) | null}
          onSave={handleSave} saving={isSaving}
        />
      )}
      {tab === "videos" && (
        <AdminHomepageVideoDialog
          open={dialogOpen} onOpenChange={setDialogOpen}
          initialData={editTarget as (VideoItem & { id: number }) | null}
          onSave={handleSave} saving={isSaving}
        />
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Xóa mục này?"
        description={`Bạn chắc chắn muốn xóa "${deleteTarget?.label}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}

/** Compact row showing thumbnail + key info for any section type */
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
          <Button variant="outline" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600 hover:border-red-200">
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
  }
}

function getSubLabel(tab: SectionKey, item: Record<string, unknown>): string {
  switch (tab) {
    case "tours": return `$${item.price} · ${item.duration} · ${(item.tags as string[] ?? []).join(", ")}`;
    case "services": return (item.price ?? "") as string;
    case "reviews": return `${item.date} · "${String(item.title ?? "").slice(0, 40)}"`;
    case "videos": return (item.url ?? item.stagger ?? "") as string;
  }
}
