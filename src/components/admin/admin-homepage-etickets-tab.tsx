"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { EticketsData } from "@/lib/types/homepage-cms-types";

type Props = {
  etickets: EticketsData;
  saving: boolean;
  onSave: (data: EticketsData) => Promise<void>;
};

type PairItem = { value: string; label: string };

function PairList({
  title, items, onChange,
}: {
  title: string;
  items: PairItem[];
  onChange: (items: PairItem[]) => void;
}) {
  const add = () => onChange([...items, { value: "", label: "" }]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const setField = (idx: number, field: keyof PairItem, val: string) =>
    onChange(items.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title} ({items.length})</p>
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="h-4 w-4 mr-1" /> Thêm
        </Button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-[var(--color-muted-foreground)] py-2">Chưa có mục nào</p>
      )}
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            className={inputStyles}
            placeholder="value"
            value={item.value}
            onChange={(e) => setField(idx, "value", e.target.value)}
          />
          <input
            className={inputStyles}
            placeholder="label"
            value={item.label}
            onChange={(e) => setField(idx, "label", e.target.value)}
          />
          <Button
            variant="outline" size="sm"
            onClick={() => remove(idx)}
            className="shrink-0 text-red-500 hover:text-red-600 hover:border-red-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}

/** Editor for the eTickets section — title, cities, passengers. */
export function AdminHomepageEticketsTab({ etickets, saving, onSave }: Props) {
  const [local, setLocal] = useState<EticketsData>(etickets);

  useEffect(() => { setLocal(etickets); }, [etickets]);

  return (
    <div className="space-y-6 max-w-lg">
      <FormField label="Tiêu đề" htmlFor="et-title">
        <input
          id="et-title"
          className={inputStyles}
          value={local.title}
          onChange={(e) => setLocal((p) => ({ ...p, title: e.target.value }))}
        />
      </FormField>

      <PairList
        title="Thành phố"
        items={local.cities}
        onChange={(cities) => setLocal((p) => ({ ...p, cities }))}
      />

      <PairList
        title="Hành khách"
        items={local.passengers}
        onChange={(passengers) => setLocal((p) => ({ ...p, passengers }))}
      />

      <div className="flex justify-end">
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
}
