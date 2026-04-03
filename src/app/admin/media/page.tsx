"use client";

import { useState } from "react";
import { Plus, Trash2, FileText, Film, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminMediaUploadDialog } from "@/components/admin/admin-media-upload-dialog";
import { useAdminMedia } from "@/hooks/use-admin-media";
import type { MediaRow } from "@/app/admin/_actions/media-actions";

const TYPE_FILTERS = [
  { value: undefined, label: "Tất cả" },
  { value: "image", label: "Hình ảnh" },
  { value: "video", label: "Video" },
  { value: "document", label: "Tài liệu" },
];

function MediaTypeIcon({ type }: { type: string }) {
  if (type === "video") return <Film className="h-6 w-6 text-[var(--color-muted-foreground)]" />;
  if (type === "document") return <FileText className="h-6 w-6 text-[var(--color-muted-foreground)]" />;
  return <Image className="h-6 w-6 text-[var(--color-muted-foreground)]" />;
}

function formatBytes(bytes?: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const { items, pagination, loading, typeFilter, setPage, filterByType, addMedia, removeMedia } =
    useAdminMedia(1, 20);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (data: unknown) => {
    setSaving(true);
    const result = await addMedia(data);
    setSaving(false);
    if (!result.error) setUploadOpen(false);
    return result;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await removeMedia(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Thư viện Media</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{pagination.total} file</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Plus className="h-4 w-4" />
          Thêm media
        </Button>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {TYPE_FILTERS.map(({ value, label }) => (
          <Button
            key={label}
            variant={typeFilter === value ? "default" : "outline"}
            size="sm"
            onClick={() => filterByType(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Chưa có media nào</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden"
              >
                {/* Preview */}
                <div className="aspect-square flex items-center justify-center bg-[var(--color-muted)]">
                  {item.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.alt ?? item.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <MediaTypeIcon type={item.type} />
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="text-xs font-medium line-clamp-1 text-[var(--color-foreground)]">{item.filename}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{formatBytes(item.size)}</p>
                </div>

                {/* Delete button overlay */}
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white shadow"
                  title="Xóa"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <AdminPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <AdminMediaUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSave={handleSave}
        saving={saving}
      />

      <AdminConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa media"
        description={`Xóa file "${deleteTarget?.filename}"?`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
