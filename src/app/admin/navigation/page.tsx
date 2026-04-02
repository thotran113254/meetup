"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminNavDialog } from "@/components/admin/admin-nav-dialog";
import { useAdminNavigation } from "@/hooks/use-admin-navigation";
import type { NavRow } from "@/app/admin/_actions/navigation-actions";

export default function AdminNavigationPage() {
  const { items, loading, addItem, editItem, removeItem } = useAdminNavigation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<NavRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NavRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (item: NavRow) => { setEditTarget(item); setDialogOpen(true); };

  const handleSave = async (data: unknown) => {
    setSaving(true);
    const result = editTarget ? await editItem(editTarget.id, data) : await addItem(data);
    setSaving(false);
    if (!result.error) setDialogOpen(false);
    return result;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await removeItem(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  // Group: top-level items with their children
  const topLevel = items.filter((n) => !n.parentId);
  const getChildren = (parentId: string) => items.filter((n) => n.parentId === parentId);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dieu huong</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{items.length} muc</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Them muc
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Dang tai...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Chua co muc dieu huong nao</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Nhan</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden sm:table-cell">Duong dan</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden md:table-cell">Thu tu</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Trang thai</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--color-muted-foreground)]">Thao tac</th>
              </tr>
            </thead>
            <tbody>
              {topLevel.map((item) => (
                <>
                  <NavRow key={item.id} item={item} onEdit={openEdit} onDelete={setDeleteTarget} indent={false} />
                  {getChildren(item.id).map((child) => (
                    <NavRow key={child.id} item={child} onEdit={openEdit} onDelete={setDeleteTarget} indent />
                  ))}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminNavDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editTarget}
        parentOptions={items}
        onSave={handleSave}
        saving={saving}
      />

      <AdminConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xoa muc dieu huong"
        description={`Xoa muc "${deleteTarget?.label}"? Cac muc con cung se mat lien ket cha.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}

function NavRow({
  item,
  onEdit,
  onDelete,
  indent,
}: {
  item: NavRow;
  onEdit: (item: NavRow) => void;
  onDelete: (item: NavRow) => void;
  indent: boolean;
}) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/50 transition-colors">
      <td className="px-4 py-3">
        <span className={indent ? "pl-5 text-[var(--color-muted-foreground)]" : "font-medium"}>
          {indent && "↳ "}{item.label}
        </span>
      </td>
      <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden sm:table-cell">
        <span className="flex items-center gap-1">
          {item.href}
          {item.isExternal && <ExternalLink className="h-3 w-3 shrink-0" />}
        </span>
      </td>
      <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden md:table-cell">{item.sortOrder}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.active ? "bg-green-100 text-green-700" : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"}`}>
          {item.active ? "Hien thi" : "An"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sua</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(item)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
