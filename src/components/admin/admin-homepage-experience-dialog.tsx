"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { ExperienceTourItem } from "@/lib/types/homepage-cms-types";

type FormData = Omit<ExperienceTourItem, "tags"> & { tagsRaw: string };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData: ExperienceTourItem | null;
  onSave: (data: ExperienceTourItem) => Promise<void>;
  saving: boolean;
};

/** Dialog for adding/editing an experience tour item within a region. */
export function AdminHomepageExperienceDialog({ open, onOpenChange, initialData, onSave, saving }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (open) {
      reset(initialData
        ? { ...initialData, tagsRaw: initialData.tags.join(", ") }
        : { id: 0, title: "", price: "", tagsRaw: "" }
      );
    }
  }, [open, initialData, reset]);

  const onSubmit = async (d: FormData) => {
    const { tagsRaw, ...rest } = d;
    await onSave({
      ...rest,
      id: initialData?.id ?? Date.now(),
      tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa tour" : "Thêm tour mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Tiêu đề" htmlFor="exp-title" required error={errors.title?.message}>
            <input id="exp-title" className={inputStyles} {...register("title", { required: "Bắt buộc" })} />
          </FormField>
          <FormField label="Giá (vd: $299)" htmlFor="exp-price" required error={errors.price?.message}>
            <input id="exp-price" className={inputStyles} placeholder="$299" {...register("price", { required: "Bắt buộc" })} />
          </FormField>
          <FormField label="Tags (phân cách bằng dấu phẩy)" htmlFor="exp-tags">
            <input id="exp-tags" className={inputStyles} placeholder="Adventure, Culture" {...register("tagsRaw")} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Hủy</Button>
            <Button type="submit" disabled={saving}>{saving ? "Đang lưu..." : initialData ? "Cập nhật" : "Thêm"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
