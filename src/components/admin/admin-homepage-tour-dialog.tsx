"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import type { TourCardProps } from "@/components/ui/tour-card";

type TourFormData = Omit<TourCardProps, "tags"> & { tagsRaw: string };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData: (TourCardProps & { id: number }) | null;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  saving: boolean;
};

/** Dialog for adding/editing a tour package in the homepage CMS. */
export function AdminHomepageTourDialog({ open, onOpenChange, initialData, onSave, saving }: Props) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TourFormData>();

  useEffect(() => {
    if (open) {
      reset(initialData
        ? { ...initialData, tagsRaw: initialData.tags.join(", ") }
        : { image: "", title: "", price: 0, duration: "1D", spots: 10, slug: "", tagsRaw: "" }
      );
    }
  }, [open, initialData, reset]);

  const onSubmit = async (d: TourFormData) => {
    const { tagsRaw, ...rest } = d;
    await onSave({
      ...rest,
      id: initialData?.id,
      price: Number(d.price),
      spots: Number(d.spots),
      tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa tour" : "Thêm tour mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Tiêu đề tour" htmlFor="t-title" required error={errors.title?.message}>
            <input id="t-title" className={inputStyles} {...register("title", { required: "Bắt buộc" })} />
          </FormField>
          <AdminImageField
            value={watch("image") || ""}
            onChange={(url) => setValue("image", url)}
            label="Ảnh tour"
            alt={watch("title")}
            folder="tours"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Giá (USD)" htmlFor="t-price" required>
              <input id="t-price" type="number" min={0} className={inputStyles} {...register("price", { required: true, valueAsNumber: true })} />
            </FormField>
            <FormField label="Thời gian (vd: 4D3N)" htmlFor="t-dur" required>
              <input id="t-dur" className={inputStyles} placeholder="1D / 4D3N" {...register("duration", { required: true })} />
            </FormField>
            <FormField label="Số chỗ còn" htmlFor="t-spots">
              <input id="t-spots" type="number" min={0} className={inputStyles} {...register("spots", { valueAsNumber: true })} />
            </FormField>
            <FormField label="Slug (URL)" htmlFor="t-slug" required>
              <input id="t-slug" className={inputStyles} placeholder="ten-tour" {...register("slug", { required: true })} />
            </FormField>
          </div>
          <FormField label="Tags (phân cách bằng dấu phẩy)" htmlFor="t-tags">
            <input id="t-tags" className={inputStyles} placeholder="Adventure, Solo, Beach" {...register("tagsRaw")} />
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
