"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminHomepageExperienceDialog } from "@/components/admin/admin-homepage-experience-dialog";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import type { ExperienceTourItem, ExperienceData, ExperienceRegionData } from "@/lib/types/homepage-cms-types";

const REGIONS = [
  { key: "north", label: "Miền Bắc" },
  { key: "mid", label: "Miền Trung" },
  { key: "south", label: "Miền Nam" },
] as const;

type RegionKey = typeof REGIONS[number]["key"];

type Props = {
  experience: ExperienceData;
  saving: boolean;
  onSave: (data: ExperienceData) => Promise<void>;
};

/** Experience section tab — local state + explicit save button. */
export function AdminHomepageExperienceTab({ experience, saving, onSave }: Props) {
  const [region, setRegion] = useState<RegionKey>("north");
  const [local, setLocal] = useState<ExperienceData>(experience);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ExperienceTourItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceTourItem | null>(null);
  const initialized = useRef(false);

  /* Sync from parent only on first real data load */
  useEffect(() => {
    if (initialized.current) return;
    if (Object.keys(experience).length > 0 || !saving) {
      setLocal(experience);
      initialized.current = true;
    }
  }, [experience, saving]);

  const getRegion = (key: RegionKey): ExperienceRegionData =>
    local[key] ?? { tours: [], images: [] };

  const current = getRegion(region);

  /** Update local state only — no DB save yet */
  const updateRegionLocal = (key: RegionKey, data: ExperienceRegionData) => {
    setLocal((prev) => ({ ...prev, [key]: data }));
  };

  const handleSaveTour = async (tour: ExperienceTourItem) => {
    const r = getRegion(region);
    const tours = editTarget
      ? r.tours.map((t) => (t.id === editTarget.id ? tour : t))
      : [...r.tours, { ...tour, id: Date.now() }];
    updateRegionLocal(region, { ...r, tours });
    setDialogOpen(false);
    setEditTarget(null);
  };

  const handleDeleteTour = () => {
    if (!deleteTarget) return;
    const r = getRegion(region);
    updateRegionLocal(region, { ...r, tours: r.tours.filter((t) => t.id !== deleteTarget.id) });
    setDeleteTarget(null);
  };

  const handleImageChange = (idx: number, val: string) => {
    const images = [...current.images];
    images[idx] = val;
    updateRegionLocal(region, { ...current, images });
  };

  const handleAddImage = () => {
    updateRegionLocal(region, { ...current, images: [...current.images, ""] });
  };

  const handleRemoveImage = (idx: number) => {
    updateRegionLocal(region, { ...current, images: current.images.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      {/* Region sub-tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {REGIONS.map((r) => (
          <button key={r.key} onClick={() => setRegion(r.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              region === r.key
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Tours list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Tours ({current.tours.length})</p>
          <Button size="sm" onClick={() => { setEditTarget(null); setDialogOpen(true); }} disabled={saving}>
            <Plus className="h-4 w-4 mr-1" /> Thêm tour
          </Button>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
          {current.tours.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">Chưa có tour</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {current.tours.map((tour) => (
                  <tr key={tour.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/40">
                    <td className="px-4 py-3">
                      <p className="font-medium">{tour.title}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{tour.price} · {tour.tags.join(", ")}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditTarget(tour); setDialogOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteTarget(tour)}
                          className="text-red-500 hover:text-red-600 hover:border-red-200">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Images list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Ảnh minh hoạ ({current.images.length})</p>
          <Button size="sm" variant="outline" onClick={handleAddImage} disabled={saving}>
            <Plus className="h-4 w-4 mr-1" /> Thêm ảnh
          </Button>
        </div>
        <div className="space-y-2">
          {current.images.map((img, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text" value={img}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                placeholder="/images/experience/..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              <Button variant="outline" size="sm" onClick={() => handleRemoveImage(idx)}
                className="text-red-500 hover:text-red-600 hover:border-red-200">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Save button — only saves to DB when clicked */}
      <div className="flex justify-end">
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu Experience"}
        </Button>
      </div>

      <AdminHomepageExperienceDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        initialData={editTarget} onSave={handleSaveTour} saving={saving}
      />
      <AdminConfirmDialog
        open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Xóa tour này?" description={`Xóa "${deleteTarget?.title}"?`}
        onConfirm={handleDeleteTour}
      />
    </div>
  );
}
