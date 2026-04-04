"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { PricingGroup } from "@/lib/types/tours-cms-types";

type Props = {
  pricingOptions: PricingGroup[];
  onChange: (options: PricingGroup[]) => void;
};

/** Pricing tab — CRUD for pricing groups (e.g. Group tour / Private tour with 4-star / 5-star rows) */
export function AdminTourPricingTab({ pricingOptions, onChange }: Props) {
  const addGroup = () =>
    onChange([...pricingOptions, { title: "", rows: [{ label: "", price: "" }] }]);

  const removeGroup = (gi: number) => onChange(pricingOptions.filter((_, i) => i !== gi));

  const updateGroupTitle = (gi: number, title: string) =>
    onChange(pricingOptions.map((g, i) => (i === gi ? { ...g, title } : g)));

  const addRow = (gi: number) =>
    onChange(pricingOptions.map((g, i) =>
      i === gi ? { ...g, rows: [...g.rows, { label: "", price: "" }] } : g
    ));

  const removeRow = (gi: number, ri: number) =>
    onChange(pricingOptions.map((g, i) =>
      i === gi ? { ...g, rows: g.rows.filter((_, j) => j !== ri) } : g
    ));

  const updateRow = (gi: number, ri: number, field: "label" | "price", val: string) =>
    onChange(pricingOptions.map((g, i) =>
      i === gi
        ? { ...g, rows: g.rows.map((r, j) => (j === ri ? { ...r, [field]: val } : r)) }
        : g
    ));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Bảng giá</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
            Mỗi nhóm giá (vd: "Group tour:") có nhiều dòng (vd: "4-Star · From $1800").
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={addGroup}>
          <Plus className="h-4 w-4 mr-1" /> Thêm nhóm
        </Button>
      </div>

      {pricingOptions.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">
          Chưa có bảng giá — sidebar sẽ hiển thị nội dung mặc định.
        </p>
      )}

      <div className="space-y-4">
        {pricingOptions.map((group, gi) => (
          <div key={gi} className="p-4 rounded-lg border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between gap-3">
              <FormField label="Tên nhóm giá" htmlFor={`pg-title-${gi}`} className="flex-1">
                <input id={`pg-title-${gi}`} className={inputStyles} value={group.title}
                  onChange={(e) => updateGroupTitle(gi, e.target.value)}
                  placeholder="Group tour:" />
              </FormField>
              <Button size="sm" variant="outline" onClick={() => removeGroup(gi)}
                className="shrink-0 mt-5 text-red-500 hover:text-red-600 hover:border-red-200">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-2">
              {group.rows.map((row, ri) => (
                <div key={ri} className="flex items-center gap-2">
                  <input className={`${inputStyles} flex-1`} value={row.label}
                    onChange={(e) => updateRow(gi, ri, "label", e.target.value)}
                    placeholder="4-Star" />
                  <input className={`${inputStyles} w-36`} value={row.price}
                    onChange={(e) => updateRow(gi, ri, "price", e.target.value)}
                    placeholder="From $1800" />
                  <Button size="sm" variant="outline" onClick={() => removeRow(gi, ri)}
                    className="shrink-0 text-red-500 hover:text-red-600 hover:border-red-200">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => addRow(gi)} className="w-full mt-1">
                <Plus className="h-3.5 w-3.5 mr-1" /> Thêm dòng giá
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
