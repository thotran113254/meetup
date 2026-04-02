"use client";

import { useState, useCallback } from "react";
import { Minus, Plus, Heart } from "lucide-react";

/**
 * ServicePricingSidebar — Sticky booking sidebar for service detail page.
 * Allows selecting passenger quantities and additional services.
 * Desktop: right-column sticky panel. Mobile: hidden (bottom bar takes over).
 * Figma: node 13845:17231
 */

type PassengerType = {
  id: string;
  label: string;
  unitPrice: number;
};

type AdditionalService = {
  id: string;
  label: string;
  unitPrice: number;
};

const PASSENGER_TYPES: PassengerType[] = [
  { id: "adult-armed", label: "Adult - Armed", unitPrice: 29 },
  { id: "adult-arrived", label: "Adult - Arrived", unitPrice: 29 },
  { id: "child-armed", label: "Child - Armed", unitPrice: 29 },
  { id: "child-arrived", label: "Child - Arrived", unitPrice: 29 },
  { id: "infant-armed", label: "Infant - Armed", unitPrice: 29 },
  { id: "infant-arrived", label: "Infant - Arrived", unitPrice: 29 },
  { id: "senior-armed", label: "Senior - Armed", unitPrice: 29 },
];

const ADDITIONAL_SERVICES: AdditionalService[] = [
  { id: "extra-5day", label: "Extra 5/day", unitPrice: 15 },
  { id: "extra-3day", label: "Extra 3/day", unitPrice: 10 },
  { id: "extra-1day", label: "Extra 1/day", unitPrice: 5 },
  { id: "extra-lounge", label: "Lounge access", unitPrice: 25 },
  { id: "extra-transfer", label: "Private transfer", unitPrice: 35 },
  { id: "extra-sim", label: "eSIM card", unitPrice: 8 },
];

function QuantityRow({
  label,
  quantity,
  onDecrement,
  onIncrement,
}: {
  label: string;
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-[6px]">
      <span className="text-[12px] text-[#828282] flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          className="w-6 h-6 rounded-full border border-[#ECECEC] flex items-center justify-center text-[#1D1D1D] hover:bg-[#F8F8F8] transition-colors cursor-pointer"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-[13px] font-bold text-[#1D1D1D] w-5 text-center">
          {quantity}
        </span>
        <button
          onClick={onIncrement}
          className="w-6 h-6 rounded-full border border-[#ECECEC] flex items-center justify-center text-[#1D1D1D] hover:bg-[#F8F8F8] transition-colors cursor-pointer"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function SidebarCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-none md:rounded-[12px] p-4 md:p-5 flex flex-col gap-2 shadow-[0_0_40px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  );
}

export function ServicePricingSidebar() {
  const [passengerQty, setPassengerQty] = useState<Record<string, number>>(
    () => Object.fromEntries(PASSENGER_TYPES.map((p) => [p.id, 0]))
  );
  const [addOnQty, setAddOnQty] = useState<Record<string, number>>(
    () => Object.fromEntries(ADDITIONAL_SERVICES.map((s) => [s.id, 0]))
  );

  const changePassenger = useCallback((id: string, delta: number) => {
    setPassengerQty((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  }, []);

  const changeAddOn = useCallback((id: string, delta: number) => {
    setAddOnQty((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  }, []);

  const passengerTotal = PASSENGER_TYPES.reduce(
    (sum, p) => sum + p.unitPrice * (passengerQty[p.id] ?? 0),
    0
  );
  const addOnTotal = ADDITIONAL_SERVICES.reduce(
    (sum, s) => sum + s.unitPrice * (addOnQty[s.id] ?? 0),
    0
  );
  const total = passengerTotal + addOnTotal;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Passenger quantity card */}
      <SidebarCard>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[14px] font-bold text-[#1D1D1D]">Quantity</h3>
          <span className="text-[10px] text-[#828282]">Please select at most 1000</span>
        </div>
        <div className="bg-[#F8F8F8] rounded-[6px] px-[10px] py-[4px] divide-y divide-[#ECECEC]">
          {PASSENGER_TYPES.map((p) => (
            <QuantityRow
              key={p.id}
              label={p.label}
              quantity={passengerQty[p.id] ?? 0}
              onDecrement={() => changePassenger(p.id, -1)}
              onIncrement={() => changePassenger(p.id, 1)}
            />
          ))}
        </div>
      </SidebarCard>

      {/* Additional services card */}
      <SidebarCard>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[14px] font-bold text-[#1D1D1D]">Additional service</h3>
          <span className="text-[10px] text-[#828282]">Please select at most 1</span>
        </div>
        <div className="bg-[#F8F8F8] rounded-[6px] px-[10px] py-[4px] divide-y divide-[#ECECEC]">
          {ADDITIONAL_SERVICES.map((s) => (
            <QuantityRow
              key={s.id}
              label={`${s.label} — $${s.unitPrice}`}
              quantity={addOnQty[s.id] ?? 0}
              onDecrement={() => changeAddOn(s.id, -1)}
              onIncrement={() => changeAddOn(s.id, 1)}
            />
          ))}
        </div>
      </SidebarCard>

      {/* Action bar: total + book now + wishlist */}
      <div className="flex items-center justify-between px-4 md:px-5 py-3 bg-white rounded-none md:rounded-[12px] shadow-[0_0_40px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-[2px]">
          <span className="text-[10px] text-[#828282] leading-[1.5]">Total</span>
          <span className="text-[18px] font-bold text-[#1D1D1D] leading-[1.3]">
            ${total > 0 ? total : 150}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-[40px] px-6 bg-[#3BBCB7] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#2fa9a4] transition-colors cursor-pointer">
            Book now
          </button>
          <button
            className="w-[40px] h-[40px] bg-[#EBF8F8] rounded-[12px] flex items-center justify-center hover:bg-[#d5f0f0] transition-colors cursor-pointer"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5 text-[#194F4D]" />
          </button>
        </div>
      </div>
    </div>
  );
}
