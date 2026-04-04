"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import { slideSchema, type SlideData } from "@/lib/validations/slide-schema";
import type { SlideRow } from "@/app/admin/_actions/slides-actions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: SlideRow | null;
  onSave: (data: SlideData) => Promise<{ error?: string }>;
  saving: boolean;
};

export function AdminSlideDialog({ open, onOpenChange, initialData, onSave, saving }: Props) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<SlideData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(slideSchema) as any,
    defaultValues: { title: "", subtitle: "", image: "", link: "", sortOrder: 0, active: true },
  });

  const imageUrl = watch("image");

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? { title: initialData.title, subtitle: initialData.subtitle ?? "", image: initialData.image, link: initialData.link ?? "", sortOrder: initialData.sortOrder, active: initialData.active }
          : { title: "", subtitle: "", image: "", link: "", sortOrder: 0, active: true }
      );
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: SlideData) => {
    const result = await onSave(data);
    if (result.error) alert(result.error);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Chỉnh sửa slide" : "Thêm slide mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Tiêu đề" htmlFor="s-title" required error={errors.title?.message}>
            <input id="s-title" className={inputStyles} {...register("title")} />
          </FormField>
          <FormField label="Tiêu đề phụ" htmlFor="s-subtitle" error={errors.subtitle?.message}>
            <input id="s-subtitle" className={inputStyles} {...register("subtitle")} />
          </FormField>
          <AdminImageField
            value={imageUrl || ""}
            onChange={(url) => setValue("image", url)}
            label="Ảnh slide"
            alt={watch("title")}
            folder="slides"
          />
          <FormField label="URL liên kết" htmlFor="s-link" error={errors.link?.message}>
            <input id="s-link" className={inputStyles} placeholder="https://..." {...register("link")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Thứ tự" htmlFor="s-order" error={errors.sortOrder?.message}>
              <input id="s-order" type="number" min={0} className={inputStyles} {...register("sortOrder", { valueAsNumber: true })} />
            </FormField>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" className="rounded" {...register("active")} />
                Hiển thị
              </label>
            </div>
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
