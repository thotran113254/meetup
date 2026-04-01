"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-animations";

type FaqItem = { question: string; answer: string };

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What to bring",
    answer:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's",
  },
  {
    question: "Where to stay",
    answer:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
  },
  {
    question: "What working",
    answer:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
  },
  {
    question: "Where to going",
    answer:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
  },
  {
    question: "What to bring",
    answer:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's",
  },
  {
    question: "What working",
    answer:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
  },
  {
    question: "What working",
    answer:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
  },
  {
    question: "Where to going",
    answer:
      "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
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
