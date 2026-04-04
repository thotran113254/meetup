"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { uploadMediaFile } from "@/app/admin/_actions/media-upload-action";

type MediaRecord = {
  id: string;
  url: string;
  filename: string;
  alt: string | null;
  type: string;
  size: number | null;
  storagePath: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  folder: string | null;
  createdAt: Date;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after successful upload with the new media record */
  onUploaded?: (media: MediaRecord) => void;
  /** Pre-select folder for uploaded file */
  folder?: string;
};

export function AdminMediaUploadDialog({ open, onOpenChange, onUploaded, folder: defaultFolder }: Props) {
  const [alt, setAlt] = useState("");
  const [folder, setFolder] = useState(defaultFolder ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setAlt("");
    setFolder(defaultFolder ?? "");
    setError("");
    setPreview(null);
    setSelectedFile(null);
    setUploading(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Chỉ hỗ trợ file hình ảnh");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File quá lớn (tối đa 10MB)");
      return;
    }
    setError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("alt", alt || selectedFile.name.replace(/\.[^.]+$/, ""));
    if (folder) formData.append("folder", folder);

    const result = await uploadMediaFile(formData);

    if (result.error) {
      setError(result.error);
      setUploading(false);
    } else if (result.data) {
      onUploaded?.(result.data as MediaRecord);
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tải ảnh lên</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Drop zone / preview */}
          {preview ? (
            <div className="relative rounded-lg overflow-hidden border border-[var(--color-border)] h-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setSelectedFile(null); setPreview(null); }}
                className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded hover:bg-black/80"
              >
                Đổi ảnh
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 h-40 rounded-lg border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] cursor-pointer transition-colors"
            >
              <Upload className="h-8 w-8 text-[var(--color-muted-foreground)]" />
              <span className="text-sm text-[var(--color-muted-foreground)]">Kéo thả hoặc nhấp để chọn ảnh</span>
              <span className="text-xs text-[var(--color-muted-foreground)]">PNG, JPG, WebP, SVG — tối đa 10MB</span>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ""; }} />

          {/* Alt text for SEO slug */}
          <FormField label="Mô tả ảnh (dùng cho SEO)" htmlFor="mu-alt">
            <input id="mu-alt" className={inputStyles} value={alt} onChange={(e) => setAlt(e.target.value)}
              placeholder="VD: Tour Hạ Long Bay hoàng hôn" />
          </FormField>

          {/* Folder */}
          <FormField label="Thư mục" htmlFor="mu-folder">
            <input id="mu-folder" className={inputStyles} value={folder} onChange={(e) => setFolder(e.target.value)}
              placeholder="VD: tours, slides, about (để trống = gốc)" />
          </FormField>

          {error && <p className="text-xs text-[var(--color-destructive)]">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={uploading}>Hủy</Button>
            <Button onClick={handleUpload} disabled={uploading || !selectedFile}>
              {uploading ? <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Đang tải...</> : "Tải lên"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
