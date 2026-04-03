import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-animations";
import type { VietnamStat } from "@/lib/types/tours-cms-types";

/**
 * VietnamIntroSection — "Introduce About Vietnam" on /tours page.
 * Figma node 13561:7611 (desktop) / 13802:10561 (mobile 375px).
 *
 * Mobile: title → [stats-left + map-right] → video full-width → description
 * Desktop: overlapping layout — title+Vietnam+stats left, map center full-height, video+desc right
 *
 * Accepts optional CMS props; falls back to hardcoded defaults when not provided.
 */

const FALLBACK_STATS: VietnamStat[] = [
  {
    id: 1,
    value: "20 Million",
    description: "Historical record of international arrivals reached in December 2025",
  },
  {
    id: 2,
    value: "#1 Growth",
    description: "Ranked the fastest-growing tourism destination in Asia by UN Tourism",
  },
  {
    id: 3,
    value: "9 Consecutive Years",
    description: 'The only nation to be "Asia\'s Best Golf Destination" since 2017',
  },
];

const FALLBACK_DESCRIPTION =
  "Lorem ipsum dolor sit amet consectetur. Scelerisque fermentum aliquet convallis turpis lectus orci arcu ultrices viverra. Vitae ut nam adipiscing nunc sed at. Arcu sem sed arcu lacus. Sed lacus semper eu lectus fermentum eu a.Lorem ipsum dolor sit amet consectetur. Scelerisque fermentum aliquet convallis turpis lectus orci arcu ultrices viverra. Vitae ut nam adipiscing nunc sed at. Arcu sem sed";

type Props = {
  stats?: VietnamStat[];
  description?: string;
};

