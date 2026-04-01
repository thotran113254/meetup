"use client";

import { Heart } from "lucide-react";

/**
 * Sticky bottom bar for mobile tour detail page.
 * Shows total price info + Book now CTA + wishlist heart.
 * Hidden on lg+ screens where the sidebar is visible.
 */
export function TourMobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_0_40px_rgba(0,0,0,0.06)] px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        {/* Price info — left */}
        <div className="flex flex-col gap-[2px]">
          <span className="text-[10px] text-[#828282] leading-[1.5]">Total</span>
          <span className="text-[16px] font-bold text-[#1D1D1D] leading-[1.3] tracking-[0.32px]">
            $1300.02
          </span>
          <span className="text-[10px] font-medium text-[#828282] leading-none">
            (21.456.000 VND)
          </span>
        </div>

        {/* Actions — right */}
        <div className="flex items-center gap-2">
          <button className="w-[101px] h-[40px] bg-[#3BBCB7] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#2fa9a4] transition-colors cursor-pointer">
            Book now
          </button>
          <button
            className="w-[40px] h-[40px] bg-[#EBF8F8] rounded-[12px] flex items-center justify-center hover:bg-[#d5f0f0] transition-colors cursor-pointer"
            aria-label="Add to wishlist"
          >
            <Heart className="w-6 h-6 text-[#194F4D]" />
          </button>
        </div>
      </div>
    </div>
  );
}
