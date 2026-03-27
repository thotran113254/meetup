"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { TourCard, type TourCardProps } from "@/components/ui/tour-card";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

/**
 * TourPackageSection — horizontally scrollable 338x516 tour cards.
 * Figma: "Tour package" H2 title, duration select (199x40) + "View all" (103x40 teal),
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

  return (
    <section className="py-[50px] bg-[var(--color-background)]">
      <div className="container-wide flex flex-col gap-5">
        {/* Header row — title left, filter + view all right */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)]">
            Tour package
          </h2>
          <div className="flex items-center gap-2">
            {/* Duration filter — 199x40, rounded-12px */}
            <div className="relative w-[199px]">
              <select
                className="w-full h-[40px] text-xs border border-[#bdbdbd] rounded-[12px] px-3 bg-white text-[#828282] cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                defaultValue=""
                aria-label="Duration select"
              >
                <option value="" disabled>Duration: Select</option>
                <option value="1d">1 Day</option>
                <option value="2d">2 Days</option>
                <option value="3d">3 Days</option>
                <option value="4d">4+ Days</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828282] rotate-90 pointer-events-none" />
            </div>
            {/* View all — 103x40, rounded-12px, teal bg */}
            <a
              href="/tours"
              className="w-[103px] h-[40px] text-sm font-bold text-white bg-[#3BBCB7] hover:bg-[var(--color-primary-dark)] rounded-[12px] transition-colors flex items-center justify-center"
            >
              View all
            </a>
          </div>
        </div>

        {/* Carousel — arrows centered vertically at card midpoint (516/2=258px) */}
        <div className="relative">
          {/* Left arrow — bg-black/50, 40px round */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-2 lg:-left-10 top-[258px] -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Scrollable card track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {TOUR_PACKAGES.map((pkg) => (
              <TourCard key={pkg.slug} {...pkg} />
            ))}
          </div>

          {/* Right arrow — bg-black/50, 40px round */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-2 lg:-right-10 top-[258px] -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
