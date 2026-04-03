"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminPostDialog } from "@/components/admin/admin-post-dialog";
import { useAdminPosts } from "@/hooks/use-admin-posts";
import { formatDate } from "@/lib/utils";
import type { PostRow } from "@/app/admin/_actions/posts-actions";

const CATEGORIES = ["general", "technology", "design", "seo", "business", "news"];

export default function AdminPostsPage() {
  const { posts, pagination, loading, filterByPublished, filterByCategory, setPage, addPost, editPost, removePost } =
    useAdminPosts(1, 10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PostRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (post: PostRow) => { setEditTarget(post); setDialogOpen(true); };

  const handleSave = async (data: unknown) => {
    setSaving(true);
    const result = editTarget ? await editPost(editTarget.slug, data) : await addPost(data);
    setSaving(false);
    if (!result.error) setDialogOpen(false);
    return result;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await removePost(deleteTarget.slug);
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            {pagination.total} bài viết
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Thêm bài viết
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-sm"
          onChange={(e) => filterByPublished(e.target.value === "" ? undefined : e.target.value === "true")}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đã xuất bản</option>
          <option value="false">Bản nháp</option>
        </select>
        <select
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-sm"
          onChange={(e) => filterByCategory(e.target.value || undefined)}
        >
          <option value="">Tất cả danh mục</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Đang tải...</div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--color-muted-foreground)]">Chưa có bài viết nào</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Tiêu đề</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden sm:table-cell">Danh mục</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden md:table-cell">Ngày tạo</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-muted-foreground)]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium line-clamp-1">{post.title}</span>
                      <span className="text-xs text-[var(--color-muted-foreground)] block">/{post.slug}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden sm:table-cell capitalize">{post.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {post.published ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden md:table-cell">{formatDate(post.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(post)}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Sửa</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(post)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
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

      <AdminPostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editTarget}
        onSave={handleSave}
        saving={saving}
      />

      <AdminConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa bài viết"
        description={`Bạn chắc chắn muốn xóa "${deleteTarget?.title}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
