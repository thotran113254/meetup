"use client";

import Image from "next/image";
import { Minus, Plus, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

export type ItineraryDay = {
  title: string;
  details: string[];
  images: string[];
  accommodation: string;
  meals: string;
  included: string[];
  excluded: string[];
};

interface TourItineraryDayItemProps {
  day: ItineraryDay;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

export function TourItineraryDayItem({
  day,
  index,
  isOpen,
  onToggle,
  isLast,
}: TourItineraryDayItemProps) {
  return (
    <div>
      {/* Timeline dot + day header */}
      <div className="flex items-start gap-4 relative">
        {/* Timeline dot */}
        <div className="relative z-10 w-6 h-6 rounded-full bg-[#3BBCB7] border-4 border-white shrink-0 -ml-[12px]" />

        {/* Day header */}
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full text-left"
          aria-expanded={isOpen}
        >
          <h3 className="text-[16px] font-bold text-[#1D1D1D]">
            DAY {index + 1} - {day.title}
          </h3>
          {isOpen ? (
            <Minus className="w-5 h-5 text-[#1D1D1D] shrink-0" />
          ) : (
            <Plus className="w-5 h-5 text-[#1D1D1D] shrink-0" />
          )}
        </button>
      </div>

      {/* Expandable content */}
      {isOpen && (
        <div className="ml-[12px] pl-4 border-l-2 border-transparent">
          <div className="mt-4 space-y-4">
            {/* Itinerary details */}
            <ul className="space-y-1.5 text-[14px] text-[#828282]">
              {day.details.map((detail, i) => (
                <li key={i}>- {detail}</li>
              ))}
            </ul>

            {/* Images with nav arrows */}
            <div className="flex gap-[14px]">
              {day.images.map((src, i) => (
                <div
                  key={i}
                  className="relative flex-1 aspect-[437/246] rounded-xl overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={`Day ${index + 1} photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="437px"
                  />
                  {/* Nav arrows */}
                  {i === 0 && (
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {i === day.images.length - 1 && (
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Meta info */}
            <div className="space-y-1.5 text-[14px]">
              <p>
                <span className="font-bold text-[#454545]">Accommodations:</span>{" "}
                <span className="text-[#828282]">{day.accommodation}</span>
              </p>
              <p>
                <span className="font-bold text-[#454545]">Meals Included:</span>{" "}
                <span className="text-[#828282]">{day.meals}</span>
              </p>
            </div>

            {/* Included / Excluded */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Included */}
              <div>
                <p className="text-[14px] font-bold text-[#454545] mb-2">
                  Included:
                </p>
                <div className="bg-[#F8F8F8] rounded-xl p-3 space-y-2">
                  {day.included.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[14px] text-[#828282]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3BBCB7] shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Excluded */}
              <div>
                <p className="text-[14px] font-bold text-[#454545] mb-2">
                  Excluded:
                </p>
                <div className="bg-[#F8F8F8] rounded-xl p-3 space-y-2">
                  {day.excluded.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[14px] text-[#828282]">
                      <XCircle className="w-3.5 h-3.5 text-[#E57373] shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Divider between days */}
      {!isLast && <div className="h-px bg-[#1D1D1D]/5 my-5 ml-[12px]" />}
    </div>
  );
}
