"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  TourItineraryDayItem,
  type ItineraryDay,
} from "@/components/sections/tour-detail/tour-itinerary-day-item";

const ITINERARY_DATA: ItineraryDay[] = [
  {
    title: "Destination 1",
    details: [
      "DETAILED ITINERARY [08:00 AM - Pickup from hotel in Ho Chi Minh City]",
      "DETAILED ITINERARY [09:30 AM - Visit Cu Chi Tunnels historical site]",
      "DETAILED ITINERARY [12:00 PM - Traditional Vietnamese lunch at local restaurant]",
      "DETAILED ITINERARY [02:00 PM - Explore local markets and craft villages]",
      "DETAILED ITINERARY [05:00 PM - Return to hotel, free evening]",
    ],
    images: [
      "/images/tour-1-floating-market.png",
      "/images/tour-2-hoi-an.png",
    ],
    accommodation: "Saigon Grand Hotel",
    meals: "Breakfast and Lunch",
    included: [
      "Hotel pickup and drop-off",
      "English-speaking guide",
      "Lunch at local restaurant",
      "Entrance fees",
    ],
    excluded: [
      "Personal expenses",
      "Travel insurance",
      "Tips and gratuities",
    ],
  },
  {
    title: "Destination 2",
    details: [
      "DETAILED ITINERARY [06:00 AM - Early morning departure to Mekong Delta]",
      "DETAILED ITINERARY [08:30 AM - Boat ride through floating markets]",
      "DETAILED ITINERARY [11:00 AM - Visit coconut candy workshop]",
      "DETAILED ITINERARY [01:00 PM - Lunch on a river island]",
      "DETAILED ITINERARY [04:00 PM - Return to Ho Chi Minh City]",
    ],
    images: [
      "/images/tour-3-mekong.png",
      "/images/tour-4-palm-trees.png",
    ],
    accommodation: "Mekong Riverside Lodge",
    meals: "Breakfast and Lunch",
    included: [
      "Boat ride through canals",
      "Fruit tasting at orchard",
      "All transportation",
      "Professional guide",
    ],
    excluded: [
      "Drinks during meals",
      "Optional activities",
      "Souvenir purchases",
    ],
  },
  {
    title: "Destination 3",
    details: [
      "DETAILED ITINERARY [07:00 AM - Check out and transfer to airport]",
      "DETAILED ITINERARY [09:00 AM - Flight to Danang (not included)]",
      "DETAILED ITINERARY [11:00 AM - Explore Hoi An Ancient Town]",
      "DETAILED ITINERARY [02:00 PM - Lantern making workshop]",
      "DETAILED ITINERARY [06:00 PM - Farewell dinner with traditional music]",
    ],
    images: [
      "/images/tour-2-hoi-an.png",
      "/images/tour-1-floating-market.png",
    ],
    accommodation: "Hoi An Heritage Hotel",
    meals: "Breakfast, Lunch, and Dinner",
    included: [
      "Airport transfer",
      "Hoi An walking tour",
      "Lantern workshop",
      "Farewell dinner",
    ],
    excluded: [
      "Domestic flight ticket",
      "Personal shopping",
      "Mini-bar charges",
    ],
  },
];

export function TourItinerarySection() {
  const [openDays, setOpenDays] = useState<Set<number>>(
    () => new Set(ITINERARY_DATA.map((_, i) => i))
  );

  const allOpen = openDays.size === ITINERARY_DATA.length;

  function toggleAll() {
    if (allOpen) {
      setOpenDays(new Set());
    } else {
      setOpenDays(new Set(ITINERARY_DATA.map((_, i) => i)));
    }
  }

  function toggleDay(index: number) {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="rounded-xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-[#1D1D1D]">Itinerary</h2>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1 text-[14px] font-medium text-[#3BBCB7] hover:text-[#2fa09b] transition-colors"
        >
          {allOpen ? "Collapse all" : "Expand all"}
          {allOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Timeline container */}
      <div className="relative pl-[12px] border-l-2 border-[#3BBCB7]">
        {ITINERARY_DATA.map((day, i) => (
          <TourItineraryDayItem
            key={i}
            day={day}
            index={i}
            isOpen={openDays.has(i)}
            onToggle={() => toggleDay(i)}
            isLast={i === ITINERARY_DATA.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
