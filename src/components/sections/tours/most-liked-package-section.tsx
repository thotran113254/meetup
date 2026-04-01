"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  MapPin,
  X,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-animations";

type FeaturedTour = {
  id: string;
  image: string;
  title: string;
  price: number;
  duration: string;
  spots: number;
  tags: string[];
  flights: number;
  description: string;
};

const FEATURED_TOURS: FeaturedTour[] = [
  {
    id: "featured-1",
    image: "/images/tour-1-floating-market.png",
    title:
      "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    flights: 4,
    description:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's Lorem ipsum...",
  },
  {
    id: "featured-2",
    image: "/images/tour-2-hoi-an.png",
    title:
      "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    flights: 4,
    description:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
  },
];

/** Large featured card with image overlay and "Overall Plan" popup */
function FeaturedCard({
  tour,
  showOverlay,
}: {
  tour: FeaturedTour;
  showOverlay?: boolean;
}) {
  const [overlayOpen, setOverlayOpen] = useState(showOverlay ?? false);

  return (
    <div className="relative flex-none w-[294px] h-[294px] md:flex-1 md:w-auto md:h-[516px] snap-start rounded-xl overflow-hidden group">
      <Image
        src={tour.image}
        alt={tour.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 294px, 692px"
      />

      {/* Eye icon — top-right 36x36 white rounded */}
      <button className="absolute top-3.5 right-3.5 bg-white size-9 rounded-lg flex items-center justify-center z-10 cursor-pointer">
        <Eye className="w-5 h-5 text-[#1D1D1D]" />
      </button>

      {/* Gradient overlay — transparent to teal dark */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[206px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(59,188,183,0), rgba(35,113,110,0.74) 47%, #1B5654)",
        }}
      />

      {/* Bottom content — price, tags, title */}
      <div className="absolute bottom-0 left-0 w-full md:w-[338px] p-4 flex flex-col gap-2.5 z-10">
        <div
          className="flex items-center gap-0.5 px-1.5 py-[5px] rounded w-fit"
          style={{
            background:
              "linear-gradient(260.5deg, #3BBCB7 20%, #B1FFFC 71%)",
          }}
        >
          <span className="text-[10px] font-medium leading-[1.3] text-[#1D1D1D]/50">
            From
          </span>
          <span className="text-[20px] font-bold text-[#194F4D] leading-[1.2] tracking-[0.05px]">
            ${tour.price}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="bg-white rounded h-5 px-1 flex items-center gap-1 text-[10px] font-medium text-[#1D1D1D]">
            <Calendar className="w-3 h-3" />
            {tour.duration}
          </span>
          <span className="bg-white rounded h-5 px-1 flex items-center gap-1 text-[10px] font-medium text-[#1D1D1D]">
            <MapPin className="w-3 h-3" />
            {tour.spots} Spots
          </span>
          {tour.tags.map((tag) => (
            <span
              key={tag}
              className="bg-white rounded h-5 px-1 flex items-center gap-1 text-[10px] font-medium text-[#1D1D1D]"
            >
              <MapPin className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
        <p className="text-[12px] font-bold text-white leading-[1.3] truncate">
          {tour.title}
        </p>
      </div>

      {/* Overall Plan popup overlay — inside card */}
      {overlayOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-2.5 z-20">
          <div className="bg-white rounded-xl p-4 max-h-[344px] overflow-y-auto flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px]">
                Number of Domestic Flights:{" "}
                <span className="text-[#3BBCB7]">
                  {String(tour.flights).padStart(2, "0")}
                </span>
              </p>
              <button
                onClick={() => setOverlayOpen(false)}
                className="cursor-pointer"
              >
                <X className="w-6 h-6 text-[#1D1D1D]" />
              </button>
            </div>
            <div className="h-px bg-[#1D1D1D]/10" />
            <div>
              <p className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px] mb-1">
                Overall Plan
              </p>
              <p className="text-[14px] text-[#828282] leading-[1.5] tracking-[0.035px]">
                {tour.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MostLikedPackageSection() {
  return (
    <section className="py-8 md:py-12 bg-white relative">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-[100px] flex flex-col gap-4 md:gap-5">
        <ScrollReveal>
          <h2 className="text-[20px] md:text-[32px] font-bold leading-[1.2] text-[#1D1D1D]">
            Most Liked Package
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="relative">
            <button
              aria-label="Previous"
              className="hidden md:flex absolute -left-5 lg:-left-[60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center z-10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide md:overflow-visible md:snap-none">
              {FEATURED_TOURS.map((tour, i) => (
                <FeaturedCard
                  key={tour.id}
                  tour={tour}
                  showOverlay={i === 0}
                />
              ))}
            </div>

            <button
              aria-label="Next"
              className="hidden md:flex absolute -right-5 lg:-right-[60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center z-10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
