"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ChevronDown } from "lucide-react";

/**
 * ServiceProcessSection — Schedule/process steps for service detail page.
 * Each item is expandable, showing description text and photo grid.
 * Figma: node 13845:17201 left panel schedule section
 */

export type ProcessStep = {
  title: string;
  description: string;
  images: string[];
};

const DEFAULT_STEPS: ProcessStep[] = [
  {
    title: "Process FAST TRACK",
    description:
      "Meetup Travel's VIP Fast Track service, available at Tan Son Nhat, Noi Bai Da Nang, and Phu Quoc International airports, will make your trip to Vietnam more comfortable. You can skip long immigration lines and use the priority immigration lane for a smooth, hassle-free experience.\n\nFor ticket confirmation, please share your flight information and preferred meeting time for departing flights. Upon arrival, our friendly staff will greet you with a personalized sign and assist with all procedures. Whether you land in Ho Chi Minh City, Hanoi, Da Nang, or Phu Quoc, the Meetup team will help you start your journey easily, stress-free.",
    images: [
      "/images/service-fast-track.png",
      "/images/service-evisa.png",
      "/images/service-airport-pickup.png",
      "/images/service-esim.png",
    ],
  },
  {
    title: "Process FAST TRACK",
    description:
      "Meetup Travel's VIP Fast Track service, available at Tan Son Nhat, Noi Bai Da Nang, and Phu Quoc International airports, will make your trip to Vietnam more comfortable. You can skip long immigration lines and use the priority immigration lane for a smooth, hassle-free experience.\n\nFor ticket confirmation, please share your flight information and preferred meeting time for departing flights. Our friendly staff will greet you with a personalized sign and assist with all procedures.",
    images: [
      "/images/service-airport-pickup.png",
      "/images/service-evisa.png",
    ],
  },
  {
    title: "Process FAST TRACK",
    description:
      "Meetup Travel's VIP Fast Track service, available at Tan Son Nhat, Noi Bai Da Nang, and Phu Quoc International airports, will make your trip to Vietnam more comfortable. You can skip long immigration lines and use the priority immigration lane for a smooth, hassle-free experience.\n\nFor ticket confirmation, please share your flight information and preferred meeting time for departing flights. Our friendly staff will greet you with a personalized sign and assist with all procedures.",
    images: [
      "/images/service-fast-track.png",
      "/images/service-esim.png",
    ],
  },
];

function ProcessStepItem({
  step,
  isOpen,
  onToggle,
}: {
  step: ProcessStep;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const has4Images = step.images.length >= 4;

  return (
    <div className="border-b border-[#1D1D1D]/5 last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
      {/* Step header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left mb-2"
        aria-expanded={isOpen}
      >
        <h3 className="text-[14px] md:text-[16px] font-bold text-[#1D1D1D] tracking-[0.32px]">
          {step.title}
        </h3>
        <div className="p-1 shrink-0">
          {isOpen ? (
            <Minus className="w-5 h-5 text-[#1D1D1D]" />
          ) : (
            <Plus className="w-5 h-5 text-[#1D1D1D]" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="flex flex-col gap-3 mt-3">
          {/* Description text */}
          <p className="text-[13px] md:text-[14px] text-[#828282] leading-[1.6] whitespace-pre-line">
            {step.description}
          </p>

          {/* Photo grid: 4 images → 2x2, 2 images → 2 cols */}
          <div className={`grid gap-2 ${has4Images ? "grid-cols-2" : "grid-cols-2"}`}>
            {step.images.slice(0, 4).map((src, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/2]">
                <Image
                  src={src}
                  alt={`${step.title} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 430px"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ServiceProcessSection({ steps = DEFAULT_STEPS }: { steps?: ProcessStep[] }) {
  const [openSteps, setOpenSteps] = useState<Set<number>>(
    () => new Set(steps.map((_, i) => i))
  );

  const allOpen = openSteps.size === steps.length;

  function toggleAll() {
    setOpenSteps(allOpen ? new Set() : new Set(steps.map((_, i) => i)));
  }

  function toggleStep(index: number) {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="rounded-none md:rounded-xl p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-[16px] md:text-[20px] font-bold text-[#1D1D1D]">Schedule</h2>
        <button
          onClick={toggleAll}
          className="flex flex-col items-center text-[13px] md:text-[14px] font-bold text-[#1D1D1D] hover:text-[#2fa09b] transition-colors"
        >
          <span className="flex items-center gap-1">
            {allOpen ? "Collapse all" : "Expand all"}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${allOpen ? "" : "rotate-180"}`}
            />
          </span>
          <span className="w-full h-[2px] bg-[#1D1D1D] mt-0.5" />
        </button>
      </div>

      {/* Steps list */}
      <div>
        {steps.map((step, i) => (
          <ProcessStepItem
            key={i}
            step={step}
            isOpen={openSteps.has(i)}
            onToggle={() => toggleStep(i)}
          />
        ))}
      </div>
    </div>
  );
}
