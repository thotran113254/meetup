"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/components/sections/homepage/reviews-carousel";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData: (ReviewItem & { id: number }) | null;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  saving: boolean;
};

export function AdminHomepageReviewDialog({ open, onOpenChange, initialData, onSave, saving }: Props) {
  const { register, handleSubmit, reset } = useForm<ReviewItem>();

  useEffect(() => {
    if (open) {
      reset(initialData ?? {
        id: 0, name: "", date: "", title: "", body: "",
        photo: "/images/review-photo.jpg",
        avatar: "/images/review-avatar.jpg",
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = async (d: ReviewItem) => {
    await onSave({ ...d, id: initialData?.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa đánh giá" : "Thêm đánh giá"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tên khách hàng" htmlFor="rv-name" required>
              <input id="rv-name" className={inputStyles} {...register("name", { required: true })} />
            </FormField>
            <FormField label="Ngày (YYYY-MM-DD)" htmlFor="rv-date">
              <input id="rv-date" className={inputStyles} placeholder="2024-03-01" {...register("date")} />
            </FormField>
          </div>
          <FormField label="Tiêu đề đánh giá" htmlFor="rv-title" required>
            <input id="rv-title" className={inputStyles} {...register("title", { required: true })} />
          </FormField>
          <FormField label="Nội dung" htmlFor="rv-body" required>
            <textarea id="rv-body" rows={4} className={cn(inputStyles, "resize-none")} {...register("body", { required: true })} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="URL ảnh bìa" htmlFor="rv-photo">
              <input id="rv-photo" className={inputStyles} placeholder="/images/..." {...register("photo")} />
            </FormField>
            <FormField label="URL avatar" htmlFor="rv-avatar">
              <input id="rv-avatar" className={inputStyles} placeholder="/images/..." {...register("avatar")} />
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
