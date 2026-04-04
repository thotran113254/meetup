import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-animations";

type Props = {
  introTitle?: string;
  city?: string;
  description?: string;
};

/**
 * DestinationIntroSection — "Introduce about [City]" spotlight.
 * Data from CMS (site_settings: destinations_page_content).
 * Returns null when no city name provided.
 */
export function DestinationIntroSection({ introTitle, city, description }: Props) {
  if (!city) return null;

  const titleWords = (introTitle || "Introduce about").split(" ");
  const mid = Math.ceil(titleWords.length / 2);
  const titleLine1 = titleWords.slice(0, mid).join(" ");
  const titleLine2 = titleWords.slice(mid).join(" ");

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* Left: title + city + description */}
            <div className="flex-1 flex flex-col gap-4 lg:gap-6">
              <div className="flex flex-col gap-1 lg:gap-3">
                <p
                  className="text-gradient-gold text-[15px] lg:text-[37px] font-medium uppercase leading-[0.92]"
                  style={{ fontFamily: "var(--font-phudu), 'Phudu', sans-serif" }}
                >
                  {titleLine1}
                </p>
                {titleLine2 && (
                  <p
                    className="text-gradient-gold text-[15px] lg:text-[37px] font-medium leading-[0.92]"
                    style={{ fontFamily: "var(--font-phudu), 'Phudu', sans-serif" }}
                  >
                    {titleLine2}
                  </p>
                )}
              </div>

              <h2
                className="text-gradient-red text-[47px] lg:text-[112px] leading-[0.92]"
                style={{ fontFamily: "var(--font-script), 'Dancing Script', cursive" }}
              >
                {city}
              </h2>

              {description && (
                <p className="text-xs leading-[1.5] text-[var(--color-muted-foreground)] max-w-[574px]">
                  {description}
                </p>
              )}
            </div>

            {/* Right: Vietnam map */}
            <div className="w-full lg:w-[692px] shrink-0 aspect-[692/453] bg-[#D9D9D9] rounded-xl relative overflow-hidden">
              <Image
                src="/images/vietnam-map.png"
                alt={`Map showing ${city} destination`}
                fill
                priority
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
