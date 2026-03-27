"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

/**
 * ServicesSection — "Service phụ" horizontal carousel.
 * Figma: 4 service cards 338x338, full-image bg, rounded-[12px],
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
    <section className="py-[50px] bg-[var(--color-background)]">
      <div className="container-wide">
        <h2 className="text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)] mb-6">
          Service phụ
        </h2>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Left arrow — bg-black/50, 40px round */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-2 lg:-left-10 top-[169px] -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="snap-start flex-none w-[338px] rounded-[12px] overflow-hidden cursor-pointer group"
              >
                {/* Image area 338x338 with gradient overlay + price badge */}
                <div className="relative w-[338px] h-[338px]">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="338px"
                  />
                  {/* Bottom gradient for readability */}
                  <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Teal gradient price badge — bottom-left */}
                  <div
                    className="absolute bottom-3 left-3 flex items-center gap-0.5 px-[6px] py-[5px] rounded-[4px]"
                    style={{ background: "linear-gradient(260.5deg, #3BBCB7 20%, #B1FFFC 71%)" }}
                  >
                    <span className="text-[10px] font-medium leading-[1.3]" style={{ color: "rgba(29,29,29,0.5)" }}>
                      From
                    </span>
                    <span className="text-[20px] font-bold text-[#194F4D] leading-[1.2]">
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* Service name below image */}
                <div className="px-4 py-3 bg-[var(--color-background)]">
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">
                    {service.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow — bg-black/50, 40px round */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-2 lg:-right-10 top-[169px] -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
