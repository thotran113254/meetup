"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * ServicesSection — "Service phụ" horizontal carousel.
 * Figma: 4 service cards 338x338, full-image bg, rounded-xl,
 * teal gradient price badge overlay, service name below image.
 * Arrows: bg-black/50 40px round, same style as TourPackageSection.
 */

type ServiceCard = {
  id: number;
  name: string;
  price: string;
  image: string;
};

const SERVICES: ServiceCard[] = [
  { id: 1, name: "Fast track service", price: "$669", image: "/images/service-fast-track.png" },
  { id: 2, name: "eVisa service", price: "$669", image: "/images/service-evisa.png" },
  { id: 3, name: "Airport Pickup service", price: "$669", image: "/images/service-airport-pickup.png" },
  { id: 4, name: "eSim service", price: "$669", image: "/images/service-esim.png" },
];

export function ServicesSection() {
  const { ref: scrollRef, scroll } = useHorizontalScroll(354); // 338px + 16px gap

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.05px] md:tracking-[0.08px] text-[var(--color-foreground)] mb-5 md:mb-6">
            Service phụ
          </h2>
        </ScrollReveal>

        {/* Carousel wrapper */}
        <ScrollReveal delay={0.15}>
        <div className="relative">
          {/* Left arrow — hidden on mobile */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-2 lg:-left-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-2 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
          >
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="snap-start flex-none w-[294px] h-[294px] md:w-[338px] md:h-[338px] rounded-xl overflow-hidden cursor-pointer group relative"
              >
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="338px"
                />
                {/* Dark gradient overlay — Figma: h-172, from transparent to foreground */}
                <div className="absolute bottom-0 left-0 w-full h-[172px] bg-gradient-to-b from-transparent to-[var(--color-foreground)]" />
                {/* Price badge + service name — positioned at bottom with p-4 */}
                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-2">
                  <div
                    className="inline-flex items-center gap-1 px-[6px] py-[5px] rounded-[4px] w-fit"
                    style={{ background: "linear-gradient(260.3deg, #3BBCB7 20%, #B1FFFC 71%)" }}
                  >
                    <span className="text-[0.625rem] font-medium leading-[1.3] text-[var(--color-foreground)]/50">
                      From
                    </span>
                    <span className="text-xl font-bold text-[var(--color-secondary-foreground)] leading-[1.2] tracking-[0.05px]">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-xs font-bold leading-[1.3] text-white truncate">
                    {service.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow — hidden on mobile */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-2 lg:-right-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
