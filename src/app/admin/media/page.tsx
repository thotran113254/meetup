"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, FileText, Film, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminMediaUploadDialog } from "@/components/admin/admin-media-upload-dialog";
import { AdminMediaFolderSidebar } from "@/components/admin/admin-media-folder-sidebar";
import { AdminMediaDetailBar } from "@/components/admin/admin-media-detail-bar";
import { useAdminMedia } from "@/hooks/use-admin-media";
import { getMediaUsage, renameMediaFolder, deleteMediaFolder } from "@/app/admin/_actions/media-actions";
import type { MediaRow } from "@/app/admin/_actions/media-actions";

const TYPE_FILTERS = [
  { value: undefined, label: "Tất cả" },
  { value: "image", label: "Hình ảnh" },
  { value: "video", label: "Video" },
  { value: "document", label: "Tài liệu" },
];

function formatBytes(bytes?: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const {
    items, pagination, loading,
    typeFilter, folderFilter, folders, rootCount, totalCount,
    setPage, refresh, filterByType, filterByFolder,
    addItem, removeMedia,
  } = useAdminMedia(1, 48);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState<MediaRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteUsage, setDeleteUsage] = useState<{ total: number; details: string[] } | null>(null);
  // Track locally-created empty folders (not yet in DB)
  const [localFolders, setLocalFolders] = useState<string[]>([]);

  // Merge DB folders with locally-created empty ones
  const dbFolderNames = new Set(folders.map((f) => f.name));
  const mergedFolders = [
    ...folders,
    ...localFolders.filter((f) => !dbFolderNames.has(f)).map((f) => ({ name: f, count: 0 })),
  ];

  useEffect(() => {
    if (!deleteTarget) { setDeleteUsage(null); return; }
    getMediaUsage(deleteTarget.url).then(setDeleteUsage);
  }, [deleteTarget]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await removeMedia(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (selected?.id === deleteTarget.id) setSelected(null);
  };

  const sidebarActive = folderFilter === undefined ? undefined : folderFilter;
  const handleFolderSelect = (f?: string) => {
    if (f === "root") filterByFolder(null as unknown as string);
    else filterByFolder(f);
  };

  const handleCreateFolder = (name: string) => {
    setLocalFolders((prev) => prev.includes(name) ? prev : [...prev, name]);
    filterByFolder(name);
  };
  const handleRenameFolder = async (oldName: string, newName: string) => {
    await renameMediaFolder(oldName, newName);
    setLocalFolders((prev) => prev.map((f) => f === oldName ? newName : f));
    refresh();
    if (folderFilter === oldName) filterByFolder(newName);
  };
  const handleDeleteFolder = async (name: string) => {
    await deleteMediaFolder(name);
    setLocalFolders((prev) => prev.filter((f) => f !== name));
    refresh();
    if (folderFilter === name) filterByFolder(undefined);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mt-2">
      {/* Fixed header */}
      <div className="shrink-0 flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-xl font-bold">Thư viện Media</h1>
          <p className="text-xs text-[var(--color-muted-foreground)]">{pagination.total} file</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {TYPE_FILTERS.map(({ value, label }) => (
              <Button key={label} variant={typeFilter === value ? "default" : "outline"} size="sm"
                onClick={() => filterByType(value)} className="text-xs h-7 px-2.5">
                {label}
              </Button>
            ))}
          </div>
          <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")}
              className={`p-1.5 ${viewMode === "grid" ? "bg-[var(--color-primary)] text-white" : "hover:bg-[var(--color-muted)]"}`}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-1.5 ${viewMode === "list" ? "bg-[var(--color-primary)] text-white" : "hover:bg-[var(--color-muted)]"}`}>
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button size="sm" onClick={() => setUploadOpen(true)}>
            <Plus className="h-4 w-4" /> Tải lên
          </Button>
        </div>
      </div>

      {/* Body: fixed sidebar + scrollable content */}
      <div className="flex flex-1 overflow-hidden gap-4 pt-3">
        {/* Fixed sidebar */}
        <div className="w-44 shrink-0 overflow-y-auto">
          <AdminMediaFolderSidebar
            folders={mergedFolders}
            rootCount={rootCount}
            totalCount={totalCount}
            active={sidebarActive}
            onSelect={handleFolderSelect}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </div>

        {/* Scrollable media area */}
        <div className={`flex-1 overflow-y-auto min-w-0 pr-1 ${selected ? "pb-20" : ""}`}>
          {loading ? (
            <div className="py-16 text-center text-sm text-[var(--color-muted-foreground)]">Đang tải...</div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-sm text-[var(--color-muted-foreground)]">Chưa có media nào</div>
          ) : (
            <div className="space-y-3">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
                  {items.map((item) => (
                    <button key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)}
                      className={`group relative rounded overflow-hidden transition-all ${
                        selected?.id === item.id ? "ring-2 ring-[var(--color-primary)]" : "hover:ring-1 hover:ring-[var(--color-primary)]"
                      }`} title={`${item.filename} (${formatBytes(item.size)})`}>
                      <div className="aspect-square bg-[var(--color-muted)] flex items-center justify-center">
                        {item.type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt={item.alt ?? item.filename} className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : item.type === "video" ? (
                          <Film className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                        ) : (
                          <FileText className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                        )}
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }}
                        className="absolute top-0.5 right-0.5 hidden group-hover:flex items-center justify-center h-4 w-4 rounded-full bg-red-500/90 text-white cursor-pointer">
                        <Trash2 className="h-2 w-2" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="border border-[var(--color-border)] rounded-lg overflow-hidden divide-y divide-[var(--color-border)]">
                  {items.map((item) => (
                    <button key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)}
                      className={`group w-full flex items-center gap-3 px-3 py-1.5 text-left transition-colors ${
                        selected?.id === item.id ? "bg-[var(--color-primary)]/10" : "hover:bg-[var(--color-muted)]"
                      }`}>
                      <div className="h-8 w-8 rounded shrink-0 overflow-hidden bg-[var(--color-muted)] flex items-center justify-center">
                        {item.type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt="" className="h-full w-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : item.type === "video" ? <Film className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
                          : <FileText className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />}
                      </div>
                      <p className="flex-1 min-w-0 text-xs truncate">{item.filename}</p>
                      <span className="text-[10px] text-[var(--color-muted-foreground)] shrink-0">{formatBytes(item.size)}</span>
                      {item.width && item.height && (
                        <span className="text-[10px] text-[var(--color-muted-foreground)] shrink-0">{item.width}×{item.height}</span>
                      )}
                      {item.folder && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-muted)] text-[var(--color-muted-foreground)] shrink-0">{item.folder}</span>
                      )}
                      <div onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }}
                        className="shrink-0 hidden group-hover:flex items-center justify-center h-5 w-5 rounded-full hover:bg-red-100 text-red-500 cursor-pointer">
                        <Trash2 className="h-3 w-3" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <AdminPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Detail bar */}
      {selected && (
        <AdminMediaDetailBar
          item={selected}
          onDelete={() => setDeleteTarget(selected)}
          onClose={() => setSelected(null)}
          onReplaced={refresh}
        />
      )}

      {/* Dialogs */}
      <AdminMediaUploadDialog open={uploadOpen} onOpenChange={setUploadOpen}
        onUploaded={(uploaded) => addItem(uploaded)} folder={folderFilter} />
      <AdminConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteUsage && deleteUsage.total > 0 ? "Cảnh báo: Ảnh đang được sử dụng!" : "Xóa media"}
        description={deleteTarget
          ? deleteUsage && deleteUsage.total > 0
            ? `File "${deleteTarget.filename}" đang dùng ở ${deleteUsage.total} nơi: ${deleteUsage.details.join(", ")}. Xóa sẽ gây lỗi!`
            : `Xóa file "${deleteTarget.filename}"?`
          : ""}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
