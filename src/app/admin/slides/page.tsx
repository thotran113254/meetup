"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminSlideDialog } from "@/components/admin/admin-slide-dialog";
import { useAdminSlides } from "@/hooks/use-admin-slides";
import type { SlideRow } from "@/app/admin/_actions/slides-actions";

export default function AdminSlidesPage() {
  const { slides, loading, addSlide, editSlide, removeSlide } = useAdminSlides();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SlideRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SlideRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (slide: SlideRow) => { setEditTarget(slide); setDialogOpen(true); };

  const handleSave = async (data: unknown) => {
    setSaving(true);
    const result = editTarget ? await editSlide(editTarget.id, data) : await addSlide(data);
    setSaving(false);
    if (!result.error) setDialogOpen(false);
    return result;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await removeSlide(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quan ly Slides</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{slides.length} slide</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Them slide
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Dang tai...</div>
        ) : slides.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Chua co slide nao</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                <th className="px-4 py-3 w-8" />
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Anh / Tieu de</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden sm:table-cell">Thu tu</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Trang thai</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--color-muted-foreground)]">Thao tac</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr
                  key={slide.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/50 transition-colors"
                >
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)]">
                    <GripVertical className="h-4 w-4" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {slide.image && (
                        <div className="h-10 w-16 rounded overflow-hidden shrink-0 border border-[var(--color-border)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium line-clamp-1">{slide.title}</p>
                        {slide.subtitle && <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-1">{slide.subtitle}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden sm:table-cell">{slide.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${slide.active ? "bg-green-100 text-green-700" : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"}`}>
                      {slide.active ? "Hien thi" : "An"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(slide)}>
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Sua</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(slide)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminSlideDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editTarget}
        onSave={handleSave}
        saving={saving}
      />

      <AdminConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xoa slide"
        description={`Xoa slide "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
