"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { postFormSchema, type PostFormData } from "@/lib/validations/post-schema";
import { cn } from "@/lib/utils";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const CATEGORIES = ["general", "technology", "design", "seo", "business", "news"];

export default function NewPostPage() {
  const [published, setPublished] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      coverImage: "",
      metaTitle: "",
      metaDescription: "",
      published: false,
    },
  });

  const titleValue = watch("title", "");

  function handleTitleBlur() {
    if (titleValue) setValue("slug", slugify(titleValue));
  }

  // TODO: Wire to a server action that calls post-queries.ts to insert into DB
  async function onSubmit(data: PostFormData) {
    console.log("Submit post:", { ...data, published });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Them bai viet moi</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Dien thong tin de tao bai viet moi
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title + Slug */}
        <FormField label="Tieu de" htmlFor="title" required error={errors.title}>
          <input
            id="title"
            className={inputStyles}
            placeholder="Tieu de bai viet..."
            {...register("title")}
            onBlur={handleTitleBlur}
          />
        </FormField>

        <FormField label="Slug (URL)" htmlFor="slug" required error={errors.slug}>
          <input
            id="slug"
            className={inputStyles}
            placeholder="tieu-de-bai-viet"
            {...register("slug")}
          />
        </FormField>

        {/* Excerpt */}
        <FormField label="Tom tat" htmlFor="excerpt" error={errors.excerpt}>
          <textarea
            id="excerpt"
            rows={2}
            className={cn(inputStyles, "resize-none")}
            placeholder="Mo ta ngan gon bai viet (toi da 500 ky tu)..."
            {...register("excerpt")}
          />
        </FormField>

        {/* Content */}
        <FormField label="Noi dung" htmlFor="content" required error={errors.content}>
          <textarea
            id="content"
            rows={8}
            className={cn(inputStyles, "resize-y")}
            placeholder="Viet noi dung bai viet tai day..."
            {...register("content")}
          />
        </FormField>

        {/* Category + Cover Image */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Danh muc" htmlFor="category" required error={errors.category}>
            <select id="category" className={inputStyles} {...register("category")}>
              <option value="">Chon danh muc</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Anh bia (URL)" htmlFor="coverImage" error={errors.coverImage}>
            <input
              id="coverImage"
              className={inputStyles}
              placeholder="https://..."
              {...register("coverImage")}
            />
          </FormField>
        </div>

        {/* SEO */}
        <div className="rounded-xl border border-[var(--color-border)] p-4 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide">
            SEO
          </h2>
          <FormField label="Meta Title" htmlFor="metaTitle" error={errors.metaTitle}>
            <input id="metaTitle" className={inputStyles} placeholder="(mac dinh dung tieu de bai viet)" {...register("metaTitle")} />
          </FormField>
          <FormField label="Meta Description" htmlFor="metaDescription" error={errors.metaDescription}>
            <textarea id="metaDescription" rows={2} className={cn(inputStyles, "resize-none")} placeholder="Mo ta SEO (toi da 160 ky tu)..." {...register("metaDescription")} />
          </FormField>
        </div>

        {/* Published toggle + Submit */}
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
              type="button"
              role="switch"
              aria-checked={published}
              onClick={() => { setPublished(!published); setValue("published", !published); }}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                published ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
              )}
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", published ? "translate-x-5" : "translate-x-0.5")} />
            </button>
            <span className="text-sm font-medium">
              {published ? "Xuat ban ngay" : "Luu ban nhap"}
            </span>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Dang luu..." : "Luu bai viet"}
          </Button>
        </div>
      </form>
    </div>
  );
}
