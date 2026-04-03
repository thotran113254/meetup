import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * DestinationIntroSection — "Introduce about [City]" spotlight.
 * Figma desktop: 13854:57363.
 * Left: gold gradient title + city name in script font + description.
 * Right: map/image placeholder.
 */
export function DestinationIntroSection() {
  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* Left: Title + city name + description */}
            <div className="flex-1 flex flex-col gap-4 lg:gap-6">
              {/* "Introduce about" in gold gradient */}
              <div className="flex flex-col gap-1 lg:gap-3">
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

              {/* City name in script font with red gradient */}
              <h2
                className="text-gradient-red text-[47px] lg:text-[112px] leading-[0.92]"
                style={{ fontFamily: "var(--font-script), 'Dancing Script', cursive" }}
              >
                Hanoi
              </h2>

              {/* Description */}
              <p className="text-xs leading-[1.5] text-[var(--color-muted-foreground)] max-w-[574px]">
                Lorem ipsum dolor sit amet consectetur. Scelerisque fermentum
                aliquet convallis turpis lectus orci arcu ultrices viverra.
                Vitae ut nam adipiscing nunc sed at. Arcu sem sed arcu lacus.
                Sed lacus semper eu lectus fermentum eu a. Lorem ipsum dolor sit
                amet consectetur. Scelerisque fermentum aliquet convallis turpis
                lectus orci arcu ultrices viverra. Vitae ut nam adipiscing nunc
                sed at. Arcu sem sed a. Lorem ipsum dolor sit amet consectetur.
                Scelerisque fermentum aliquet convallis turpis lectus orci arcu
                ultrices viverra. Vitae ut nam adipiscing nunc sed at. Arcu sem sed
              </p>
            </div>

            {/* Right: Map placeholder */}
            <div className="w-full lg:w-[692px] shrink-0 aspect-[692/453] bg-[#D9D9D9] rounded-xl relative overflow-hidden">
              <Image
                src="/images/vietnam-map.png"
                alt="Map of Hanoi destination"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 692px"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
