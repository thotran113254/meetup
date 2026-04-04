"use client";

import { FormField, inputStyles } from "@/components/ui/form-field";
import { AdminImageField } from "@/components/admin/admin-image-field";
import type { TourPackageInput } from "@/lib/types/tours-cms-types";

type Props = {
  form: TourPackageInput;
  isEdit?: boolean;
  onChange: <K extends keyof TourPackageInput>(key: K, value: TourPackageInput[K]) => void;
};

/** Basic fields tab: slug, title, image, price, duration, spots, tags, flights, description, category, published, sortOrder */
export function AdminTourBasicTab({ form, isEdit, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Tiêu đề *" htmlFor="tb-title">
          <input id="tb-title" className={inputStyles} value={form.title}
            onChange={(e) => {
              onChange("title", e.target.value);
              if (!isEdit) onChange("slug", e.target.value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-"));
            }} placeholder="Tên tour" />
        </FormField>
        <FormField label="Slug *" htmlFor="tb-slug">
          <input id="tb-slug" className={inputStyles} value={form.slug}
            onChange={(e) => onChange("slug", e.target.value)} placeholder="tour-ha-noi-3-ngay" />
        </FormField>
      </div>

      <AdminImageField
        value={form.image}
        onChange={(url) => onChange("image", url)}
        label="Ảnh bìa"
        alt={form.title}
        folder="tours"
      />

      <div className="grid grid-cols-3 gap-3">
        <FormField label="Giá (USD)" htmlFor="tb-price">
          <input id="tb-price" type="number" min={0} className={inputStyles} value={form.price}
            onChange={(e) => onChange("price", Number(e.target.value))} />
        </FormField>
        <FormField label="Thời gian (vd: 4D3N)" htmlFor="tb-duration">
          <input id="tb-duration" className={inputStyles} value={form.duration}
            onChange={(e) => onChange("duration", e.target.value)} placeholder="4D3N" />
        </FormField>
        <FormField label="Số chỗ còn" htmlFor="tb-spots">
          <input id="tb-spots" type="number" min={0} className={inputStyles} value={form.spots}
            onChange={(e) => onChange("spots", Number(e.target.value))} />
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <FormField label="Số chuyến bay nội địa" htmlFor="tb-flights">
          <input id="tb-flights" type="number" min={0} className={inputStyles} value={form.flights}
            onChange={(e) => onChange("flights", Number(e.target.value))} />
        </FormField>
        <FormField label="Danh mục" htmlFor="tb-category">
          <input id="tb-category" className={inputStyles} value={form.category}
            onChange={(e) => onChange("category", e.target.value)} placeholder="general" />
        </FormField>
        <FormField label="Thứ tự hiển thị" htmlFor="tb-sort">
          <input id="tb-sort" type="number" className={inputStyles} value={form.sortOrder}
            onChange={(e) => onChange("sortOrder", Number(e.target.value))} />
        </FormField>
      </div>

      <FormField label="Tags (cách nhau bằng dấu phẩy)" htmlFor="tb-tags">
        <input id="tb-tags" className={inputStyles}
          value={form.tags.join(", ")}
          onChange={(e) => onChange("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
          placeholder="Adventure, Solo, Family" />
      </FormField>

      <FormField label="Mô tả ngắn" htmlFor="tb-desc">
        <textarea id="tb-desc" rows={3} className={inputStyles} value={form.description}
          onChange={(e) => onChange("description", e.target.value)} />
      </FormField>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published}
          onChange={(e) => onChange("published", e.target.checked)}
          className="w-4 h-4 rounded accent-[var(--color-primary)]" />
        <span className="text-sm font-medium">Đã xuất bản (hiển thị trên trang)</span>
      </label>
    </div>
  );
}
