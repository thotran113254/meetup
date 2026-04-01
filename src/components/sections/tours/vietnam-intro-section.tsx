import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * VietnamIntroSection — "Introduce About Vietnam" section on /tours page.
 * Desktop: 3-column (title+Vietnam | map | video+desc) with stats row below.
 * Matches Figma node 13561:7611.
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
          {/* Main 3-column layout */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-0">
            {/* Left column — title + "Vietnam" */}
            <div className="lg:w-[42%] lg:shrink-0">
              {/* Gold gradient title: Introduce / about */}
              <div className="flex flex-col gap-3">
                <p
                  className="text-gradient-gold text-[24px] lg:text-[37px] font-medium uppercase leading-[0.92]"
                  style={{ fontFamily: "var(--font-phudu), 'Phudu', sans-serif" }}
                >
                  Introduce
                </p>
                <p
                  className="text-gradient-gold text-[24px] lg:text-[37px] font-medium leading-[0.92]"
                  style={{ fontFamily: "var(--font-phudu), 'Phudu', sans-serif" }}
                >
                  about
                </p>
              </div>

              {/* "Vietnam" — large red/orange gradient script */}
              <h2
                className="text-gradient-red text-[56px] md:text-[80px] lg:text-[112px] leading-[0.92] mt-2 lg:mt-4"
                style={{ fontFamily: "var(--font-script), 'Dancing Script', cursive" }}
              >
                Vietnam
              </h2>
            </div>

            {/* Center column — Vietnam map */}
            <div className="relative h-[320px] lg:h-[460px] lg:w-[25%] lg:shrink-0 mt-6 lg:mt-0 mx-auto lg:mx-0">
              <Image
                src="/images/ban-do-viet-nam.png"
                alt="Map of Vietnam with tour destinations"
                fill
                className="object-contain object-top"
                sizes="(max-width: 1024px) 300px, 460px"
              />
            </div>

            {/* Right column — video thumbnail + description */}
            <div className="flex flex-col gap-5 mt-6 lg:mt-0 lg:w-[33%] lg:shrink-0 lg:ml-auto">
              {/* Video thumbnail with YouTube play button */}
              <div className="relative w-full h-[200px] lg:h-[256px] rounded-[12px] overflow-hidden">
                <Image
                  src="/images/vietnam-intro-video-thumb.png"
                  alt="Vietnam travel highlights video"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 458px"
                />
                {/* YouTube play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    width="56"
                    height="40"
                    viewBox="0 0 68 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M66.52 7.74C65.77 4.83 63.48 2.54 60.57 1.79C55.24 0.36 34 0.36 34 0.36C34 0.36 12.76 0.36 7.43 1.79C4.52 2.54 2.23 4.83 1.48 7.74C0.05 13.07 0.05 24.18 0.05 24.18C0.05 24.18 0.05 35.29 1.48 40.62C2.23 43.53 4.52 45.82 7.43 46.57C12.76 48 34 48 34 48C34 48 55.24 48 60.57 46.57C63.48 45.82 65.77 43.53 66.52 40.62C67.95 35.29 67.95 24.18 67.95 24.18C67.95 24.18 67.95 13.07 66.52 7.74Z"
                      fill="#FF0000"
                    />
                    <path d="M27.16 34.28L44.84 24.18L27.16 14.08V34.28Z" fill="white" />
                  </svg>
                </div>
              </div>

              {/* Description text */}
              <p className="text-[11px] lg:text-[12px] leading-[1.5] text-[#828282]">
                Lorem ipsum dolor sit amet consectetur. Scelerisque fermentum
                aliquet convallis turpis lectus orci arcu ultrices viverra.
                Vitae ut nam adipiscing nunc sed at. Arcu sem sed arcu lacus.
                Sed lacus semper eu lectus fermentum eu a.Lorem ipsum dolor sit
                amet consectetur. Scelerisque fermentum aliquet convallis turpis
                lectus orci arcu ultrices viverra. Vitae ut nam adipiscing nunc
                sed at. Arcu sem sed
              </p>
            </div>
          </div>

          {/* Stats row — separate row below, aligned left */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 mt-6 lg:mt-8">
            {STATS.map((stat) => (
              <div key={stat.value} className="w-full sm:w-[170px]">
                <p className="text-[14px] lg:text-[16px] font-bold text-[#1D1D1D] leading-[1.3] tracking-[0.32px]">
                  {stat.value}
                </p>
                <p className="text-[10px] lg:text-[12px] text-[#828282] leading-[1.5] mt-1 lg:mt-2">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
