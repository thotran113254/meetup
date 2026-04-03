"use client";

import { useState } from "react";
import { Info, HelpCircle } from "lucide-react";
import { AdminPageSectionNav, type SectionNavItem } from "@/components/admin/admin-page-section-nav";
import { AdminContactInfoTab } from "@/components/admin/admin-contact-info-tab";
import { AdminContactFaqTab } from "@/components/admin/admin-contact-faq-tab";
import { useAdminContact } from "@/hooks/use-admin-contact";

type TabKey = "info" | "faq";

export default function AdminContactPage() {
  const cms = useAdminContact();
  const [tab, setTab] = useState<TabKey>("info");

  const sections: SectionNavItem[] = [
    { key: "info", label: "Thong tin", icon: Info },
    { key: "faq", label: "FAQ", icon: HelpCircle, badge: cms.faq.length },
  ];

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trang Contact</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            Quan ly noi dung trang lien he
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

            {tab === "info" && (
              <AdminContactInfoTab
                data={cms.info}
                saving={cms.saving === "info"}
                onSave={cms.saveInfo}
              />
            )}
            {tab === "faq" && (
              <AdminContactFaqTab
                data={cms.faq}
                saving={cms.saving === "faq"}
                onSave={cms.saveFaq}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
