import { ScrollReveal } from "@/components/ui/scroll-animations";
import type { DestinationFeatureItem } from "@/lib/types/destinations-cms-types";

type Props = { features?: DestinationFeatureItem[] };

/**
 * DestinationFeaturesSection — 4 gradient feature cards.
 * Data from CMS (site_settings: destinations_features).
 * Returns null when no features provided.
 */
export function DestinationFeaturesSection({ features }: Props) {
  if (!features || features.length === 0) return null;

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {features.map((feature, idx) => (
              <div
                key={`${feature.title}-${idx}`}
                className="rounded-xl p-3 md:p-6 flex flex-col gap-3 md:gap-[30px]"
                style={{ background: "linear-gradient(to bottom, #EBF8F8 0%, white 100%)" }}
              >
                <img
                  src={feature.icon}
                  alt=""
                  className="size-12 md:size-14 shrink-0 object-contain"
                />
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xs md:text-base font-bold text-[var(--color-foreground)] leading-[1.3] tracking-[0.32px]">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-[var(--color-muted-foreground)] leading-[1.5] tracking-[0.035px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
