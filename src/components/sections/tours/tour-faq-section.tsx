"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-animations";

type FaqItem = { question: string; answer: string };

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I book a tour with Meetup Travel?",
    answer:
      "You can book directly through our website by selecting your desired tour and filling out the booking form, or contact us via WhatsApp, email, or phone. Our team will confirm your reservation within 24 hours and guide you through the payment process.",
  },
  {
    question: "What is included in the tour price?",
    answer:
      "Our tour prices typically include accommodation, meals as specified in the itinerary, local transportation, guided activities, and entrance fees. International flights are usually not included unless stated. Each tour page lists exactly what is covered.",
  },
  {
    question: "Can I customize my tour itinerary?",
    answer:
      "Absolutely! Meetup Travel specializes in tailor-made experiences. Contact our local experts and we will craft a personalized itinerary based on your interests, travel dates, group size, and budget.",
  },
  {
    question: "What is the cancellation and refund policy?",
    answer:
      "Cancellations made 30+ days before departure receive a full refund. Cancellations 15–29 days prior receive a 50% refund. Within 14 days of departure, tours are non-refundable. We recommend travel insurance to protect your booking.",
  },
  {
    question: "Are your tours suitable for families with children?",
    answer:
      "Yes, many of our tours are family-friendly and designed to be enjoyable for all ages. We offer dedicated family packages with child-friendly activities, flexible pacing, and accommodation suited for families. Please mention children's ages when booking.",
  },
  {
    question: "What should I pack for the tour?",
    answer:
      "Packing depends on the destination and season. Generally, we recommend comfortable walking shoes, lightweight clothing, sunscreen, insect repellent, and a valid passport. Detailed packing guides are provided in your pre-trip information email.",
  },
  {
    question: "Do I need a visa to travel to tour destinations?",
    answer:
      "Visa requirements vary by destination and your nationality. Our team can advise you on the necessary visas and provide guidance on the application process. We recommend checking requirements at least 4–6 weeks before your trip.",
  },
  {
    question: "How experienced are your local guides?",
    answer:
      "All Meetup Travel guides are certified local experts with deep knowledge of their region's culture, history, and hidden gems. They speak English fluently and are passionate about delivering authentic, memorable experiences for every traveler.",
  },
];

/** Single FAQ accordion item — custom implementation (no Radix) */
function FaqAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between pl-3 pr-2 py-3 rounded-xl cursor-pointer transition-colors ${
          isOpen ? "bg-[#3BBCB7]" : "bg-[#F3F3F3]"
        }`}
      >
        <span
          className={`text-[14px] font-bold leading-[1.3] tracking-[0.14px] text-left ${
            isOpen ? "text-white" : "text-[#1D1D1D]"
          }`}
        >
          {index}. {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : "text-[#1D1D1D]"
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-2 pb-3">
          <p className="text-[14px] text-[#828282] leading-[1.5] tracking-[0.035px]">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function TourFaqSection() {
  /* Default: first item in each column open */
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0, 4]));

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const leftColumn = FAQ_ITEMS.slice(0, 4);
  const rightColumn = FAQ_ITEMS.slice(4, 8);

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide flex flex-col gap-5">
        <ScrollReveal>
          <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)]">
            Frequently Asked Questions
          </h2>
        </ScrollReveal>

        {/* 2 columns on desktop, 1 column on mobile */}
        <ScrollReveal delay={0.15}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left column — items 1-4 */}
            <div className="flex-1 flex flex-col gap-2">
              {leftColumn.map((item, i) => (
                <FaqAccordionItem
                  key={`left-${i}`}
                  item={item}
                  index={i + 1}
                  isOpen={openItems.has(i)}
                  onToggle={() => toggleItem(i)}
                />
              ))}
            </div>

            {/* Right column — items 5-8 */}
            <div className="flex-1 flex flex-col gap-2">
              {rightColumn.map((item, i) => (
                <FaqAccordionItem
                  key={`right-${i}`}
                  item={item}
                  index={i + 5}
                  isOpen={openItems.has(i + 4)}
                  onToggle={() => toggleItem(i + 4)}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
