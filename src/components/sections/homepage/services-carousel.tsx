"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { ScrollReveal } from "@/components/ui/scroll-animations";

export type ServiceItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  slug?: string;
};

type Props = { services: ServiceItem[] };

/**
 * ServicesCarousel — client component: horizontally scrollable service cards.
 * Receives data as props from the server wrapper (services-section.tsx).
 */
export function ServicesCarousel({ services }: Props) {
  const { ref: scrollRef, scroll } = useHorizontalScroll(354); // 338px + 16px gap

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.05px] md:tracking-[0.08px] text-[var(--color-foreground)] mb-5 md:mb-6">
            Dịch vụ bổ sung
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="relative">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="hidden md:flex absolute left-2 lg:-left-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-2 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
            >
              {services.map((service) => (
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
                  <div className="absolute bottom-0 left-0 w-full h-[172px] bg-gradient-to-b from-transparent to-[var(--color-foreground)]" />
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
