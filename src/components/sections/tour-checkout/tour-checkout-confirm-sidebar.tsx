"use client";

import { Heart, AlertTriangle } from "lucide-react";
import type { QuantityItem, ServiceItem } from "@/lib/validations/checkout-schema";

/** Info row — label: value */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1 items-start">
      <span className="text-[12px] text-[#828282] leading-[1.5] shrink-0">{label}:</span>
      <span className="text-[12px] text-[#1D1D1D] leading-[1.5]">{value}</span>
    </div>
  );
}

/** Cancellation policy yellow warning box */
function CancellationPolicy() {
  return (
    <div className="bg-[#FFFAED] rounded-[6px] p-[10px] flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-[18px] h-[18px] text-[#6B5420] shrink-0" />
        <span className="text-[14px] font-bold text-[#6B5420] tracking-[0.14px]">
          Cancellation policy:
        </span>
      </div>
      <p className="text-[12px] text-[#1D1D1D] leading-[1.5]">
        - Cancel at least <strong>07 days</strong> before departure date:{" "}
        <strong>charge 30%.</strong>
        <br />
        - Cancel at least <strong>03 days</strong> before departure date:{" "}
        <strong>charge 50%.</strong>
        <br />
        - Cancellation within <strong>1 - 2 days</strong> from departure date:{" "}
        <strong>charge 100%.</strong>
      </p>
    </div>
  );
}

type ConfirmSidebarProps = {
  tourTitle: string;
  departureDate: string;
  endDate: string;
  name: string;
  whatsapp: string;
  email: string;
  quantities: QuantityItem[];
  messenger: string;
  totalUsd: number;
  totalVnd: string;
  onBookNow: () => void;
};

/** Confirm information sidebar with booking summary */
export function TourCheckoutConfirmSidebar({
  tourTitle,
  departureDate,
  endDate,
  name,
  whatsapp,
  email,
  quantities,
  messenger,
  totalUsd,
  totalVnd,
  onBookNow,
}: ConfirmSidebarProps) {
  /* Count adults/children from quantities */
  const adultCount = quantities
    .filter((q) => q.label.toLowerCase() === "adult")
    .reduce((sum, q) => sum + q.count, 0);
  const childCount = quantities
    .filter((q) => q.label.toLowerCase() === "child")
    .reduce((sum, q) => sum + q.count, 0);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Confirm information card */}
      <div className="bg-white rounded-[12px] p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] flex flex-col gap-4 md:gap-5">
        <h2 className="text-[20px] font-bold leading-[1.2] text-[#1D1D1D]">
          Confirm information
        </h2>
        <div className="h-px bg-[#ECECEC]" />

        {/* Booking details */}
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px] leading-[1.3]">
            {tourTitle}
          </p>
          <div className="flex flex-col gap-1">
            {/* Dates */}
            <div className="flex items-center gap-3 flex-wrap">
              <InfoRow label="Departure date" value={departureDate} />
              <div className="w-px h-[14px] bg-[#ECECEC] rounded-full" />
              <InfoRow label="End date" value={endDate} />
            </div>
            <InfoRow label="Name" value={name || "—"} />
            <InfoRow label="Whatsapp number" value={whatsapp || "—"} />
            <InfoRow label="Email" value={email || "—"} />
            <InfoRow label="Adult" value={String(adultCount).padStart(2, "0")} />
            <InfoRow label="Children" value={String(childCount).padStart(2, "0")} />
            {messenger && (
              <div className="flex gap-1 items-start">
                <span className="text-[12px] text-[#828282] leading-[1.5] shrink-0">
                  Children:
                </span>
                <span className="text-[12px] text-[#1D1D1D] leading-[1.5]">
                  {messenger}
                </span>
              </div>
            )}
          </div>

          {/* Cancellation & terms */}
          <CancellationPolicy />
          <p className="text-[12px] text-[#828282] leading-[1.5]">
            After payment, you and your tour guide will receive each other&apos;s
            emails and WhatsApp to plan the trip in detail!
          </p>
          <p className="text-[12px] text-[#828282] leading-[1.5]">
            By continuing, you agree to Meetup&apos;s general terms and conditions
            and your activity provider&apos;s terms and conditions. Read more on
            the right of withdrawal and information on the applicable travel law.
          </p>

          {/* Payment icons */}
          <div className="flex gap-1">
            {["PCI DSS", "Mastercard", "Visa"].map((name) => (
              <div
                key={name}
                className="w-16 h-8 border border-[#ECECEC] rounded-[7px] flex items-center justify-center"
              >
                <span className="text-[8px] font-bold text-[#828282]">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Total + Book now bar — fixed on mobile, inline on desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white px-4 py-3 shadow-[0_-2px_20px_rgba(0,0,0,0.08)] md:relative md:rounded-[12px] md:p-5 md:shadow-[0_0_40px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[#828282] leading-[1.5]">Total</span>
            {/* Mobile: stacked price */}
            <div className="flex flex-col md:hidden">
              <span className="text-[16px] font-bold text-[#1D1D1D] tracking-[0.32px] leading-[1.3]">
                ${totalUsd.toFixed(2)}
              </span>
              <span className="text-[10px] font-medium text-[#828282]">
                ({totalVnd} VND)
              </span>
            </div>
            {/* Desktop: inline price */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[16px] font-bold text-[#1D1D1D] tracking-[0.32px]">
                ${totalUsd.toFixed(2)}
              </span>
              <div className="w-px h-[13px] bg-[#1D1D1D]/50 rounded-full" />
              <span className="text-[16px] font-bold text-[#1D1D1D] tracking-[0.32px]">
                {totalVnd} VND
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              onClick={onBookNow}
              className="h-10 px-8 bg-[var(--color-primary)] text-white text-[14px] font-bold rounded-[12px] hover:opacity-90 transition-opacity"
            >
              Book now
            </button>
            <button
              type="button"
              className="w-10 h-10 bg-[#EBF8F8] rounded-[12px] flex items-center justify-center hover:bg-[#D5F0EF] transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5 text-[var(--color-primary)]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
