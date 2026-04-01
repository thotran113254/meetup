"use client";

import { Heart } from "lucide-react";

/**
 * Sticky bottom bar for mobile tour detail page.
 * Shows "View price" CTA + wishlist heart button.
 * Hidden on lg+ screens where the sidebar is visible.
 */
export function TourMobileBottomBar() {
  function scrollToPricing() {
    const el = document.getElementById("tour-pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_0_40px_rgba(0,0,0,0.06)] px-4 py-3 lg:hidden">
      <div className="flex gap-[6px] items-start">
        <button
          onClick={scrollToPricing}
          className="flex-1 h-[40px] bg-[#3BBCB7] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#2fa9a4] transition-colors cursor-pointer"
        >
          View price
        </button>
        <button
          className="w-[40px] h-[40px] bg-[#EBF8F8] rounded-[12px] flex items-center justify-center hover:bg-[#d5f0f0] transition-colors cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart className="w-6 h-6 text-[#194F4D]" />
        </button>
      </div>
    </div>
  );
}