export function VietnamIntroSection({ stats = FALLBACK_STATS, description = FALLBACK_DESCRIPTION }: Props) {
  const displayStats = stats.length > 0 ? stats : FALLBACK_STATS;
  const displayDescription = description || FALLBACK_DESCRIPTION;

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          {/* Desktop: relative container, map spans full height */}
          <div className="flex flex-col lg:relative lg:min-h-[460px]">
            {/* ─── Title: Introduce / about / Vietnam ─── */}
            <div className="lg:w-[42%] lg:relative lg:z-10">
              <div className="flex flex-col gap-[5px] lg:gap-3 pl-0">
                <p
                  className="text-gradient-gold text-[15px] lg:text-[37px] font-medium uppercase leading-[0.92]"
                  style={{ fontFamily: "var(--font-phudu), 'Phudu', sans-serif" }}
                >
                  Introduce
                </p>
                <p
                  className="text-gradient-gold text-[15px] lg:text-[37px] font-medium leading-[0.92]"
                  style={{ fontFamily: "var(--font-phudu), 'Phudu', sans-serif" }}
                >
                  about
                </p>
              </div>
              <h2
                className="text-gradient-red text-[47px] lg:text-[112px] leading-[0.92] mt-1 lg:mt-4"
                style={{ fontFamily: "var(--font-script), 'Dancing Script', cursive" }}
              >
                Vietnam
              </h2>
            </div>

            {/* ─── Mobile: stats-left + map-right side by side ─── */}
            <div className="flex gap-4 mt-6 lg:hidden">
              {/* Stats stacked vertically on mobile */}
              <div className="flex flex-col gap-6 w-[127px] shrink-0">
                {displayStats.map((stat) => (
                  <div key={stat.id} className="flex flex-col gap-1">
                    <p className="text-[14px] font-bold text-[#1D1D1D] leading-[1.3] tracking-[0.32px]">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-[#828282] leading-[1.5]">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
              {/* Map on right side */}
              <div className="relative flex-1 h-[307px]">
                <Image
                  src="/images/ban-do-viet-nam.png"
                  alt="Map of Vietnam with tour destinations"
                  fill
                  className="object-contain object-top"
                  sizes="233px"
                />
              </div>
            </div>

            {/* ─── Mobile: video + description full-width ─── */}
            <div className="flex flex-col gap-5 mt-6 lg:hidden">
              <div className="relative w-full h-[191px] rounded-[12px] overflow-hidden">
                <Image
                  src="/images/vietnam-intro-video-thumb.png"
                  alt="Vietnam travel highlights video"
                  fill
                  className="object-cover"
                  sizes="343px"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="56" height="40" viewBox="0 0 68 48" fill="none">
                    <path d="M66.52 7.74C65.77 4.83 63.48 2.54 60.57 1.79C55.24 0.36 34 0.36 34 0.36C34 0.36 12.76 0.36 7.43 1.79C4.52 2.54 2.23 4.83 1.48 7.74C0.05 13.07 0.05 24.18 0.05 24.18C0.05 24.18 0.05 35.29 1.48 40.62C2.23 43.53 4.52 45.82 7.43 46.57C12.76 48 34 48 34 48C34 48 55.24 48 60.57 46.57C63.48 45.82 65.77 43.53 66.52 40.62C67.95 35.29 67.95 24.18 67.95 24.18C67.95 24.18 67.95 13.07 66.52 7.74Z" fill="#FF0000" />
                    <path d="M27.16 34.28L44.84 24.18L27.16 14.08V34.28Z" fill="white" />
                  </svg>
                </div>
              </div>
              <p className="text-[12px] leading-[1.5] text-[#828282]">
                {displayDescription}
              </p>
            </div>

            {/* ─── Desktop only: stats below Vietnam ─── */}
            <div className="hidden lg:flex gap-[24px] lg:relative lg:z-10 mt-10">
              {displayStats.map((stat) => (
                <div key={stat.id} className="w-[170px] shrink-0 flex flex-col gap-2">
                  <p className="text-[16px] font-bold text-[#1D1D1D] leading-[1.3] tracking-[0.32px]">
                    {stat.value}
                  </p>
                  <p className="text-[12px] text-[#828282] leading-[1.5]">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* ─── Desktop only: map full-height center ─── */}
            <div className="hidden lg:block lg:absolute lg:left-[30%] lg:top-0 lg:bottom-0 lg:w-[35%]">
              <div className="relative w-full h-full">
                <Image
                  src="/images/ban-do-viet-nam.png"
                  alt="Map of Vietnam with tour destinations"
                  fill
                  className="object-contain object-top"
                  sizes="460px"
                />
              </div>
            </div>

            {/* ─── Desktop only: video + description right ─── */}
            <div className="hidden lg:flex lg:flex-col lg:gap-5 lg:absolute lg:right-0 lg:top-0 lg:w-[33%]">
              <div className="relative w-full h-[256px] rounded-[12px] overflow-hidden">
                <Image
                  src="/images/vietnam-intro-video-thumb.png"
                  alt="Vietnam travel highlights video"
                  fill
                  className="object-cover"
                  sizes="458px"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="56" height="40" viewBox="0 0 68 48" fill="none">
                    <path d="M66.52 7.74C65.77 4.83 63.48 2.54 60.57 1.79C55.24 0.36 34 0.36 34 0.36C34 0.36 12.76 0.36 7.43 1.79C4.52 2.54 2.23 4.83 1.48 7.74C0.05 13.07 0.05 24.18 0.05 24.18C0.05 24.18 0.05 35.29 1.48 40.62C2.23 43.53 4.52 45.82 7.43 46.57C12.76 48 34 48 34 48C34 48 55.24 48 60.57 46.57C63.48 45.82 65.77 43.53 66.52 40.62C67.95 35.29 67.95 24.18 67.95 24.18C67.95 24.18 67.95 13.07 66.52 7.74Z" fill="#FF0000" />
                    <path d="M27.16 34.28L44.84 24.18L27.16 14.08V34.28Z" fill="white" />
                  </svg>
                </div>
              </div>
              <p className="text-[12px] leading-[1.5] text-[#828282]">
                {displayDescription}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
