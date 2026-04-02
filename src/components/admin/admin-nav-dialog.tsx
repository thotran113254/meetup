"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { navigationSchema, type NavigationData } from "@/lib/validations/navigation-schema";
import type { NavRow } from "@/app/admin/_actions/navigation-actions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: NavRow | null;
  parentOptions: NavRow[];
  onSave: (data: NavigationData) => Promise<{ error?: string }>;
  saving: boolean;
};

export function AdminNavDialog({ open, onOpenChange, initialData, parentOptions, onSave, saving }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NavigationData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(navigationSchema) as any,
    defaultValues: { label: "", href: "", sortOrder: 0, parentId: null, isExternal: false, active: true },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? { label: initialData.label, href: initialData.href, sortOrder: initialData.sortOrder, parentId: initialData.parentId ?? null, isExternal: initialData.isExternal, active: initialData.active }
          : { label: "", href: "", sortOrder: 0, parentId: null, isExternal: false, active: true }
      );
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: NavigationData) => {
    const result = await onSave(data);
    if (result.error) alert(result.error);
  };

  const topLevelOptions = parentOptions.filter((n) => !n.parentId && n.id !== initialData?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Chinh sua muc dieu huong" : "Them muc dieu huong"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nhan hien thi" htmlFor="n-label" required error={errors.label?.message}>
            <input id="n-label" className={inputStyles} {...register("label")} />
          </FormField>
          <FormField label="Duong dan (href)" htmlFor="n-href" required error={errors.href?.message}>
            <input id="n-href" className={inputStyles} placeholder="/trang or https://..." {...register("href")} />
          </FormField>
          <FormField label="Muc cha" htmlFor="n-parent">
            <select id="n-parent" className={inputStyles} {...register("parentId")}>
              <option value="">— Khong co muc cha —</option>
              {topLevelOptions.map((n) => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Thu tu" htmlFor="n-order" error={errors.sortOrder?.message}>
            <input id="n-order" type="number" min={0} className={inputStyles} {...register("sortOrder", { valueAsNumber: true })} />
          </FormField>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" className="rounded" {...register("isExternal")} />
              Mo tab moi
            </label>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" className="rounded" {...register("active")} />
              Hien thi
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Huy</Button>
            <Button type="submit" disabled={saving}>{saving ? "Dang luu..." : initialData ? "Cap nhat" : "Tao moi"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
