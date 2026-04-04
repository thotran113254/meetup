"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import type { ServiceItem } from "@/components/sections/homepage/services-carousel";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData: (ServiceItem & { id: number }) | null;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  saving: boolean;
};

export function AdminHomepageServiceDialog({ open, onOpenChange, initialData, onSave, saving }: Props) {
  const { register, handleSubmit, reset, watch, setValue } = useForm<ServiceItem>();

  useEffect(() => {
    if (open) reset(initialData ?? { id: 0, name: "", price: "$0", image: "", slug: "" });
  }, [open, initialData, reset]);

  const onSubmit = async (d: ServiceItem) => {
    await onSave({ ...d, id: initialData?.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa dịch vụ" : "Thêm dịch vụ"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Tên dịch vụ" htmlFor="sv-name" required>
            <input id="sv-name" className={inputStyles} {...register("name", { required: true })} />
          </FormField>
          <AdminImageField
            value={watch("image") || ""}
            onChange={(url) => setValue("image", url)}
            label="Ảnh dịch vụ"
            alt={watch("name")}
            folder="services"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Giá (vd: $30)" htmlFor="sv-price" required>
              <input id="sv-price" className={inputStyles} placeholder="$30" {...register("price", { required: true })} />
            </FormField>
            <FormField label="Slug" htmlFor="sv-slug">
              <input id="sv-slug" className={inputStyles} placeholder="fast-track" {...register("slug")} />
            </FormField>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Hủy</Button>
            <Button type="submit" disabled={saving}>{saving ? "Đang lưu..." : initialData ? "Cập nhật" : "Thêm"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
