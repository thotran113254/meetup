import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * VietnamIntroSection — Introduces Vietnam with map, stats, video placeholder.
 *
 * Mobile (375px): title top → [stats left + map right side-by-side] → video full-width below
 * Desktop (1024px+): left column (title + map centered + stats bottom) + right column (video + desc)
 */

const STATS = [
  {
    value: "20 Million",
    description:
      "Historical record of international arrivals reached in December 2025",
  },
  {
    value: "#1 Growth",
    description:
      "Ranked the fastest-growing tourism destination in Asia by UN Tourism",
  },
  {
    value: "9 Consecutive Years",
    description:
      'The only nation to be "Asia\'s Best Golf Destination" since 2017',
  },
];

export function VietnamIntroSection() {
  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          {/* Title — always at top */}
          <div className="mb-4 lg:mb-0">
            <p className="text-[10px] lg:text-[12px] font-medium uppercase tracking-wider text-[var(--color-foreground)]">
              Introduce
            </p>
            <p className="text-[10px] lg:text-[12px] font-medium text-[var(--color-foreground)]">
              about
            </p>
            <h2
              className="text-[40px] md:text-[60px] lg:text-[100px] leading-[1] text-[var(--color-foreground)]"
              style={{ fontFamily: "'Italianno', cursive" }}
            >
              Vietnam
            </h2>
          </div>

          {/* Mobile: [Stats | Map] side by side. Desktop: complex positioning */}
          <div className="flex flex-col lg:flex-row lg:gap-0 lg:relative lg:min-h-[453px]">
            {/* Mobile: Stats + Map row */}
            <div className="flex gap-4 lg:flex-1 lg:relative">
              {/* Stats — stacked vertically on mobile, row at bottom-left on desktop */}
              <div className="flex flex-col gap-6 w-[127px] shrink-0 lg:absolute lg:bottom-0 lg:left-0 lg:w-[558px] lg:flex-row">
                {STATS.map((stat) => (
                  <div key={stat.value} className="lg:w-[170px]">
                    <p className="text-[14px] lg:text-[21px] font-bold text-[var(--color-foreground)] leading-[1.2]">
                      {stat.value}
                    </p>
                    <p className="text-[10px] lg:text-[12px] text-[#828282] leading-[1.5] mt-1 lg:mt-2">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Map — clip bottom to hide placeholder text */}
              <div className="relative flex-1 h-[307px] lg:w-[344px] lg:h-[453px] lg:absolute lg:left-[40%] lg:-translate-x-1/2 lg:top-0 overflow-hidden">
                <Image
                  src="/images/vietnam-map.png"
                  alt="Map of Vietnam with tour destinations"
                  fill
                  className="object-contain object-top"
                  sizes="(max-width: 1024px) 233px, 344px"
                />
                {/* Cover bottom area that may contain placeholder text */}
                <div className="absolute bottom-0 left-0 right-0 h-[35px] bg-[var(--color-background)]" />
              </div>
            </div>

            {/* Video + Description — full width on mobile, 458px right column on desktop */}
            <div className="mt-6 lg:mt-0 lg:w-[458px] lg:shrink-0">
              {/* Video/image placeholder */}
              <div className="relative w-full aspect-video lg:h-[256px] bg-[#D9D9D9] rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="M8 5v14l11-7L8 5z" fill="#1D1D1D" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description text */}
              <p className="mt-4 lg:mt-5 text-[12px] lg:text-[14px] leading-[1.5] tracking-[0.035px] text-[#828282]">
                Lorem ipsum dolor sit amet consectetur. Scelerisque fermentum
                aliquet convallis turpis lectus orci arcu ultrices viverra.
                Vitae ut nam adipiscing nunc sed at. Arcu sem sed arcu lacus.
                Sed lacus semper eu lectus fermentum eu a. Lorem ipsum dolor sit
                amet consectetur. Scelerisque fermentum aliquet convallis turpis
                lectus orci arcu ultrices viverra. Vitae ut nam adipiscing nunc
                sed at. Arcu sem sed
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
