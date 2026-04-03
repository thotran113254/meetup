"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionNavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  group?: string;
};

type Props = {
  sections: SectionNavItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

/**
 * Reusable vertical section navigation for CMS page editors.
 * Groups sections by `group` field, renders icons + labels + optional badge.
 */
export function AdminPageSectionNav({ sections, activeKey, onChange }: Props) {
  /* Group sections — items without group go under "" */
  const groups = new Map<string, SectionNavItem[]>();
  for (const s of sections) {
    const g = s.group ?? "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(s);
  }

  return (
    <nav className="w-full space-y-4">
      {[...groups.entries()].map(([group, items]) => (
        <div key={group}>
          {group && (
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {group}
            </p>
          )}
          <div className="space-y-0.5">
            {items.map((s) => {
              const Icon = s.icon;
              const active = activeKey === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => onChange(s.key)}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors text-left",
                    active
                      ? "bg-[var(--color-primary)] text-white font-medium"
                      : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{s.label}</span>
                  {s.badge !== undefined && s.badge > 0 && (
                    <span className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                      active ? "bg-white/20 text-white" : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                    )}>
                      {s.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
