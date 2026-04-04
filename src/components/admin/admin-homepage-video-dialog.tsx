"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import type { VideoItem } from "@/components/sections/homepage/youtube-grid";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData: (VideoItem & { id: number }) | null;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  saving: boolean;
};

export function AdminHomepageVideoDialog({ open, onOpenChange, initialData, onSave, saving }: Props) {
  const { register, handleSubmit, reset, watch, setValue } = useForm<VideoItem>();

  useEffect(() => {
    if (open) {
      reset(initialData ?? { id: 0, label: "", image: "", url: "", stagger: "mt-0", mobileStagger: "mt-0" });
    }
  }, [open, initialData, reset]);

  const onSubmit = async (d: VideoItem) => {
    await onSave({ ...d, id: initialData?.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa video" : "Thêm video"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nhãn hiển thị" htmlFor="vd-label" required>
            <input id="vd-label" className={inputStyles} placeholder="Our team" {...register("label", { required: true })} />
          </FormField>
          <AdminImageField
            value={watch("image") || ""}
            onChange={(url) => setValue("image", url)}
            label="Ảnh thumbnail"
            alt={watch("label")}
            folder="homepage"
          />
          <FormField label="URL YouTube (tùy chọn)" htmlFor="vd-url">
            <input id="vd-url" className={inputStyles} placeholder="https://youtube.com/watch?v=..." {...register("url")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Stagger desktop (mt-*)" htmlFor="vd-stg">
              <input id="vd-stg" className={inputStyles} placeholder="mt-0 / mt-5 / mt-10" {...register("stagger")} />
            </FormField>
            <FormField label="Stagger mobile (mt-*)" htmlFor="vd-mstg">
              <input id="vd-mstg" className={inputStyles} placeholder="mt-0 / mt-5" {...register("mobileStagger")} />
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
