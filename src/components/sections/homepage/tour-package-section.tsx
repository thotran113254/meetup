"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { TourCard, type TourCardProps } from "@/components/ui/tour-card";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

/**
 * TourPackageSection — horizontally scrollable tour cards with arrow navigation.
 * Uses snap-x for smooth card-by-card scrolling.
 * "use client" required for useRef scroll control.
 */

const TOUR_PACKAGES: TourCardProps[] = [
  {
    image: "/images/placeholder.svg",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels",
  },
  {
    image: "/images/placeholder.svg",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels-2",
  },
  {
    image: "/images/placeholder.svg",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels-3",
  },
  {
    image: "/images/placeholder.svg",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels-4",
  },
];

export function TourPackageSection() {
  const { ref: scrollRef, scroll } = useHorizontalScroll(300);

  return (
    <section className="py-12 bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
            Tour package
          </h2>
          <div className="flex items-center gap-3">
            {/* Duration filter placeholder */}
            <select
              className="text-sm border border-[var(--color-border)] rounded-lg px-3 py-2 bg-white text-[var(--color-foreground)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
              defaultValue=""
              aria-label="Duration select"
            >
              <option value="" disabled>Duration Select</option>
              <option value="1d">1 Day</option>
              <option value="2d">2 Days</option>
              <option value="3d">3 Days</option>
              <option value="4d">4+ Days</option>
            </select>
            {/* View all button */}
            <a
              href="/tours"
              className="text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] px-4 py-2 rounded-lg transition-colors"
            >
              View all
            </a>
          </div>
        </div>

        {/* Carousel with arrow buttons */}
        <div className="relative flex items-center gap-2">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex-none w-9 h-9 rounded-full border border-[var(--color-border)] bg-white shadow-sm flex items-center justify-center hover:bg-[var(--color-muted)] transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--color-foreground)]" />
          </button>

          {/* Scrollable card track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 flex-1"
            style={{ scrollbarWidth: "none" }}
          >
            {TOUR_PACKAGES.map((pkg) => (
              <TourCard key={pkg.slug} {...pkg} />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex-none w-9 h-9 rounded-full border border-[var(--color-border)] bg-white shadow-sm flex items-center justify-center hover:bg-[var(--color-muted)] transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-[var(--color-foreground)]" />
          </button>
        </div>
      </div>
    </section>
  );
}
