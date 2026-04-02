"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { mediaSchema, type MediaData } from "@/lib/validations/media-schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: MediaData) => Promise<{ error?: string }>;
  saving: boolean;
};

export function AdminMediaUploadDialog({ open, onOpenChange, onSave, saving }: Props) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<MediaData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(mediaSchema) as any,
    defaultValues: { url: "", alt: "", type: "image", filename: "", size: undefined },
  });

  const [previewError, setPreviewError] = useState(false);
  const urlValue = watch("url");
  const typeValue = watch("type");

  const onSubmit = async (data: MediaData) => {
    const result = await onSave(data);
    if (!result.error) {
      reset();
      setPreviewError(false);
    } else {
      alert(result.error);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) { reset(); setPreviewError(false); }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Them media</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Loai" htmlFor="m-type">
            <select id="m-type" className={inputStyles} {...register("type")}>
              <option value="image">Hinh anh</option>
              <option value="video">Video</option>
              <option value="document">Tai lieu</option>
            </select>
          </FormField>
          <FormField label="URL" htmlFor="m-url" required error={errors.url?.message}>
            <input id="m-url" className={inputStyles} placeholder="https://..." {...register("url")} />
          </FormField>
          {urlValue && typeValue === "image" && !previewError && (
            <div className="rounded-lg overflow-hidden border border-[var(--color-border)] h-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlValue}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewError(true)}
              />
            </div>
          )}
          <FormField label="Ten file" htmlFor="m-filename" required error={errors.filename?.message}>
            <input id="m-filename" className={inputStyles} placeholder="anh-san-pham.jpg" {...register("filename")} />
          </FormField>
          <FormField label="Mo ta (alt)" htmlFor="m-alt" error={errors.alt?.message}>
            <input id="m-alt" className={inputStyles} {...register("alt")} />
          </FormField>
          <FormField label="Kich thuoc (bytes)" htmlFor="m-size" error={errors.size?.message}>
            <input id="m-size" type="number" min={0} className={inputStyles} {...register("size", { valueAsNumber: true, setValueAs: (v) => (v === "" || isNaN(v) ? undefined : Number(v)) })} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={saving}>Huy</Button>
            <Button type="submit" disabled={saving}>{saving ? "Dang luu..." : "Them media"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
