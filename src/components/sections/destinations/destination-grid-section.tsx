"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * Destination data — each city card with image, name, description.
 * Figma shows 4 destinations repeated across 3 rows (12 cards total per page).
 */
const DESTINATIONS = [
  {
    name: "Hanoi",
    slug: "hanoi",
    image: "/images/destinations/hanoi.jpg",
    description:
      '"Friendship, integrity and a spirit of self-improvement forge the strength of an organization that continues to grow."',
  },
  {
    name: "Danang",
    slug: "danang",
    image: "/images/destinations/danang.png",
    description:
      '"Friendship, integrity and a spirit of self-improvement forge the strength of an organization that continues to grow."',
  },
  {
    name: "Halong",
    slug: "halong",
    image: "/images/destinations/halong.jpg",
    description:
      '"Friendship, integrity and a spirit of self-improvement forge the strength of an organization that continues to grow."',
  },
  {
    name: "Ho Chi Minh city",
    slug: "ho-chi-minh",
    image: "/images/destinations/hochiminh.jpg",
    description:
      '"Friendship, integrity and a spirit of self-improvement forge the strength of an organization that continues to grow."',
  },
];

/** Repeat destinations to fill a 4x3 grid (12 cards) per Figma layout */
const GRID_ITEMS = [...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS];

const ITEMS_PER_PAGE = 12;
const TOTAL_PAGES = 6;

/**
 * DestinationGridSection — Grid of destination cards with pagination.
 * Desktop: 4 columns, 3 rows. Mobile: single column stacked.
 * Figma desktop: 13842:14337, mobile: 13856:60413.
 */
export function DestinationGridSection() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          {/* Title */}
          <h2 className="text-xl md:text-[32px] font-bold text-[var(--color-foreground)] leading-[1.2] tracking-[0.05px] md:tracking-[0.08px] mb-5 md:mb-8">
            Where is your favorite place?
          </h2>

          {/* Destination cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {GRID_ITEMS.slice(0, ITEMS_PER_PAGE).map((dest, idx) => (
              <DestinationCard key={`${dest.slug}-${idx}`} {...dest} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: TOTAL_PAGES }).map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`size-10 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/** Single destination card with image, dark gradient overlay, and text. */
function DestinationCard({
  name,
  slug,
  image,
  description,
}: {
  name: string;
  slug: string;
  image: string;
  description: string;
}) {
  return (
    <Link href={`/destinations/${slug}`} className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer block">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 338px"
      />

      {/* Dark gradient overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[55%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(29,29,29,0) 0%, #1D1D1D 100%)",
        }}
      />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
        <h3 className="text-xl md:text-2xl font-bold text-white leading-[1.2]">
          {name}
        </h3>
        <p className="text-xs text-[#ECECEC] leading-[1.5]">{description}</p>
      </div>
    </Link>
  );
}
