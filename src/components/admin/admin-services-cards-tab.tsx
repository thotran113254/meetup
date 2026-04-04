"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import type { ServiceCard } from "@/lib/types/services-cms-types";

type Props = {
  data: ServiceCard[];
  saving: boolean;
  onSave: (d: ServiceCard[]) => Promise<void>;
};

/** CRUD editor for the service cards grid on the Services page. */
export function AdminServicesCardsTab({ data, saving, onSave }: Props) {
  const [local, setLocal] = useState<ServiceCard[]>(data);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (data.length > 0) {
      setLocal(data);
      initialized.current = true;
    }
  }, [data]);

  const update = (idx: number, field: keyof ServiceCard, value: string) =>
    setLocal((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );

  const addCard = () =>
    setLocal((prev) => [
      ...prev,
      { id: Date.now(), serviceId: "", name: "", price: "", image: "", href: "" },
    ]);

  const removeCard = (idx: number) =>
    setLocal((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">{local.length} dịch vụ</p>
        <Button variant="outline" size="sm" onClick={addCard} disabled={saving}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mới
        </Button>
      </div>

      {local.length === 0 && (
        <p className="text-center py-10 text-sm text-[var(--color-muted-foreground)]">
          Chưa có dịch vụ nào
        </p>
      )}

      <div className="space-y-4">
        {local.map((card, idx) => (
          <div
            key={card.id}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                Dịch vụ #{idx + 1}
              </span>
              <button
                onClick={() => removeCard(idx)}
                className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Xóa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Service ID" htmlFor={`card-sid-${idx}`}>
                <input
                  id={`card-sid-${idx}`}
                  className={inputStyles}
                  value={card.serviceId}
                  onChange={(e) => update(idx, "serviceId", e.target.value)}
                  placeholder="fast-track"
                />
              </FormField>

              <FormField label="Tên dịch vụ" htmlFor={`card-name-${idx}`}>
                <input
                  id={`card-name-${idx}`}
                  className={inputStyles}
                  value={card.name}
                  onChange={(e) => update(idx, "name", e.target.value)}
                  placeholder="Fast track service"
                />
              </FormField>

              <FormField label="Giá" htmlFor={`card-price-${idx}`}>
                <input
                  id={`card-price-${idx}`}
                  className={inputStyles}
                  value={card.price}
                  onChange={(e) => update(idx, "price", e.target.value)}
                  placeholder="$669"
                />
              </FormField>

              <FormField label="Đường dẫn (href)" htmlFor={`card-href-${idx}`}>
                <input
                  id={`card-href-${idx}`}
                  className={inputStyles}
                  value={card.href}
                  onChange={(e) => update(idx, "href", e.target.value)}
                  placeholder="/services/fast-track"
                />
              </FormField>

              <div className="sm:col-span-2">
                <AdminImageField
                  value={card.image}
                  onChange={(url) => update(idx, "image", url)}
                  label="URL ảnh"
                  folder="services"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {local.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={() => onSave(local)} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      )}
    </div>
  );
}
