"use client";

import { useState } from "react";
import { FileText, Briefcase } from "lucide-react";
import { AdminPageSectionNav, type SectionNavItem } from "@/components/admin/admin-page-section-nav";
import { AdminRecruitmentContentTab } from "@/components/admin/admin-recruitment-content-tab";
import { AdminRecruitmentJobsTab } from "@/components/admin/admin-recruitment-jobs-tab";
import { useAdminRecruitment } from "@/hooks/use-admin-recruitment";

type TabKey = "content" | "jobs";

export default function AdminRecruitmentPage() {
  const cms = useAdminRecruitment();
  const [tab, setTab] = useState<TabKey>("content");

  const sections: SectionNavItem[] = [
    { key: "content", label: "Nội dung", icon: FileText },
    { key: "jobs", label: "Vị trí tuyển dụng", icon: Briefcase, badge: cms.jobs.length },
  ];

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trang Tuyển dụng</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            Quản lý nội dung trang tuyển dụng
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <div className="w-[200px] shrink-0 hidden md:block">
          <div className="sticky top-8">
            <AdminPageSectionNav
              sections={sections}
              activeKey={tab}
              onChange={(k) => setTab(k as TabKey)}
            />
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className="md:hidden w-full mb-4">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value as TabKey)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]"
          >
            {sections.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Editor panel */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">
              {sections.find((s) => s.key === tab)?.label}
            </h2>

            {tab === "content" && (
              <AdminRecruitmentContentTab
                data={cms.content}
                saving={cms.saving === "content"}
                onSave={cms.saveContent}
              />
            )}
            {tab === "jobs" && (
              <AdminRecruitmentJobsTab
                data={cms.jobs}
                saving={cms.saving === "jobs"}
                onSave={cms.saveJobs}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
