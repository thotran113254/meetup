"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TourCard } from "@/components/ui/tour-card";
import { FilterDropdown, STYLE_OPTIONS, DURATION_OPTIONS } from "@/components/ui/filter-dropdown";
import { ScrollReveal } from "@/components/ui/scroll-animations";
import type { TourPackage } from "@/lib/types/tours-cms-types";

const ITEMS_PER_PAGE = 12;

type Props = {
  sectionTitle?: string;
  packages?: TourPackage[];
};

export function TourPackageGridSection({ sectionTitle, packages }: Props) {
  const displayTitle = sectionTitle || "Tour package";
  const [styleOpen, setStyleOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [style, setStyle] = useState("all");
  const [duration, setDuration] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  if (!packages || packages.length === 0) return null;

  const styleLabel = STYLE_OPTIONS.find((o) => o.value === style)?.label ?? "Style";
  const durationLabel = DURATION_OPTIONS.find((o) => o.value === duration)?.label ?? "Duration";
  const totalPages = Math.max(1, Math.ceil(packages.length / ITEMS_PER_PAGE));
  const paged = packages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide flex flex-col gap-5">
        {/* Header: title + filters */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)]">
              {displayTitle}
            </h2>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <button
                  onClick={() => { setStyleOpen((o) => !o); setDurationOpen(false); }}
                  className="flex items-center justify-between w-full md:w-[199px] h-10 border border-[var(--color-border)] rounded-xl px-3 bg-white text-[12px] md:text-[14px] font-bold text-[var(--color-foreground)] cursor-pointer"
                >
                  <span className="truncate">{styleLabel}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)] flex-none" />
                </button>
                <FilterDropdown open={styleOpen} onClose={() => setStyleOpen(false)}
                  options={STYLE_OPTIONS} selected={style} onSelect={setStyle} />
              </div>

              <div className="relative flex-1 md:flex-none">
                <button
                  onClick={() => { setDurationOpen((o) => !o); setStyleOpen(false); }}
                  className="flex items-center justify-between w-full md:w-[199px] h-10 border border-[var(--color-border)] rounded-xl px-3 bg-white text-[12px] md:text-[14px] font-bold text-[var(--color-foreground)] cursor-pointer"
                >
                  <span className="truncate">{durationLabel}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)] flex-none" />
                </button>
                <FilterDropdown open={durationOpen} onClose={() => setDurationOpen(false)}
                  options={DURATION_OPTIONS} selected={duration} onSelect={setDuration} />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-x-4 lg:gap-y-5">
            {paged.map((pkg, i) => (
              <TourCard
                key={pkg.slug || i}
                {...pkg}
                className="group relative w-full aspect-square sm:aspect-auto sm:h-[516px] rounded-[12px] overflow-hidden block"
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-[14px] font-bold cursor-pointer transition-colors ${
                  currentPage === page
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[#F3F3F3] text-[var(--color-foreground)] hover:bg-[#E5E5E5]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
