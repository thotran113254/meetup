"use client";

/**
 * ServicesSection — "Service phụ" horizontal carousel.
 * 4 service cards with real images, snap-scroll and prev/next arrow navigation.
 * Client component for scroll interactivity.
 */

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

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
  const { ref: scrollRef, scroll } = useHorizontalScroll(280);

  return (
    <section className="py-10 md:py-14 bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mb-6">
          Service phụ
        </h2>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow border border-[var(--color-border)] flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--color-foreground)]" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="snap-start flex-shrink-0 w-60 rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Service image */}
                <div className="relative w-full h-44">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                  {/* Price badge */}
                  <span className="absolute bottom-3 left-3 bg-white/90 text-[var(--color-foreground)] text-sm font-semibold px-2 py-0.5 rounded">
                    From {service.price}
                  </span>
                </div>

                {/* Service name */}
                <div className="p-3 bg-[var(--color-card)]">
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{service.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow border border-[var(--color-border)] flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-[var(--color-foreground)]" />
          </button>
        </div>
      </div>
    </section>
  );
}
