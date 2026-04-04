"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Check, Trash2, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMediaUsage } from "@/app/admin/_actions/media-actions";
import { replaceMediaFile } from "@/app/admin/_actions/media-upload-action";
import type { MediaRow } from "@/app/admin/_actions/media-actions";

type Props = {
  item: MediaRow;
  onDelete: () => void;
  onClose: () => void;
  onReplaced?: () => void;
};

function formatBytes(bytes?: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Bottom bar showing selected media details, usage count, copy URL, replace, delete */
export function AdminMediaDetailBar({ item, onDelete, onClose, onReplaced }: Props) {
  const [copied, setCopied] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [usage, setUsage] = useState<{ total: number; details: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsage(null);
    getMediaUsage(item.url).then(setUsage);
  }, [item.url]);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !item.storagePath) return;

    setReplacing(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("existingUrl", item.url);
    const result = await replaceMediaFile(formData);
    setReplacing(false);

    if (!result.error) onReplaced?.();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)] shadow-lg">
      <div className="flex items-center gap-4 px-4 py-3 max-w-7xl mx-auto">
        {/* Thumbnail */}
        <div className="h-12 w-12 rounded-lg overflow-hidden bg-[var(--color-muted)] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{item.filename}</p>
          <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
            <span>{formatBytes(item.size)}</span>
            {item.width && item.height && <span>{item.width}×{item.height}</span>}
            {item.folder && <span className="px-1.5 py-0.5 rounded bg-[var(--color-muted)]">{item.folder}</span>}
            {usage === null ? (
              <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Đang kiểm tra...</span>
            ) : usage.total > 0 ? (
              <span className="text-amber-500 font-medium">Đang dùng: {usage.details.join(", ")}</span>
            ) : (
              <span className="text-green-500">Không sử dụng</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={copyUrl} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Đã copy" : "Copy URL"}
          </Button>
          {item.storagePath && (
            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}
              disabled={replacing} className="gap-1.5">
              {replacing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Thay ảnh
            </Button>
          )}
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> Xem
            </Button>
          </a>
          <Button size="sm" variant="outline" onClick={onDelete}
            className="gap-1.5 text-red-500 hover:text-red-600 hover:border-red-200">
            <Trash2 className="h-3.5 w-3.5" /> Xóa
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="text-xs">✕</Button>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleReplace} />
      </div>
    </div>
  );
}
