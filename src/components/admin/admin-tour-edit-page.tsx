"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminTourBasicTab } from "@/components/admin/admin-tour-basic-tab";
import { AdminTourDetailTab } from "@/components/admin/admin-tour-detail-tab";
import { AdminTourGalleryTab } from "@/components/admin/admin-tour-gallery-tab";
import { AdminTourItineraryTab } from "@/components/admin/admin-tour-itinerary-tab";
import { AdminTourPricingTab } from "@/components/admin/admin-tour-pricing-tab";
import { updateTourPackageAction } from "@/app/admin/_actions/tour-package-actions";
import type { TourPackage, TourPackageInput } from "@/lib/types/tours-cms-types";

const TABS = [
  { key: "basic",     label: "Cơ bản" },
  { key: "detail",    label: "Chi tiết" },
  { key: "gallery",   label: "Gallery" },
  { key: "itinerary", label: "Lịch trình" },
  { key: "pricing",   label: "Giá cả" },
] as const;

type TabKey = typeof TABS[number]["key"];

function toInput(tour: TourPackage): TourPackageInput {
  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = tour;
  return rest;
}

type Props = { tour: TourPackage };

/** Full-featured tour editor with tabs — rendered inside /admin/tours-list/[slug] */
export function AdminTourEditPage({ tour }: Props) {
  const [form, setForm] = useState<TourPackageInput>(toInput(tour));
  const [tab, setTab] = useState<TabKey>("basic");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const onChange = useCallback(<K extends keyof TourPackageInput>(key: K, value: TourPackageInput[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const result = await updateTourPackageAction(tour.slug, form);
    setSaving(false);
    if (result.error) setError(result.error);
    else setSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/tours-list"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Quản lý Tour
          </Link>
          <h1 className="text-2xl font-bold truncate max-w-[600px]">{form.title || "Chỉnh sửa tour"}</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-0.5">/{form.slug}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-7">
          {saved && <span className="text-sm text-green-600 font-medium">Đã lưu ✓</span>}
          {error && <span className="text-sm text-red-500">{error}</span>}
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1.5" />
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-[var(--color-border)] overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        {tab === "basic"     && <AdminTourBasicTab     form={form} isEdit onChange={onChange} />}
        {tab === "detail"    && <AdminTourDetailTab    form={form} onChange={onChange} />}
        {tab === "gallery"   && <AdminTourGalleryTab   gallery={form.gallery} onChange={(v) => onChange("gallery", v)} />}
        {tab === "itinerary" && <AdminTourItineraryTab itinerary={form.itinerary} onChange={(v) => onChange("itinerary", v)} />}
        {tab === "pricing"   && <AdminTourPricingTab   pricingOptions={form.pricingOptions} onChange={(v) => onChange("pricingOptions", v)} />}
      </div>
    </div>
  );
}
