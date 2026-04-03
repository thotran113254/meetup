"use client";

import { useState } from "react";
import { TourCard, type TourCardProps } from "@/components/ui/tour-card";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * Pill filter tabs — Solo, Couple, Friends, Family, Under 50s, Over 50s, All.
 * Active tab: teal bg + teal text. Inactive: gray bg + gray text.
 * Figma: 13854:57174 (desktop), 13856:64296 (mobile).
 */
/* Tab order: "All" last on desktop per Figma 13854:57174 */
const FILTER_TABS = [
  { label: "Solo", value: "solo" },
  { label: "Couple", value: "couple" },
  { label: "Friends", value: "friends" },
  { label: "Family", value: "family" },
  { label: "Under 50s", value: "under-50s" },
  { label: "Over 50s", value: "over-50s" },
  { label: "All", value: "all" },
];

const TOTAL_PAGES = 6;

/**
 * DestinationDetailTourGrid — Reusable grid section with pill filters + pagination.
 * Used for both "Hanoi day tour" (square cards) and "Hanoi tour package" (portrait cards).
 * @param variant "day-tour" = square 338x338, "package" = portrait 338x516
 */
export function DestinationDetailTourGrid({
  title,
  variant,
  tours,
}: {
  title: string;
  variant: "day-tour" | "package";
  tours: TourCardProps[];
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  /* Card sizing per variant */
  const cardClassName =
    variant === "day-tour"
      ? "group relative w-full aspect-square rounded-[12px] overflow-hidden block"
      : "group relative w-full aspect-square sm:aspect-auto sm:h-[516px] rounded-[12px] overflow-hidden block";

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide flex flex-col gap-5">
        {/* Header: title + pill filter tabs */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)]">
              {title}
            </h2>

            {/* Pill filter tabs — horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setActiveFilter(tab.value);
                      setCurrentPage(1);
                    }}
                    className={`shrink-0 h-10 px-4 rounded-xl text-[12px] font-bold leading-[1.2] transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[var(--color-secondary)] text-[var(--color-primary)]"
                        : "bg-[#F3F3F3] text-[#828282] hover:bg-[#E5E5E5]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Tour cards grid — 1 col mobile, 2 col tablet, 4 col desktop */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-x-4 lg:gap-y-5">
            {tours.map((tour) => (
              <TourCard key={tour.slug} {...tour} className={cardClassName} />
            ))}
          </div>
        </ScrollReveal>

        {/* Pagination — teal active */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
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
      </div>
    </section>
  );
}
