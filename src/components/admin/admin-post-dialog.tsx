"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { postFormSchema, type PostFormData } from "@/lib/validations/post-schema";
import { cn } from "@/lib/utils";
import type { PostRow } from "@/app/admin/_actions/posts-actions";

const CATEGORIES = ["general", "technology", "design", "seo", "business", "news"];

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
    defaultValues: { title: "", slug: "", excerpt: "", content: "", category: "general", coverImage: "", metaTitle: "", metaDescription: "", published: false },
  });

  const titleValue = watch("title", "");

  useEffect(() => {
    if (open) {
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
        reset({ title: "", slug: "", excerpt: "", content: "", category: "general", coverImage: "", metaTitle: "", metaDescription: "", published: false });
      }
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <FormField label="Tóm tắt" htmlFor="excerpt" error={errors.excerpt?.message}>
            <textarea id="excerpt" rows={2} className={cn(inputStyles, "resize-none")} {...register("excerpt")} />
          </FormField>
          <FormField label="Nội dung" htmlFor="content" required error={errors.content?.message}>
            <textarea id="content" rows={6} className={cn(inputStyles, "resize-none font-mono text-xs")} {...register("content")} />
          </FormField>
          <FormField label="Ảnh bìa (URL)" htmlFor="coverImage" error={errors.coverImage?.message}>
            <input id="coverImage" className={inputStyles} placeholder="https://..." {...register("coverImage")} />
          </FormField>
          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" className="rounded" {...register("published")} />
            <label htmlFor="published" className="text-sm font-medium">Xuất bản ngay</label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Hủy</Button>
            <Button type="submit" disabled={saving}>{saving ? "Đang lưu..." : initialData ? "Cập nhật" : "Tạo mới"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
