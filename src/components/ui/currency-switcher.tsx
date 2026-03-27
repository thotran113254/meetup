"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

const CURRENCIES = [
  { code: "USD", label: "US Dollar" },
  { code: "VND", label: "Vietnamese Dong" },
  { code: "EUR", label: "Euro" },
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
 * CurrencySwitcher — Dropdown popup for currency selection.
 * Figma: PC 205x333, positioned below the currency icon button.
 * Triangle pointer at top, list of currencies with checkmark on active.
 */
export function CurrencySwitcher({ open, onClose, selected, onSelect }: CurrencySwitcherProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
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
      {/* Triangle pointer */}
      <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white ml-auto mr-4" />

      {/* Dropdown card */}
      <div className="w-[205px] bg-white rounded-[12px] shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#ECECEC]">
          <p className="text-xs font-bold text-[#1D1D1D] tracking-wide">Convert currency units</p>
        </div>
        <div className="py-1">
          {CURRENCIES.map((currency) => (
            <button
              key={currency.code}
              onClick={() => { onSelect(currency.code); onClose(); }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-[#1D1D1D] hover:bg-[#F8F8F8] transition-colors"
            >
              <span className={selected === currency.code ? "font-bold" : "font-normal"}>
                {currency.code}
              </span>
              {selected === currency.code && (
                <Check className="w-4 h-4 text-[#3BBCB7]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
