"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { TourCard, type TourCardProps } from "@/components/ui/tour-card";
import { FilterDropdown, DURATION_OPTIONS } from "@/components/ui/filter-dropdown";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { ScrollReveal } from "@/components/ui/scroll-animations";

type Props = { tours: TourCardProps[] };

/**
 * TourPackageCarousel — client component: duration filter dropdown + horizontal scroll carousel.
 * Receives tour data as props from the server wrapper (tour-package-section.tsx).
 */
export function TourPackageCarousel({ tours }: Props) {
  const { ref: scrollRef, scroll } = useHorizontalScroll(354); // 338px card + 16px gap
  const [durationOpen, setDurationOpen] = useState(false);
  const [duration, setDuration] = useState("all");

  const selectedLabel = DURATION_OPTIONS.find((o) => o.value === duration)?.label ?? "Duration";

  const filtered =
    duration === "all"
      ? tours
      : tours.filter((t) => t.duration === duration);

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide flex flex-col gap-5">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.05px] md:tracking-[0.08px] text-[var(--color-foreground)]">
              Tour package
            </h2>
            <a
              href="/tours"
              className="h-10 px-4 text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-xl transition-colors flex items-center justify-center cursor-pointer shrink-0"
            >
              View all
            </a>
          </div>
        </ScrollReveal>

        {/* Duration filter */}
        <div className="relative">
          <button
            onClick={() => setDurationOpen((o) => !o)}
            className="flex items-center justify-between w-full md:w-[199px] h-10 border border-[var(--color-border)] rounded-xl px-3 bg-white text-[12px] md:text-[14px] font-bold text-[var(--color-foreground)] cursor-pointer"
          >
            <span className="truncate">{selectedLabel}</span>
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

        {/* Carousel */}
        <ScrollReveal delay={0.15}>
          <div className="relative">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="hidden md:flex absolute left-2 lg:-left-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center transition-colors z-10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-2 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
            >
              {filtered.map((pkg) => (
                <TourCard key={pkg.slug} {...pkg} />
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="hidden md:flex absolute right-2 lg:-right-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center transition-colors z-10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
