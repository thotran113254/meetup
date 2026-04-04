"use client";

import { useState } from "react";
import { AlertTriangle, BarChart3, FileText, HelpCircle, ImageIcon, Star, LayoutGrid } from "lucide-react";
import { AdminPageSectionNav, type SectionNavItem } from "@/components/admin/admin-page-section-nav";
import { AdminToursHeroTab } from "@/components/admin/admin-tours-hero-tab";
import { AdminToursContentTab } from "@/components/admin/admin-tours-content-tab";
import { AdminToursStatsTab } from "@/components/admin/admin-tours-stats-tab";
import { AdminToursFaqTab } from "@/components/admin/admin-tours-faq-tab";
import { AdminToursFeaturedTab } from "@/components/admin/admin-tours-featured-tab";
import { AdminToursPackagesTab } from "@/components/admin/admin-tours-packages-tab";
import { useAdminTours } from "@/hooks/use-admin-tours";

const CMS_SECTIONS = [
  { key: "tours_hero",          label: "Hero banner" },
  { key: "tours_page_content",  label: "Nội dung giới thiệu" },
  { key: "tours_page_stats",    label: "Thống kê Vietnam" },
  { key: "tours_most_liked",    label: "Gói nổi bật" },
  { key: "tours_package_grid",  label: "Danh sách tour" },
  { key: "tours_faq",           label: "FAQ" },
];

export default function AdminToursPage() {
  const cms = useAdminTours();
  const [tab, setTab] = useState("hero");

  const sections: SectionNavItem[] = [
    { key: "hero",        label: "Hero banner",       icon: ImageIcon,  group: "Chính" },
    { key: "content",     label: "Nội dung",          icon: FileText,   group: "Chính" },
    { key: "stats",       label: "Thống kê Vietnam",  icon: BarChart3,  badge: cms.stats.length,                   group: "Chính" },
    { key: "mostLiked",   label: "Gói nổi bật",       icon: Star,       badge: cms.mostLiked?.tourSlugs?.length ?? 0,     group: "Sections" },
    { key: "packageGrid", label: "Danh sách tour",    icon: LayoutGrid, badge: cms.packageGrid?.tourSlugs?.length ?? 0,   group: "Sections" },
    { key: "faq",         label: "FAQ",               icon: HelpCircle, badge: cms.faq.length,                     group: "Sections" },
  ];

  const unsavedSections = !cms.loading
    ? CMS_SECTIONS.filter((s) => !cms.isSaved(s.key))
    : [];

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trang Tours</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            Quản lý nội dung trang Tours ·{" "}
            <a href="/admin/tours-list" className="underline text-[var(--color-primary)]">
              Quản lý danh sách tour →
            </a>
          </p>
        </div>
      </div>

      {unsavedSections.length > 0 && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3 items-start">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Trang đang hiển thị dữ liệu mặc định</p>
            <p className="mt-0.5 text-amber-700">Các mục sau chưa được lưu vào CMS:</p>
            <ul className="mt-1 list-disc list-inside space-y-0.5 text-amber-700">
              {unsavedSections.map((s) => <li key={s.key}>{s.label}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        <div className="w-[200px] shrink-0 hidden md:block">
          <div className="sticky top-8">
            <AdminPageSectionNav sections={sections} activeKey={tab} onChange={setTab} />
          </div>
        </div>

        <div className="md:hidden w-full mb-4">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]"
          >
            {sections.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">
              {sections.find((s) => s.key === tab)?.label}
            </h2>

            {cms.loading ? (
              <p className="py-10 text-center text-sm text-[var(--color-muted-foreground)]">Đang tải...</p>
            ) : (
              <>
                {tab === "hero" && (
                  <AdminToursHeroTab data={cms.hero} saving={cms.saving === "hero"} onSave={cms.saveHero} />
                )}
                {tab === "content" && (
                  <AdminToursContentTab data={cms.content} saving={cms.saving === "content"} onSave={cms.saveContent} />
                )}
                {tab === "stats" && (
                  <AdminToursStatsTab data={cms.stats} saving={cms.saving === "stats"} onSave={cms.saveStats} />
                )}
                {tab === "mostLiked" && (
                  <AdminToursFeaturedTab
                    data={cms.mostLiked}
                    availableTours={cms.availableTours}
                    saving={cms.saving === "mostLiked"}
                    onSave={cms.saveMostLiked}
                  />
                )}
                {tab === "packageGrid" && (
                  <AdminToursPackagesTab
                    data={cms.packageGrid}
                    availableTours={cms.availableTours}
                    saving={cms.saving === "packageGrid"}
                    onSave={cms.savePackageGrid}
                  />
                )}
                {tab === "faq" && (
                  <AdminToursFaqTab data={cms.faq} saving={cms.saving === "faq"} onSave={cms.saveFaq} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
