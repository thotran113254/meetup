"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

/**
 * ReviewsSection — Tripadvisor-branded review carousel.
 * Figma: "4.9" in text-[78.9px] teal, Tripadvisor white card (176x60),
 * review cards w-[241px] bg-[#F8F8F8] rounded-[12px], top photo h-[136px],
 * 32px avatar + green badge, 5 gold stars, bold title, body h-[71px] overflow-hidden.
 * Arrows: bg-black/50 40px round.
 */

type Review = {
  id: number;
  name: string;
  date: string;
  title: string;
  body: string;
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

function StarRating() {
  return (
    <div className="flex gap-0.5 shadow-[0_0_32px_rgba(0,0,0,0.08)]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-[#FACC15] text-[#FACC15]" />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const { ref: scrollRef, scroll } = useHorizontalScroll(257); // 241px card + 16px gap

  return (
    <section className="py-[50px] bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Score + Tripadvisor branding row */}
        <div className="flex items-center gap-4 mb-8">
          {/* Large score */}
          <span className="text-[78.9px] font-bold leading-none text-[#3BBCB7]">4.9</span>

          {/* "on" label + Tripadvisor white card */}
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-bold text-[var(--color-foreground)]">on</span>
            {/* Tripadvisor white card — 176x60, shadow */}
            <div className="bg-white shadow-[0_0_40px_rgba(0,0,0,0.06)] rounded-[12px] w-[176px] h-[60px] flex items-center justify-center gap-2 px-4">
              <div className="w-8 h-8 rounded-full bg-[#34E0A1] flex items-center justify-center flex-none">
                <span className="text-white text-[10px] font-black leading-none">ta</span>
              </div>
              <span className="text-sm font-bold text-[#1D1D1D]">Tripadvisor</span>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll reviews left"
            className="absolute -left-10 top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Scrollable review cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="flex-none w-[241px] snap-start rounded-[12px] bg-[#F8F8F8] overflow-hidden"
              >
                {/* Top image — h-[136px], rounded top corners */}
                <div className="relative h-[136px] rounded-t-[12px] overflow-hidden">
                  <Image
                    src={review.photo}
                    alt="Review photo"
                    fill
                    className="object-cover"
                    sizes="241px"
                  />
                </div>

                {/* Card body */}
                <div className="p-3">
                  {/* Avatar row */}
                  <div className="flex items-center gap-2 mb-2">
                    {/* 32px avatar with green Tripadvisor badge */}
                    <div className="relative flex-none">
                      <div className="w-8 h-8 rounded-full bg-[#3BBCB7] flex items-center justify-center overflow-hidden">
                        <span className="text-white text-xs font-bold leading-none">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      {/* Green badge — bottom-right of avatar */}
                      <div className="absolute -bottom-0.5 -right-0.5 bg-[#33E0A0] size-[20px] rounded-full border-[1.25px] border-white flex items-center justify-center">
                        <span className="text-white text-[6px] font-black leading-none">ta</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#1D1D1D] leading-none">{review.name}</p>
                      <p className="text-[10px] text-[#7D7D7D] mt-0.5">{review.date}</p>
                    </div>
                  </div>

                  <StarRating />

                  <p className="mt-1.5 text-[14px] font-bold text-[#333]">{review.title}</p>

                  {/* Body — h-[71px] overflow hidden, decorative scrollbar track on right */}
                  <div className="relative mt-1">
                    <div className="h-[71px] overflow-hidden pr-3">
                      <p className="text-[12px] text-[#7D7D7D] leading-relaxed">{review.body}</p>
                    </div>
                    {/* Decorative scrollbar track — 4px wide, right side */}
                    <div className="absolute top-0 right-0 w-[4px] h-[88px] bg-white rounded-full -mt-2">
                      <div className="w-[4px] h-[54.7px] bg-[#D9D9D9] rounded-full mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll reviews right"
            className="absolute -right-10 top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
