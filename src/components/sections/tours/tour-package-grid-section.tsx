"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TourCard, type TourCardProps } from "@/components/ui/tour-card";
import {
  FilterDropdown,
  STYLE_OPTIONS,
  DURATION_OPTIONS,
} from "@/components/ui/filter-dropdown";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/** 12 tour cards for 4x3 grid */
const ALL_TOURS: TourCardProps[] = Array.from({ length: 12 }, (_, i) => ({
  image: `/images/tour-${(i % 4) + 1}-${["floating-market", "hoi-an", "mekong", "palm-trees"][i % 4]}.png`,
  title:
    "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
  price: 669,
  duration: "4D3N",
  spots: 3,
  tags: ["Adventure", "Solo"],
  slug: `tour-package-${i + 1}`,
}));

const ITEMS_PER_PAGE = 12;
const TOTAL_PAGES = 6;

export function TourPackageGridSection() {
  const [styleOpen, setStyleOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [style, setStyle] = useState("all");
  const [duration, setDuration] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const styleLabel =
    STYLE_OPTIONS.find((o) => o.value === style)?.label ?? "Style";
  const durationLabel =
    DURATION_OPTIONS.find((o) => o.value === duration)?.label ?? "Duration";

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide flex flex-col gap-5">
        {/* Header: title + filters */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)]">
              Tour package
            </h2>

            {/* Filters — full-width split on mobile, fixed 199px on desktop */}
            <div className="flex gap-2 w-full md:w-auto">
              {/* Style filter */}
              <div className="relative flex-1 md:flex-none">
                <button
                  onClick={() => {
                    setStyleOpen((o) => !o);
                    setDurationOpen(false);
                  }}
                  className="flex items-center justify-between w-full md:w-[199px] h-10 border border-[var(--color-border)] rounded-xl px-3 bg-white text-[12px] md:text-[14px] font-bold text-[var(--color-foreground)] cursor-pointer"
                >
                  <span className="truncate">{styleLabel}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)] flex-none" />
                </button>
                <FilterDropdown
                  open={styleOpen}
                  onClose={() => setStyleOpen(false)}
                  options={STYLE_OPTIONS}
                  selected={style}
                  onSelect={setStyle}
                />
              </div>

              {/* Duration filter */}
              <div className="relative flex-1 md:flex-none">
                <button
                  onClick={() => {
                    setDurationOpen((o) => !o);
                    setStyleOpen(false);
                  }}
                  className="flex items-center justify-between w-full md:w-[199px] h-10 border border-[var(--color-border)] rounded-xl px-3 bg-white text-[12px] md:text-[14px] font-bold text-[var(--color-foreground)] cursor-pointer"
                >
                  <span className="truncate">{durationLabel}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)] flex-none" />
                </button>
                <FilterDropdown
                  open={durationOpen}
                  onClose={() => setDurationOpen(false)}
                  options={DURATION_OPTIONS}
                  selected={duration}
                  onSelect={setDuration}
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Grid — 1 col mobile, 2 col tablet, 4 col desktop */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-x-4 lg:gap-y-5">
            {ALL_TOURS.map((tour) => (
              <TourCard
                key={tour.slug}
                {...tour}
                className="group relative w-full aspect-square sm:aspect-auto sm:h-[516px] rounded-[12px] overflow-hidden block"
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Pagination — 6 pages, teal active */}
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
