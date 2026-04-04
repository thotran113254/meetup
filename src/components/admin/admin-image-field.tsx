"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Link, Loader2, RefreshCw } from "lucide-react";
import { uploadMediaFile, replaceMediaFile } from "@/app/admin/_actions/media-upload-action";

type Props = {
  /** Current image URL */
  value: string;
  /** Called when image URL changes (after upload or manual input) */
  onChange: (url: string) => void;
  /** Label shown above the field */
  label?: string;
  /** Placeholder for URL input */
  placeholder?: string;
  /** Alt text suggestion — sent with upload for SEO filename generation */
  alt?: string;
  /** Folder to organize uploaded media (e.g. "tours", "slides", "about") */
  folder?: string;
};

/**
 * Admin image field with drag-drop upload, preview, and URL fallback.
 * Replaces plain text inputs for image URLs across admin panel.
 */
export function AdminImageField({
  value,
  onChange,
  label = "Hình ảnh",
  placeholder = "/images/example.jpg",
  alt = "",
  folder,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Chỉ hỗ trợ file hình ảnh");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File quá lớn (tối đa 10MB)");
        return;
      }

      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      // If current value is an uploaded media URL, replace in-place (keep URL)
      const isUploadedMedia = value.startsWith("/media/");
      if (isUploadedMedia) {
        formData.append("existingUrl", value);
        const result = await replaceMediaFile(formData);
        if (result.error) {
          setError(result.error);
        } else {
          // Force browser to refresh cached image by appending cache-buster
          onChange(value + "?v=" + Date.now());
          // Then set back to clean URL after a tick (so React sees the change)
          setTimeout(() => onChange(value), 100);
        }
      } else {
        formData.append("alt", alt || file.name.replace(/\.[^.]+$/, ""));
        if (folder) formData.append("folder", folder);
        const result = await uploadMediaFile(formData);
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          onChange(result.data.url);
        }
      }
      setUploading(false);
    },
    [alt, onChange, value]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
      // Reset input so re-selecting same file triggers change
      e.target.value = "";
    },
    [handleUpload]
  );

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium">{label}</label>
      )}

      {/* Preview + action bar */}
      {value && !uploading ? (
        <div className="rounded-lg overflow-hidden border border-[var(--color-border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={alt || "Preview"}
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "";
              (e.target as HTMLImageElement).alt = "Không tải được ảnh";
            }}
          />
          {/* Always-visible action bar */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[var(--color-muted)]/50 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              {value.startsWith("/media/") ? "Thay ảnh" : "Đổi ảnh"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-md text-red-500 bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-red-50 transition-colors"
            >
              <X className="h-3 w-3" /> Xóa
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 h-36 rounded-lg border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] cursor-pointer transition-colors bg-[var(--color-muted)]/30"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
              <span className="text-xs text-[var(--color-muted-foreground)]">Đang tải lên...</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-[var(--color-muted-foreground)]" />
              <span className="text-xs text-[var(--color-muted-foreground)]">
                Kéo thả hoặc nhấp để chọn ảnh
              </span>
              <span className="text-[10px] text-[var(--color-muted-foreground)]">
                PNG, JPG, WebP, SVG — tối đa 10MB
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* URL input toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <Link className="h-3 w-3" />
          {showUrlInput ? "Ẩn URL" : "Nhập URL"}
        </button>
      </div>

      {showUrlInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-ring)]"
        />
      )}

      {error && (
        <p className="text-xs text-[var(--color-destructive)]">{error}</p>
      )}
    </div>
  );
}
