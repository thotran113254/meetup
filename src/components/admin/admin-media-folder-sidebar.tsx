"use client";

import { useState } from "react";
import { FolderOpen, Folder, Images, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import type { FolderInfo } from "@/hooks/use-admin-media";

type Props = {
  folders: FolderInfo[];
  rootCount: number;
  totalCount: number;
  active?: string;
  onSelect: (folder?: string) => void;
  onCreateFolder?: (name: string) => void;
  onRenameFolder?: (oldName: string, newName: string) => void;
  onDeleteFolder?: (name: string) => void;
};

/** Folder sidebar for media library */
export function AdminMediaFolderSidebar({
  folders, rootCount, totalCount, active,
  onSelect, onCreateFolder, onRenameFolder, onDeleteFolder,
}: Props) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = () => {
    const trimmed = newName.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    if (trimmed && onCreateFolder) {
      onCreateFolder(trimmed);
      setNewName("");
      setCreating(false);
    }
  };

  const handleRename = (oldName: string) => {
    const trimmed = editName.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    if (trimmed && trimmed !== oldName && onRenameFolder) {
      onRenameFolder(oldName, trimmed);
    }
    setEditing(null);
  };

  return (
    <nav className="space-y-0.5">
      <SidebarItem icon={<Images className="h-4 w-4" />} label="Tất cả" count={totalCount}
        active={active === undefined} onClick={() => onSelect(undefined)} />

      {folders.map((f) => (
        editing === f.name ? (
          <div key={f.name} className="flex items-center gap-1 px-2 py-1">
            <input value={editName} onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename(f.name)}
              className="flex-1 min-w-0 text-xs px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-background)]"
              autoFocus />
            <button onClick={() => handleRename(f.name)} className="p-1 text-green-500 hover:bg-green-50 rounded">
              <Check className="h-3 w-3" />
            </button>
            <button onClick={() => setEditing(null)} className="p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] rounded">
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div key={f.name} className="group flex items-center">
            <button onClick={() => onSelect(f.name)}
              className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                active === f.name ? "bg-[var(--color-primary)] text-white font-medium" : "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
              }`}>
              <Folder className="h-4 w-4" />
              <span className="flex-1 text-left truncate">{f.name}</span>
              <span className={`text-xs tabular-nums ${active === f.name ? "text-white/80" : "text-[var(--color-muted-foreground)]"}`}>{f.count}</span>
            </button>
            <div className="hidden group-hover:flex items-center shrink-0">
              <button onClick={() => { setEditing(f.name); setEditName(f.name); }}
                className="p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded" title="Đổi tên">
                <Pencil className="h-3 w-3" />
              </button>
              <button onClick={() => onDeleteFolder?.(f.name)}
                className="p-1 text-red-400 hover:text-red-600 rounded" title="Xóa folder">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        )
      ))}

      {rootCount > 0 && (
        <SidebarItem icon={<FolderOpen className="h-4 w-4" />} label="Chưa phân loại" count={rootCount}
          active={active === "root"} onClick={() => onSelect("root")} />
      )}

      {/* Create new folder */}
      {creating ? (
        <div className="flex items-center gap-1 px-2 py-1">
          <input value={newName} onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="ten-folder"
            className="flex-1 min-w-0 text-xs px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-background)]"
            autoFocus />
          <button onClick={handleCreate} className="p-1 text-green-500 hover:bg-green-50 rounded">
            <Check className="h-3 w-3" />
          </button>
          <button onClick={() => { setCreating(false); setNewName(""); }} className="p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] rounded">
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button onClick={() => setCreating(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors">
          <Plus className="h-3.5 w-3.5" /> Thêm folder
        </button>
      )}
    </nav>
  );
}

function SidebarItem({ icon, label, count, active, onClick }: {
  icon: React.ReactNode; label: string; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
        active ? "bg-[var(--color-primary)] text-white font-medium" : "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
      }`}>
      {icon}
      <span className="flex-1 text-left truncate">{label}</span>
      <span className={`text-xs tabular-nums ${active ? "text-white/80" : "text-[var(--color-muted-foreground)]"}`}>{count}</span>
    </button>
  );
}
