"use client";

import { useState } from "react";
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { useAdminContacts } from "@/hooks/use-admin-contacts";
import { formatDate } from "@/lib/utils";
import type { ContactRow } from "@/app/admin/_actions/contacts-actions";

export default function AdminContactsPage() {
  const { contacts, pagination, loading, readFilter, setPage, filterByRead, toggleRead, remove } =
    useAdminContacts(1, 10);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleRead = async (id: string) => {
    setTogglingId(id);
    await toggleRead(id);
    setTogglingId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await remove(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Tin nhan lien he</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          {pagination.total} tong • {unreadCount > 0 && `${unreadCount} chua doc trang nay`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "unread", "read"] as const).map((f) => {
          const active = f === "all" ? readFilter === undefined : f === "unread" ? readFilter === false : readFilter === true;
          return (
            <Button
              key={f}
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => filterByRead(f === "all" ? undefined : f === "unread" ? false : true)}
            >
              {f === "all" ? "Tat ca" : f === "unread" ? "Chua doc" : "Da doc"}
            </Button>
          );
        })}
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Dang tai...</div>
        ) : contacts.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Khong co tin nhan nao</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Ho ten</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden md:table-cell">Dien thoai</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden lg:table-cell">Ngay gui</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Trang thai</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-muted-foreground)]">Thao tac</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <>
                    <tr
                      key={contact.id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-muted)]/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                    >
                      <td className="px-4 py-3">
                        <span className={contact.read ? "text-[var(--color-muted-foreground)]" : "font-semibold"}>
                          {contact.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden sm:table-cell">{contact.email}</td>
                      <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden md:table-cell">{contact.phone || "—"}</td>
                      <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden lg:table-cell">{formatDate(contact.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${contact.read ? "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]" : "bg-blue-100 text-blue-700"}`}>
                          {contact.read ? "Da doc" : "Chua doc"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleRead(contact.id)}
                            disabled={togglingId === contact.id}
                            title={contact.read ? "Danh dau chua doc" : "Danh dau da doc"}
                          >
                            {contact.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(contact)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          {expandedId === contact.id ? <ChevronUp className="h-4 w-4 text-[var(--color-muted-foreground)]" /> : <ChevronDown className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
                        </div>
                      </td>
                    </tr>
                    {expandedId === contact.id && (
                      <tr key={`${contact.id}-msg`} className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/30">
                        <td colSpan={6} className="px-6 py-4">
                          <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1">Noi dung:</p>
                          <p className="text-sm">{contact.message}</p>
                          <div className="mt-2 flex gap-4 text-xs text-[var(--color-muted-foreground)] sm:hidden">
                            <span>{contact.email}</span>
                            {contact.phone && <span>{contact.phone}</span>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            <AdminPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <AdminConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xoa tin nhan"
        description={`Xoa tin nhan tu "${deleteTarget?.name}"? Hanh dong nay khong the hoan tac.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
