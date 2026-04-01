"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronRight, Star } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-animations";

type Review = {
  id: string;
  photo: string;
  avatar: string;
  name: string;
  date: string;
  rating: number;
  title: string;
  description: string;
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
    name: "Alex M",
    date: "2023-11-20",
    rating: 5,
    title: "Excelence",
    description:
      "Amazing experience! The tour guide was incredibly knowledgeable and friendly. Every detail was well-organized from start to finish. Highly recommend for anyone visiting Vietnam.",
  },
  {
    id: "r2",
    photo: "/images/tour-1-floating-market.png",
    avatar: "/images/review-avatar.jpg",
    name: "Sarah L",
    date: "2023-10-15",
    rating: 5,
    title: "Unforgettable Trip",
    description:
      "One of the best tours I have ever taken. The floating market experience was surreal and the food was incredible. Would definitely book again with this company.",
  },
  {
    id: "r3",
    photo: "/images/tour-2-hoi-an.png",
    avatar: "/images/review-avatar.jpg",
    name: "James K",
    date: "2023-09-28",
    rating: 5,
    title: "Perfect Vacation",
    description:
      "Everything exceeded our expectations. The hotels were wonderful, transportation was seamless, and our guide made the history come alive. A truly memorable journey.",
  },
  {
    id: "r4",
    photo: "/images/tour-3-mekong.png",
    avatar: "/images/review-avatar.jpg",
    name: "Emily W",
    date: "2023-08-12",
    rating: 5,
    title: "Highly Recommend",
    description:
      "Professional service from booking to the last day. The Mekong Delta cruise was the highlight. Great value for money compared to other tour operators in the area.",
  },
];

/** Single review card — 241x320px */
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex-none w-[241px] h-[320px] rounded-[12px] overflow-hidden bg-white snap-start" style={{ boxShadow: "0 0 20px rgba(0,0,0,0.06)" }}>
      {/* Photo area */}
      <div className="relative w-full h-[160px]">
        <Image src={review.photo} alt={review.title} fill className="object-cover" sizes="241px" />
      </div>
      {/* Content */}
      <div className="p-3 flex flex-col gap-2">
        {/* Author row */}
        <div className="flex items-center gap-2">
          <Image src={review.avatar} alt={review.name} width={40} height={40} className="rounded-full object-cover size-[40px]" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#1D1D1D] truncate">{review.name}</p>
            <p className="text-[12px] text-[#828282]">{review.date}</p>
          </div>
          {/* TripAdvisor logo placeholder */}
          <Image src="/images/tripadvisor-logo.png" alt="TripAdvisor" width={20} height={20} className="flex-none" />
        </div>
        {/* Stars */}
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#FEC84B] text-[#FEC84B]" />
          ))}
        </div>
        {/* Title + description */}
        <p className="text-[14px] font-bold text-[#1D1D1D]">{review.title}</p>
        <p className="text-[12px] text-[#828282] leading-[1.5] line-clamp-3">{review.description}</p>
      </div>
    </div>
  );
}

export function TourDetailReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  return (
    <ScrollReveal>
      <div className="bg-white rounded-[12px] p-[20px] flex flex-col gap-4" style={{ boxShadow: "0 0 40px rgba(0,0,0,0.06)" }}>
        <h2 className="text-[20px] font-bold text-[#1D1D1D]">Reviews</h2>
        <div className="relative">
          {/* Scroll container */}
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide">
            {REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          {/* Gradient fade overlay on right */}
          <div className="absolute top-0 right-0 w-[149px] h-full pointer-events-none bg-gradient-to-l from-white to-transparent" />
          {/* Scroll arrow */}
          <button
            onClick={scrollRight}
            aria-label="Scroll reviews"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center cursor-pointer z-10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}
