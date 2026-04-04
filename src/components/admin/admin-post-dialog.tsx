"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { postFormSchema, type PostFormData } from "@/lib/validations/post-schema";
import { cn } from "@/lib/utils";
import type { PostRow } from "@/app/admin/_actions/posts-actions";
import { X } from "lucide-react";
import { AdminImageField } from "@/components/admin/admin-image-field";

const CATEGORIES = ["Trải nghiệm", "Điểm đến", "Ẩm thực", "Lịch sử", "Mẹo du lịch", "general"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: PostRow | null;
  onSave: (data: PostFormData) => Promise<{ error?: string }>;
  saving: boolean;
};

export function AdminPostDialog({ open, onOpenChange, initialData, onSave, saving }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(postFormSchema) as any,
    defaultValues: {
      title: "", slug: "", excerpt: "", content: "",
      category: "Trải nghiệm", coverImage: "",
      metaTitle: "", metaDescription: "", published: false,
    },
  });

  const titleValue = watch("title", "");

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      reset({
        title: initialData.title,
        slug: initialData.slug,
        excerpt: initialData.excerpt ?? "",
        content: initialData.content ?? "",
        category: initialData.category,
        coverImage: initialData.coverImage ?? "",
        metaTitle: initialData.metaTitle ?? "",
        metaDescription: initialData.metaDescription ?? "",
        published: initialData.published,
      });
    } else {
      reset({
        title: "", slug: "", excerpt: "", content: "",
        category: "Trải nghiệm", coverImage: "",
        metaTitle: "", metaDescription: "", published: false,
      });
    }
  }, [open, initialData, reset]);

  const handleTitleBlur = () => {
    if (!initialData && titleValue) setValue("slug", slugify(titleValue));
  };

  const onSubmit = async (data: PostFormData) => {
    const result = await onSave(data);
    if (result.error) alert(result.error);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* p-0 + flex flex-col enables sticky header/footer within fixed height */}
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">

        {/* ── Sticky header ─────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
            {initialData ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </h2>
          <DialogClose className="rounded-lg p-1 text-[var(--color-muted-foreground)] opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        {/* ── Scrollable body ───────────────────────────── */}
        <DialogBody>
          <form id="post-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Tiêu đề" htmlFor="title" required error={errors.title?.message}>
              {(() => {
                const { onBlur, ...rest } = register("title");
                return (
                  <input
                    id="title"
                    className={inputStyles}
                    onBlur={async (e) => { handleTitleBlur(); await onBlur(e); }}
                    {...rest}
                  />
                );
              })()}
            </FormField>

            <FormField label="Slug" htmlFor="slug" required error={errors.slug?.message}>
              <input id="slug" className={inputStyles} {...register("slug")} />
            </FormField>

            <FormField label="Danh mục" htmlFor="category" required error={errors.category?.message}>
              <select id="category" className={inputStyles} {...register("category")}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>

            <AdminImageField
              value={watch("coverImage") || ""}
              onChange={(url) => setValue("coverImage", url)}
              label="Ảnh bìa"
              alt={watch("title")}
              folder="blog"
            />

            <FormField label="Tóm tắt" htmlFor="excerpt" error={errors.excerpt?.message}>
              <textarea id="excerpt" rows={2} className={cn(inputStyles, "resize-none")} {...register("excerpt")} />
            </FormField>

            {/* Markdown content editor */}
            <FormField
              label="Nội dung (Markdown)"
              htmlFor="content"
              required
              error={errors.content?.message}
            >
              <p className="text-xs text-[var(--color-muted-foreground)] mb-1">
                Dùng <code className="bg-gray-100 px-1 rounded">## Tiêu đề</code> để tạo section cho mục lục •{" "}
                <code className="bg-gray-100 px-1 rounded">![alt](url)</code> để chèn ảnh •{" "}
                <code className="bg-gray-100 px-1 rounded">**đậm**</code> <code className="bg-gray-100 px-1 rounded">*nghiêng*</code>
              </p>
              <textarea
                id="content"
                rows={16}
                className={cn(inputStyles, "resize-y font-mono text-sm leading-relaxed")}
                placeholder={"## Giới thiệu\n\nNội dung đoạn đầu...\n\n## Section tiếp theo\n\nNội dung..."}
                {...register("content")}
              />
            </FormField>

            <details className="border rounded-lg p-3">
              <summary className="text-sm font-medium cursor-pointer select-none">SEO (tuỳ chọn)</summary>
              <div className="space-y-3 mt-3">
                <FormField label="Meta Title" htmlFor="metaTitle" error={errors.metaTitle?.message}>
                  <input id="metaTitle" className={inputStyles} placeholder="≤ 70 ký tự" {...register("metaTitle")} />
                </FormField>
                <FormField label="Meta Description" htmlFor="metaDescription" error={errors.metaDescription?.message}>
                  <textarea id="metaDescription" rows={2} className={cn(inputStyles, "resize-none")} placeholder="≤ 160 ký tự" {...register("metaDescription")} />
                </FormField>
              </div>
            </details>
          </form>
        </DialogBody>

        {/* ── Sticky footer ─────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" className="rounded" {...register("published")} />
            <label htmlFor="published" className="text-sm font-medium select-none">Xuất bản ngay</label>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Hủy</Button>
            <Button type="submit" form="post-form" disabled={saving}>
              {saving ? "Đang lưu..." : initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
