import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * Feature cards data — 4 unique selling points.
 * Figma desktop: 13854:15354, mobile: 13856:60455.
 */
const FEATURES = [
  {
    icon: "/images/destinations/icon-itinerary.svg",
    title: "Customized Itineraries",
    description:
      'No more boring tours. Our local experts chat with you to build a trip that\'s 100% "you"—from hidden gems to your favorite vibes',
  },
  {
    icon: "/images/destinations/icon-experience.svg",
    title: "The Ultimate Customer Experience",
    description:
      "New country, no stress! We're more than just guides, we're your local besties on speed dial, making sure you feel right at home in Vietnam",
  },
  {
    icon: "/images/destinations/icon-tech.svg",
    title: "Tech Enhanced Travel",
    description:
      "We use smart tech to keep your trip organized, minimizing hiccups and making sure every one of your personal notes is at our fingertips",
  },
  {
    icon: "/images/destinations/icon-language.svg",
    title: "Zero Language Barriers",
    description:
      'No "lost in translation" moments here! Our team is 100% fluent in English and ready to chat or call whenever you need',
  },
];

/**
 * DestinationFeaturesSection — 4 gradient feature cards in a row (desktop)
 * or 2x2 grid (mobile). Each card has icon, title, description.
 */
export function DestinationFeaturesSection() {
  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl p-3 md:p-6 flex flex-col gap-3 md:gap-[30px]"
                style={{
                  background:
                    "linear-gradient(to bottom, #EBF8F8 0%, white 100%)",
                }}
              >
                {/* Icon — SVG files, use <img> directly */}
                <img
                  src={feature.icon}
                  alt=""
                  className="size-12 md:size-14 shrink-0 object-contain"
                />

                {/* Text */}
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
