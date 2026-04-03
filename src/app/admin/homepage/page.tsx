"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings2, Map, Briefcase, Star, Youtube, Compass,
  Info, Mail, Plane, ExternalLink, Images,
} from "lucide-react";
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
import { AdminPageSectionNav, type SectionNavItem } from "@/components/admin/admin-page-section-nav";
import { useAdminHomepage, type SectionKey } from "@/hooks/use-admin-homepage";
import type { TourCardProps } from "@/components/ui/tour-card";
import type { ServiceItem } from "@/components/sections/homepage/services-carousel";
import type { ReviewItem } from "@/components/sections/homepage/reviews-carousel";
import type { VideoItem } from "@/components/sections/homepage/youtube-grid";

type TabKey = SectionKey | "config" | "experience" | "about" | "newsletter" | "etickets";

const ARRAY_TABS: SectionKey[] = ["tours", "services", "reviews", "videos"];

export default function AdminHomepagePage() {
  const cms = useAdminHomepage();
  const [tab, setTab] = useState<TabKey>("config");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null);
  const [editTarget, setEditTarget] = useState<Record<string, unknown> | null>(null);

  const activeSection = ARRAY_TABS.includes(tab as SectionKey) ? (tab as SectionKey) : null;
  const isSaving = cms.saving === tab;

  /* Build section nav items with live badges */
  const sections: SectionNavItem[] = [
    { key: "config", label: "Cấu hình", icon: Settings2, group: "Hệ thống" },
    { key: "tours", label: "Tour Packages", icon: Map, badge: cms.data.tours.length, group: "Nội dung" },
    { key: "services", label: "Dịch vụ", icon: Briefcase, badge: cms.data.services.length, group: "Nội dung" },
    { key: "reviews", label: "Đánh giá", icon: Star, badge: cms.data.reviews.length, group: "Nội dung" },
    { key: "videos", label: "YouTube", icon: Youtube, badge: cms.data.videos.length, group: "Nội dung" },
    { key: "experience", label: "Experience", icon: Compass, group: "Nội dung" },
    { key: "about", label: "About Us", icon: Info, group: "Khác" },
    { key: "newsletter", label: "Newsletter", icon: Mail, group: "Khác" },
    { key: "etickets", label: "eTickets", icon: Plane, group: "Khác" },
  ];

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
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Homepage</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Quản lý nội dung trang chủ</p>
        </div>
        <Link href="/admin/slides" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors">
          <Images className="h-3.5 w-3.5" /> Hero Slides <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Two-column layout: section nav + editor */}
      <div className="flex gap-6">
        {/* Left: section sidebar */}
        <div className="w-[200px] shrink-0 hidden md:block">
          <div className="sticky top-8">
            <AdminPageSectionNav sections={sections} activeKey={tab} onChange={(k) => setTab(k as TabKey)} />
          </div>
        </div>

        {/* Mobile: section dropdown */}
        <div className="md:hidden w-full mb-4">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value as TabKey)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]"
          >
            {sections.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Right: editor content */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-6">
            {/* Section title */}
            <h2 className="text-lg font-semibold mb-4">
              {sections.find((s) => s.key === tab)?.label}
            </h2>

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
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {tab === "tours" && <AdminHomepageTourDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editTarget as (TourCardProps & { id: number }) | null} onSave={handleSave} saving={isSaving} />}
      {tab === "services" && <AdminHomepageServiceDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editTarget as (ServiceItem & { id: number }) | null} onSave={handleSave} saving={isSaving} />}
      {tab === "reviews" && <AdminHomepageReviewDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editTarget as (ReviewItem & { id: number }) | null} onSave={handleSave} saving={isSaving} />}
      {tab === "videos" && <AdminHomepageVideoDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editTarget as (VideoItem & { id: number }) | null} onSave={handleSave} saving={isSaving} />}
      <AdminConfirmDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)} title="Xóa mục này?" description={`Xóa "${deleteTarget?.label}"?`} onConfirm={handleDelete} />
    </div>
  );
}
