"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminHomepageTourDialog } from "@/components/admin/admin-homepage-tour-dialog";
import { AdminHomepageServiceDialog } from "@/components/admin/admin-homepage-service-dialog";
import { AdminHomepageReviewDialog } from "@/components/admin/admin-homepage-review-dialog";
import { AdminHomepageVideoDialog } from "@/components/admin/admin-homepage-video-dialog";
import { AdminHomepageItemsTab } from "@/components/admin/admin-homepage-items-tab";
import { AdminHomepageConfigTab } from "@/components/admin/admin-homepage-config-tab";
import { AdminHomepageExperienceTab } from "@/components/admin/admin-homepage-experience-tab";
import { AdminHomepageAboutTab } from "@/components/admin/admin-homepage-about-tab";
import { AdminHomepageNewsletterTab } from "@/components/admin/admin-homepage-newsletter-tab";
import { AdminHomepageEticketsTab } from "@/components/admin/admin-homepage-etickets-tab";
import { useAdminHomepage, type SectionKey } from "@/hooks/use-admin-homepage";
import type { TourCardProps } from "@/components/ui/tour-card";
import type { ServiceItem } from "@/components/sections/homepage/services-carousel";
import type { ReviewItem } from "@/components/sections/homepage/reviews-carousel";
import type { VideoItem } from "@/components/sections/homepage/youtube-grid";

type TabKey = SectionKey | "config" | "experience" | "about" | "newsletter" | "etickets";

const TABS: { key: TabKey; label: string }[] = [
  { key: "config", label: "Cấu hình" },
  { key: "tours", label: "Tours" },
  { key: "services", label: "Dịch vụ" },
  { key: "reviews", label: "Đánh giá" },
  { key: "videos", label: "YouTube" },
  { key: "experience", label: "Experience" },
  { key: "about", label: "About" },
  { key: "newsletter", label: "Newsletter" },
  { key: "etickets", label: "eTickets" },
];

const ARRAY_TABS: SectionKey[] = ["tours", "services", "reviews", "videos"];

export default function AdminHomepagePage() {
  const cms = useAdminHomepage();
  const [tab, setTab] = useState<TabKey>("config");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null);
  const [editTarget, setEditTarget] = useState<Record<string, unknown> | null>(null);

  const activeSection = ARRAY_TABS.includes(tab as SectionKey) ? (tab as SectionKey) : null;
  const isSaving = cms.saving === tab;

  const openAdd = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (item: Record<string, unknown>) => { setEditTarget(item); setDialogOpen(true); };

  const handleSave = async (item: Record<string, unknown>) => {
    if (!activeSection) return;
    if (editTarget) await cms.editItem(activeSection, item);
    else await cms.addItem(activeSection, item);
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !activeSection) return;
    await cms.removeItem(activeSection, deleteTarget.id);
    setDeleteTarget(null);
  };

  const getDeleteLabel = (item: Record<string, unknown>): string =>
    (item.title ?? item.name ?? item.label ?? "mục này") as string;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nội dung Homepage</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Quản lý các section trên trang chủ</p>
        </div>
        <Link href="/admin/slides" className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> Hero Slides
        </Link>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap border-b border-[var(--color-border)]">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.key
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            }`}
          >
            {t.label}
            {!cms.loading && activeSection === t.key && ` (${cms.data[t.key as SectionKey].length})`}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "config" && (
        <AdminHomepageConfigTab config={cms.config} saving={cms.saving === "config"} onSave={cms.updateConfig} />
      )}
      {activeSection && (
        <AdminHomepageItemsTab
          tab={activeSection}
          items={cms.data[activeSection] as Record<string, unknown>[]}
          loading={cms.loading} saving={isSaving}
          onAdd={openAdd} onEdit={openEdit}
          onDelete={(item) => setDeleteTarget({ id: item.id as number, label: getDeleteLabel(item) })}
        />
      )}
      {tab === "experience" && (
        <AdminHomepageExperienceTab experience={cms.experience} saving={cms.saving === "experience"} onSave={cms.saveExperience} />
      )}
      {tab === "about" && (
        <AdminHomepageAboutTab about={cms.about} saving={cms.saving === "about"} onSave={cms.saveAbout} />
      )}
      {tab === "newsletter" && (
        <AdminHomepageNewsletterTab newsletter={cms.newsletter} saving={cms.saving === "newsletter"} onSave={cms.saveNewsletter} />
      )}
      {tab === "etickets" && (
        <AdminHomepageEticketsTab etickets={cms.etickets} saving={cms.saving === "etickets"} onSave={cms.saveEtickets} />
      )}

      {/* Array section dialogs */}
      {tab === "tours" && (
        <AdminHomepageTourDialog open={dialogOpen} onOpenChange={setDialogOpen}
          initialData={editTarget as (TourCardProps & { id: number }) | null}
          onSave={handleSave} saving={isSaving} />
      )}
      {tab === "services" && (
        <AdminHomepageServiceDialog open={dialogOpen} onOpenChange={setDialogOpen}
          initialData={editTarget as (ServiceItem & { id: number }) | null}
          onSave={handleSave} saving={isSaving} />
      )}
      {tab === "reviews" && (
        <AdminHomepageReviewDialog open={dialogOpen} onOpenChange={setDialogOpen}
          initialData={editTarget as (ReviewItem & { id: number }) | null}
          onSave={handleSave} saving={isSaving} />
      )}
      {tab === "videos" && (
        <AdminHomepageVideoDialog open={dialogOpen} onOpenChange={setDialogOpen}
          initialData={editTarget as (VideoItem & { id: number }) | null}
          onSave={handleSave} saving={isSaving} />
      )}

      <AdminConfirmDialog
        open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Xóa mục này?" description={`Xóa "${deleteTarget?.label}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
