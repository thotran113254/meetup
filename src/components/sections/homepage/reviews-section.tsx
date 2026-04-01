"use client";

import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * ReviewsSection — Tripadvisor-branded review carousel.
 * Figma node: 13713:13730 "REVIEW TRIP"
 * Layout: centered score badge (4.9 on Tripadvisor) above a horizontal
 * card carousel with left/right nav arrows.
 */

type Review = {
  id: number;
  name: string;
  date: string;
  title: string;
  body: string;
  photo: string;
  avatar: string;
};

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Alex M",
    date: "2023-11-20",
    title: "Excelence",
    body: "Tigit works with the best freelance guides that we can find. Each guide we work with specializes in a specific niche. From the northern mountains to the southern coast, every trip is carefully crafted to deliver an authentic Vietnamese experience that you won't forget.",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
  {
    id: 2,
    name: "Sarah K",
    date: "2023-12-05",
    title: "Amazing trip!",
    body: "Great experience, highly recommend!",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
  {
    id: 3,
    name: "John D",
    date: "2024-01-15",
    title: "Unforgettable",
    body: "The tour was beyond our expectations. Our guide was incredibly knowledgeable about Vietnamese history and culture. The food stops were authentic and delicious. We visited hidden gems that we would never have found on our own. Absolutely worth every penny.",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
  {
    id: 4,
    name: "Maria L",
    date: "2024-02-10",
    title: "Perfect service",
    body: "Well organized, friendly staff.",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
  {
    id: 5,
    name: "Tom H",
    date: "2024-03-01",
    title: "Best tour ever",
    body: "Tigit works with the best freelance guides that we can find. Each guide we work with specializes in a specific niche. From the breathtaking Ha Giang loop to the serene Mekong Delta, this company delivers exceptional adventures every single time.",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
];

function StarRating() {
  return (
    <div
      className="flex gap-0.5"
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-[#FACC15] text-[#FACC15]" />
      ))}
    </div>
  );
}

/* Tripadvisor verified badge overlay on avatar */
function TripadvisorBadge() {
  return (
    <div className="absolute -bottom-0.5 -right-0.5 bg-[#33E0A0] size-5 rounded-full border-[1.25px] border-white flex items-center justify-center">
      <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
        <path
          d="M6 0C3.6 0 1.5 1.1 0 2.8h1.8C3 1.7 4.4 1 6 1s3 .7 4.2 1.8H12C10.5 1.1 8.4 0 6 0z"
          fill="white"
        />
        <circle cx="3.5" cy="6.5" r="2.5" stroke="white" strokeWidth="1" fill="none" />
        <circle cx="3.5" cy="6.5" r="1" fill="white" />
        <circle cx="8.5" cy="6.5" r="2.5" stroke="white" strokeWidth="1" fill="none" />
        <circle cx="8.5" cy="6.5" r="1" fill="white" />
      </svg>
    </div>
  );
}

/** Scrollable review body — custom scrollbar via DOM manipulation (no re-render on scroll) */
function ReviewBody({ title, body }: { title: string; body: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const TRACK_H = 88;
  const THUMB_H = 55;
  const MAX_OFFSET = TRACK_H - THUMB_H;

  /* After mount: check if content overflows and show/hide track */
  useEffect(() => {
    const el = contentRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    track.style.display = el.scrollHeight > el.clientHeight ? "block" : "none";
  }, [body]);

  /* On scroll: move thumb via transform — GPU-accelerated, no re-render */
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const thumb = thumbRef.current;
    if (!thumb) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    thumb.style.transform = `translateY(${(el.scrollTop / maxScroll) * MAX_OFFSET}px)`;
  }, []);

  return (
    <div className="flex justify-between h-[88px]">
      <div className="flex flex-col gap-0.5 w-[196px]">
        <p className="text-sm font-bold text-[var(--color-foreground)] leading-[1.3] tracking-[0.14px]">
          {title}
        </p>
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="h-[71px] overflow-y-auto scrollbar-hide"
        >
          <p className="text-xs text-[var(--color-muted-foreground)] leading-[1.5]">{body}</p>
        </div>
      </div>
      {/* Custom scrollbar track — hidden by default, useEffect shows if content overflows */}
      <div ref={trackRef} className="relative w-1 h-[88px]" style={{ display: "none" }}>
        <div className="absolute inset-0 w-1 bg-white rounded-[9px]" />
        <div
          ref={thumbRef}
          className="absolute top-0 w-1 bg-[var(--color-muted-foreground)] rounded-[9px] will-change-transform"
          style={{ height: THUMB_H }}
        />
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex-none w-[241px] snap-start rounded-xl bg-[var(--color-muted)] overflow-hidden">
      {/* Top photo */}
      <div className="relative h-[136px] rounded-xl overflow-hidden">
        <Image
          src={review.photo}
          alt="Review photo"
          fill
          className="object-cover"
          sizes="241px"
        />
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-3">
        {/* Avatar row */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-none">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={review.avatar}
                alt={review.name}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            <TripadvisorBadge />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--color-foreground)] leading-[1.3] tracking-[0.14px]">
              {review.name}
            </p>
            <p className="text-[0.625rem] text-[var(--color-muted-foreground)] leading-none">
              {review.date}
            </p>
          </div>
        </div>

        <StarRating />

        {/* Review content with functional custom scrollbar */}
        <ReviewBody title={review.title} body={review.body} />
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const { ref: scrollRef, scroll } = useHorizontalScroll(253); // 241px card + 12px gap

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        {/* Score + Tripadvisor badge — centered */}
        <ScrollReveal>
        <div className="flex items-center justify-center gap-3 mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/on-image.png" alt="4.9 on" className="h-[50px] md:h-[62px] w-auto" />
          <div className="bg-white shadow-[0_0_40px_rgba(0,0,0,0.06)] rounded-xl w-[140px] md:w-[176px] h-[48px] md:h-[60px] flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/tripadvisor-logo.png"
              alt="Tripadvisor"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
        </ScrollReveal>

        {/* Carousel with nav arrows */}
        <ScrollReveal delay={0.15}>
        <div className="relative">
          {/* Left arrow — hidden on mobile */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll reviews left"
            className="hidden md:flex absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Scrollable review cards — gap-3 matches Figma 12px */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 lg:px-0 scrollbar-hide"
          >
            {REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Right arrow — hidden on mobile */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll reviews right"
            className="hidden md:flex absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
