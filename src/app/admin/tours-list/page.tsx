"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminTourPackageDialog } from "@/components/admin/admin-tour-package-dialog";
import { useAdminTourPackages } from "@/hooks/use-admin-tour-packages";
import type { TourPackage, TourPackageInput } from "@/lib/types/tours-cms-types";

export default function AdminToursListPage() {
  const { tours, loading, saving, deleting, addTour, removeTour } = useAdminTourPackages();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TourPackage | null>(null);

  const handleCreate = async (data: TourPackageInput) => addTour(data);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeTour(deleteTarget.slug);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Tour</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            {tours.length} tour · Chọn tour hiển thị trong{" "}
            <a href="/admin/tours" className="underline text-[var(--color-primary)]">Trang Tours</a>
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Thêm tour
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Đang tải...</div>
        ) : tours.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">
            Chưa có tour nào.{" "}
            <button onClick={() => setDialogOpen(true)} className="underline text-[var(--color-primary)]">Thêm ngay</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Tour</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden sm:table-cell">Giá</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden md:table-cell">Thời gian</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden lg:table-cell">Tags</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Trạng thái</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--color-muted-foreground)]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium line-clamp-1">{tour.title}</span>
                    <span className="text-xs text-[var(--color-muted-foreground)] block">/{tour.slug}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell font-medium text-[var(--color-primary)]">${tour.price}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[var(--color-muted-foreground)]">{tour.duration}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {tour.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] bg-[var(--color-muted)] px-1.5 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      tour.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {tour.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {tour.published ? "Đã xuất bản" : "Bản nháp"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Sửa → full edit page with all fields */}
                      <Link href={`/admin/tours-list/${tour.slug}`}>
                        <Button variant="ghost" size="sm" asChild={false}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline ml-1">Sửa</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(tour)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50">
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

      {/* Create dialog — basic fields only; full edit via /admin/tours-list/[slug] */}
      <AdminTourPackageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleCreate}
        saving={saving}
      />

      <AdminConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa tour"
        description={`Bạn chắc chắn muốn xóa "${deleteTarget?.title}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
