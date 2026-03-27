"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

/**
 * ReviewsSection — Tripadvisor-branded review carousel.
 * Shows 4.9 rating, logo, and horizontally scrollable review cards.
 * "use client" required for useRef scroll control.
 */

type Review = {
  id: number;
  name: string;
  date: string;
  title: string;
  body: string;
  /** Top card photo — experience image reused as review photo */
  photo: string;
};

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Alex M",
    date: "2023.11.30",
    title: "Excelence",
    body: "Tigit works with the best freelance guides that we can find. Each guide we work with specializes in a specific niche. Fr...",
    photo: "/images/exp-north-1.png",
  },
  {
    id: 2,
    name: "Alex M",
    date: "2023.11.30",
    title: "Excelence",
    body: "Tigit works with the best freelance guides that we can find. Each guide we work with specializes in a specific niche. Fr...",
    photo: "/images/exp-north-2.png",
  },
  {
    id: 3,
    name: "Alex M",
    date: "2023.11.30",
    title: "Excelence",
    body: "Tigit works with the best freelance guides that we can find. Each guide we work with specializes in a specific niche. Fr...",
    photo: "/images/exp-north-3.png",
  },
  {
    id: 4,
    name: "Alex M",
    date: "2023.11.30",
    title: "Excelence",
    body: "Tigit works with the best freelance guides that we can find. Each guide we work with specializes in a specific niche. Fr...",
    photo: "/images/exp-north-4.png",
  },
  {
    id: 5,
    name: "Alex M",
    date: "2023.11.30",
    title: "Excelence",
    body: "Tigit works with the best freelance guides that we can find. Each guide we work with specializes in a specific niche. Fr...",
    photo: "/images/exp-north-5.png",
  },
];

/** Five filled gold stars */
function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const { ref: scrollRef, scroll } = useHorizontalScroll(300);

  return (
    <section className="py-12 bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Rating + Tripadvisor branding */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-5xl font-bold text-[var(--color-primary)]">4.9</span>
          {/* Tripadvisor owl logo — green circle with "ta" text placeholder */}
          <div className="w-10 h-10 rounded-full bg-[#34E0A1] flex items-center justify-center flex-none shadow">
            <span className="text-white text-xs font-black leading-none">ta</span>
          </div>
          <span className="text-xl font-semibold text-[var(--color-foreground)]">Tripadvisor</span>
        </div>

        {/* Carousel with arrows */}
        <div className="relative flex items-center gap-2">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll reviews left"
            className="flex-none w-9 h-9 rounded-full border border-[var(--color-border)] bg-white shadow-sm flex items-center justify-center hover:bg-[var(--color-muted)] transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--color-foreground)]" />
          </button>

          {/* Scrollable review cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 flex-1"
            style={{ scrollbarWidth: "none" }}
          >
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="flex-none w-[220px] sm:w-[240px] snap-start rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden shadow-sm"
              >
                {/* Top image — experience photo used as review card header */}
                <div className="relative h-[120px]">
                  <Image
                    src={review.photo}
                    alt="Review photo"
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                </div>

                {/* Card body */}
                <div className="p-3">
                  {/* Avatar row */}
                  <div className="flex items-center gap-2 mb-2">
                    {/* Avatar initials fallback — no dedicated avatar image available */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[var(--color-primary)] flex-none border-2 border-white shadow flex items-center justify-center">
                      <span className="text-white text-xs font-bold leading-none">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-foreground)] leading-none">
                        {review.name}
                      </p>
                      <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                        {review.date}
                      </p>
                    </div>
                  </div>

                  <StarRating />

                  <p className="mt-1.5 text-sm font-bold text-[var(--color-foreground)]">
                    {review.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-muted-foreground)] line-clamp-3 leading-relaxed">
                    {review.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll reviews right"
            className="flex-none w-9 h-9 rounded-full border border-[var(--color-border)] bg-white shadow-sm flex items-center justify-center hover:bg-[var(--color-muted)] transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-[var(--color-foreground)]" />
          </button>
        </div>
      </div>
    </section>
  );
}
