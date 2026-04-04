"use client";

import { useState } from "react";
import { AlertTriangle, FileText, ImageIcon, MapPin, Sparkles } from "lucide-react";
import { AdminPageSectionNav, type SectionNavItem } from "@/components/admin/admin-page-section-nav";
import { AdminDestinationsHeroTab } from "@/components/admin/admin-destinations-hero-tab";
import { AdminDestinationsContentTab } from "@/components/admin/admin-destinations-content-tab";
import { AdminDestinationsListTab } from "@/components/admin/admin-destinations-list-tab";
import { AdminDestinationsFeaturesTab } from "@/components/admin/admin-destinations-features-tab";
import { useAdminDestinations } from "@/hooks/use-admin-destinations";

export default function AdminDestinationsPage() {
  const cms = useAdminDestinations();
  const [tab, setTab] = useState("hero");

  const sections: SectionNavItem[] = [
    { key: "hero", label: "Hero banner", icon: ImageIcon },
    { key: "content", label: "Nội dung", icon: FileText },
    { key: "destinations", label: "Điểm đến", icon: MapPin, badge: cms.destinations.length },
    { key: "features", label: "Đặc điểm", icon: Sparkles, badge: cms.features.length },
  ];

  // Keys not yet saved to DB — page is showing hardcoded fallback data
  const unsavedSections = !cms.loading ? [
    { key: "destinations_hero",         label: "Hero banner" },
    { key: "destinations_page_content", label: "Nội dung giới thiệu" },
    { key: "destinations_list",         label: "Danh sách điểm đến" },
    { key: "destinations_features",     label: "Đặc điểm nổi bật" },
  ].filter((s) => !cms.isSaved(s.key)) : [];

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trang Điểm đến</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            Quản lý nội dung giới thiệu và danh sách điểm đến
          </p>
        </div>
      </div>

      {/* Fallback notice — shown when sections haven't been configured in CMS yet */}
      {unsavedSections.length > 0 && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3 items-start">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Trang đang hiển thị dữ liệu mặc định</p>
            <p className="mt-0.5 text-amber-700">
              Các mục sau chưa được lưu vào CMS — trang public sẽ dùng nội dung dự phòng (hardcoded):
            </p>
            <ul className="mt-1 list-disc list-inside space-y-0.5 text-amber-700">
              {unsavedSections.map((s) => (
                <li key={s.key}>{s.label}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar nav — desktop */}
        <div className="w-[200px] shrink-0 hidden md:block">
          <div className="sticky top-8">
            <AdminPageSectionNav sections={sections} activeKey={tab} onChange={setTab} />
          </div>
        </div>

        {/* Sidebar nav — mobile select */}
        <div className="md:hidden w-full mb-4">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]"
          >
            {sections.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Content panel */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">
              {sections.find((s) => s.key === tab)?.label}
            </h2>

            {cms.loading ? (
              <p className="text-sm text-[var(--color-muted-foreground)] py-8 text-center">
                Đang tải...
              </p>
            ) : (
              <>
                {tab === "hero" && (
                  <AdminDestinationsHeroTab
                    data={cms.hero}
                    saving={cms.saving === "hero"}
                    onSave={cms.saveHero}
                  />
                )}
                {tab === "content" && (
                  <AdminDestinationsContentTab
                    data={cms.content}
                    saving={cms.saving === "content"}
                    onSave={cms.saveContent}
                  />
                )}
                {tab === "destinations" && (
                  <AdminDestinationsListTab
                    data={cms.destinations}
                    saving={cms.saving === "destinations"}
                    onSave={cms.saveDestinations}
                  />
                )}
                {tab === "features" && (
                  <AdminDestinationsFeaturesTab
                    data={cms.features}
                    saving={cms.saving === "features"}
                    onSave={cms.saveFeatures}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
