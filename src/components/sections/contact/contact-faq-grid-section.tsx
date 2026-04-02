import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FaqCategory {
  title: string;
  questions: string[];
  fullWidth?: boolean;
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "Booking Tours",
    questions: [
      "I am not able to travel right now, how can I still have a ToursByLocals experience?",
      "How are tours priced?",
      "How do I book a tour?",
    ],
  },
  {
    title: "General",
    questions: [
      "I am not able to travel right now, how can I still have a ToursByLocals experience?",
      "How are tours priced?",
      "How do I book a tour?",
    ],
  },
  {
    title: "Tour Guides",
    questions: [
      "I am not able to travel right now, how can I still have a ToursByLocals experience?",
      "How are tours priced?",
      "How do I book a tour?",
    ],
  },
  {
    title: "Payment, Cancellations and Refunds",
    questions: [
      "I am not able to travel right now, how can I still have a ToursByLocals experience?",
      "How are tours priced?",
      "How do I book a tour?",
    ],
  },
  {
    title: "Safety and Security",
    questions: [
      "I am not able to travel right now, how can I still have a ToursByLocals experience?",
      "How are tours priced?",
      "How do I book a tour?",
    ],
    fullWidth: true,
  },
];

function FaqCategoryCard({ category }: { category: FaqCategory }) {
  return (
    <div className="bg-white rounded-xl shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-5">
      <p className="text-[18px] sm:text-[20px] font-bold text-[#1D1D1D] leading-[1.2]">
        {category.title}
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-[#1D1D1D] opacity-5" />

      {category.questions.map((q, i) => (
        <div key={i}>
          <p className="text-[13px] sm:text-[14px] text-[#828282] leading-[1.5]">{q}</p>
          {i < category.questions.length - 1 && (
            <div className="w-full h-px bg-[#1D1D1D] opacity-5 mt-5" />
          )}
        </div>
      ))}

      <Link
        href="/faq"
        className="inline-flex items-center gap-2 h-10 px-6 bg-[#EBF8F8] text-[#3BBCB7] text-[14px] font-bold rounded-xl hover:bg-[#C2EAE9] transition-colors self-start"
      >
        See more
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/**
 * ContactFaqGridSection — FAQ categories in 2-column grid (last row full width).
 * Matches Figma design node 13934:24146.
 */
export function ContactFaqGridSection() {
  const paired = FAQ_CATEGORIES.filter((c) => !c.fullWidth);
  const fullWidthItems = FAQ_CATEGORIES.filter((c) => c.fullWidth);

  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-[100px] pt-6 sm:pt-10 pb-16">
      <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#1D1D1D] leading-[1.2] mb-6">
        Frequently Asking Questions
      </h2>

      <div className="flex flex-col gap-4">
        {/* 2-column rows */}
        {[0, 2].map((startIdx) => (
          <div key={startIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paired.slice(startIdx, startIdx + 2).map((cat) => (
              <FaqCategoryCard key={cat.title} category={cat} />
            ))}
          </div>
        ))}

        {/* Full-width rows */}
        {fullWidthItems.map((cat) => (
          <FaqCategoryCard key={cat.title} category={cat} />
        ))}
      </div>
    </section>
  );
}
