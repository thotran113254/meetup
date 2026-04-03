"use client";

import { useState } from "react";
import { FileText, CreditCard, Sparkles } from "lucide-react";
import { AdminPageSectionNav, type SectionNavItem } from "@/components/admin/admin-page-section-nav";
import { AdminServicesContentTab } from "@/components/admin/admin-services-content-tab";
import { AdminServicesCardsTab } from "@/components/admin/admin-services-cards-tab";
import { AdminServicesFeaturesTab } from "@/components/admin/admin-services-features-tab";
import { useAdminServices } from "@/hooks/use-admin-services";

export default function AdminServicesPage() {
  const cms = useAdminServices();
  const [tab, setTab] = useState("content");

  const sections: SectionNavItem[] = [
    { key: "content", label: "Noi dung", icon: FileText },
    { key: "cards", label: "Dich vu", icon: CreditCard, badge: cms.cards.length },
    { key: "features", label: "Tinh nang", icon: Sparkles, badge: cms.features.length },
  ];

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trang Dich vu</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            Quan ly noi dung, danh sach dich vu va tinh nang
          </p>
        </div>
      </div>

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
                Dang tai...
              </p>
            ) : (
              <>
                {tab === "content" && (
                  <AdminServicesContentTab
                    data={cms.content}
                    saving={cms.saving === "content"}
                    onSave={cms.saveContent}
                  />
                )}
                {tab === "cards" && (
                  <AdminServicesCardsTab
                    data={cms.cards}
                    saving={cms.saving === "cards"}
                    onSave={cms.saveCards}
                  />
                )}
                {tab === "features" && (
                  <AdminServicesFeaturesTab
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
