"use client";

import { useState } from "react";
import { FileText, BarChart3 } from "lucide-react";
import { AdminPageSectionNav, type SectionNavItem } from "@/components/admin/admin-page-section-nav";
import { AdminToursContentTab } from "@/components/admin/admin-tours-content-tab";
import { AdminToursStatsTab } from "@/components/admin/admin-tours-stats-tab";
import { useAdminTours } from "@/hooks/use-admin-tours";

export default function AdminToursPage() {
  const cms = useAdminTours();
  const [tab, setTab] = useState("content");

  const sections: SectionNavItem[] = [
    { key: "content", label: "Noi dung", icon: FileText, group: "Chinh" },
    { key: "stats", label: "Thong ke Vietnam", icon: BarChart3, badge: cms.stats.length, group: "Chinh" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trang Tours</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            Quan ly noi dung va thong ke trang Tours
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav — desktop */}
        <div className="w-[200px] shrink-0 hidden md:block">
          <div className="sticky top-8">
            <AdminPageSectionNav
              sections={sections}
              activeKey={tab}
              onChange={setTab}
            />
          </div>
        </div>

        {/* Dropdown nav — mobile */}
        <div className="md:hidden w-full mb-4">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]"
          >
            {sections.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Editor card */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">
              {sections.find((s) => s.key === tab)?.label}
            </h2>

            {cms.loading ? (
              <p className="py-10 text-center text-sm text-[var(--color-muted-foreground)]">
                Dang tai...
              </p>
            ) : (
              <>
                {tab === "content" && (
                  <AdminToursContentTab
                    data={cms.content}
                    saving={cms.saving === "content"}
                    onSave={cms.saveContent}
                  />
                )}
                {tab === "stats" && (
                  <AdminToursStatsTab
                    data={cms.stats}
                    saving={cms.saving === "stats"}
                    onSave={cms.saveStats}
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
