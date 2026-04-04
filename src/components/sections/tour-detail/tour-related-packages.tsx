import { ChevronLeft, ChevronRight } from "lucide-react";
import { TourCard } from "@/components/ui/tour-card";
import { ScrollReveal } from "@/components/ui/scroll-animations";
import type { TourPackage } from "@/lib/types/tours-cms-types";

type Props = { relatedTours?: TourPackage[] };

export function TourRelatedPackages({ relatedTours }: Props) {
  if (!relatedTours || relatedTours.length === 0) return null;

  return (
    <section className="py-8 md:py-12 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-[100px] flex flex-col gap-4 md:gap-5">
        <ScrollReveal>
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] md:text-[32px] font-bold leading-[1.2] text-[#1D1D1D]">
              You Might Like These Packages
            </h2>
            <a href="/tours"
              className="bg-[#3BBCB7] text-white text-[14px] font-bold px-5 h-[40px] rounded-[12px] hover:bg-[#2fa9a4] transition-colors shrink-0 ml-4 flex items-center">
              View all
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="relative">
            <button aria-label="Previous"
              className="hidden md:flex absolute -left-5 lg:-left-[60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center z-10 cursor-pointer">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide md:grid md:grid-cols-4 md:gap-4">
              {relatedTours.map((tour) => (
                <TourCard key={tour.slug} {...tour}
                  className="group relative flex-none w-[294px] h-[294px] snap-start rounded-[12px] overflow-hidden block md:flex-initial md:w-full md:h-[360px]"
                />
              ))}
            </div>

            <button aria-label="Next"
              className="hidden md:flex absolute -right-5 lg:-right-[60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center z-10 cursor-pointer">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
