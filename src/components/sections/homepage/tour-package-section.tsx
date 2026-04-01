"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { TourCard, type TourCardProps } from "@/components/ui/tour-card";
import { FilterDropdown, DURATION_OPTIONS } from "@/components/ui/filter-dropdown";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * TourPackageSection — horizontally scrollable 338x516 tour cards.
 * Figma: "Tour package" H2 title, duration filter dropdown + "View all" teal button,
 * 4 cards gap-16px, dark semi-transparent nav arrows at carousel edges.
 */

const TOUR_PACKAGES: TourCardProps[] = [
  {
    image: "/images/tour-1-floating-market.png",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels",
  },
  {
    image: "/images/tour-2-hoi-an.png",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels-2",
  },
  {
    image: "/images/tour-3-mekong.png",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels-3",
  },
  {
    image: "/images/tour-4-palm-trees.png",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels-4",
  },
];

export function TourPackageSection() {
  const { ref: scrollRef, scroll } = useHorizontalScroll(354); // 338px card + 16px gap
  const [durationOpen, setDurationOpen] = useState(false);
  const [duration, setDuration] = useState("all");

  const selectedLabel = DURATION_OPTIONS.find((o) => o.value === duration)?.label ?? "Duration";

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide flex flex-col gap-5">
        {/* Header row — title left, filter + view all right */}
        <ScrollReveal>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.05px] md:tracking-[0.08px] text-[var(--color-foreground)]">
              Tour package
            </h2>
            <a
              href="#"
              className="h-10 px-4 text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-xl transition-colors flex items-center justify-center cursor-pointer shrink-0"
            >
              View all
            </a>
          </div>
        </ScrollReveal>

        {/* Duration filter — full width on mobile */}
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

        {/* Carousel — arrows centered vertically at card midpoint (516/2=258px) */}
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
            {TOUR_PACKAGES.map((pkg) => (
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
