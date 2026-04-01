"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

const CURRENCIES = [
  { code: "VND", label: "Vietnamese Dong" },
  { code: "EUR", label: "Euro" },
  { code: "USD", label: "US Dollar" },
  { code: "GBP", label: "British Pound" },
  { code: "JPY", label: "Japanese Yen" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "KRW", label: "Korean Won" },
];

type CurrencySwitcherProps = {
  open: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (code: string) => void;
};

/**
 * CurrencySwitcher — Currency selection popup per Figma node 14343:90533.
 * Sticky header "Convert currency units", scrollable list with dividers,
 * selected item in teal (#2A8582) with checkmark.
 */
export function CurrencySwitcher({ open, onClose, selected, onSelect }: CurrencySwitcherProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 z-50">
      {/* Triangle pointer — top right */}
      <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white ml-auto mr-4" />

      <div className="w-[205px] bg-white rounded-xl shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Sticky header */}
        <div className="p-4 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)]">
          <p className="font-bold text-[14px] text-[#1D1D1D] tracking-[0.14px] leading-[1.3]">
            Convert currency units
          </p>
        </div>

        {/* Scrollable currency list */}
        <div className="max-h-[260px] overflow-y-auto px-4 pb-4 pt-3 flex flex-col gap-3">
          {CURRENCIES.map((currency, i) => (
            <div key={currency.code + i}>
              <button
                onClick={() => { onSelect(currency.code); onClose(); }}
                className="w-full flex items-center justify-between cursor-pointer"
              >
                <span
                  className={`font-bold text-[14px] leading-[1.3] tracking-[0.14px] ${
                    selected === currency.code ? "text-[#2A8582]" : "text-[#828282]"
                  }`}
                >
                  {currency.code}
                </span>
                {selected === currency.code && (
                  <Check className="w-5 h-5 text-[#2A8582] flex-none" />
                )}
              </button>
              {i < CURRENCIES.length - 1 && (
                <div className="h-px bg-[#1D1D1D]/5 w-full mt-3" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
