"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * ServicesFeaturesSection — 4 "Why Choose Us" feature cards.
 * Each card: gradient bg (#EBF8F8 → white), 56px icon, bold title, description.
 * Desktop: 4 columns. Mobile: 2 columns grid.
 * Figma: node 14621:93664
 */

type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    id: "customized",
    icon: "/images/feature-customized-itinerary.svg",
    title: "Customized Itineraries",
    description:
      "No more boring tours. Our local experts chat with you to build a trip that's 100% \"you\"\u2014from hidden gems to your favorite vibes",
  },
  {
    id: "experience",
    icon: "/images/feature-customer-experience.svg",
    title: "The Ultimate Customer Experience",
    description:
      "New country, no stress! We're more than just guides, we're your local besties on speed dial, making sure you feel right at home in Vietnam",
  },
  {
    id: "tech",
    icon: "/images/feature-tech-travel.svg",
    title: "Tech Enhanced Travel",
    description:
      "We use smart tech to keep your trip organized, minimizing hiccups and making sure every one of your personal notes is at our fingertips",
  },
  {
    id: "language",
    icon: "/images/feature-zero-language.svg",
    title: "Zero Language Barriers",
    description:
      "No \"lost in translation\" moments here! Our team is 100% fluent in English and ready to chat or call whenever you need",
  },
];

export function ServicesFeaturesSection() {
  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-[100px]">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col gap-5 md:gap-[30px] p-4 md:p-6 rounded-xl bg-gradient-to-b from-[#EBF8F8] to-white"
              >
                {/* Icon */}
                <div className="relative w-10 h-10 md:w-14 md:h-14 shrink-0">
                  <Image
                    src={feature.icon}
                    alt=""
                    fill
                    className="object-contain"
                    aria-hidden="true"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm md:text-base font-bold leading-[1.3] tracking-[0.32px] text-[var(--color-foreground)]">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#828282] leading-[1.5] tracking-[0.035px]">
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
