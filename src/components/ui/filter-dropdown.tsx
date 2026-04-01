"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

type FilterOption = {
  value: string;
  label: string;
};

type FilterDropdownProps = {
  open: boolean;
  onClose: () => void;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
};

/**
 * FilterDropdown — Custom popup for Style/Duration filters.
 * Figma: white bg, border #BDBDBD, rounded-12px, p-12px, gap-12px,
 * dividers (h-px bg-#1D1D1D/5), selected teal + check, unselected dark.
 */
export function FilterDropdown({
  open,
  onClose,
  options,
  selected,
  onSelect,
}: FilterDropdownProps) {
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
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#BDBDBD] rounded-xl p-3 flex flex-col gap-3 overflow-clip"
      style={{ minWidth: "180px" }}
    >
      {options.map((option, i) => (
        <div key={option.value}>
          <button
            onClick={() => { onSelect(option.value); onClose(); }}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <span
              className={`font-bold text-[14px] leading-[1.3] tracking-[0.14px] ${
                selected === option.value ? "text-[#3BBCB7]" : "text-[#1D1D1D]"
              }`}
            >
              {option.label}
            </span>
            {selected === option.value && (
              <Check className="w-5 h-5 text-[#3BBCB7] flex-none" />
            )}
          </button>
          {/* Divider — between items, not after last */}
          {i < options.length - 1 && (
            <div className="h-px bg-[#1D1D1D]/5 w-full mt-3" />
          )}
        </div>
      ))}
    </div>
  );
}

/** Preset options for the Style filter dropdown */
export const STYLE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "cuisine", label: "Cuisine" },
  { value: "motorbike", label: "Motorbike" },
  { value: "car", label: "Car" },
  { value: "jeep", label: "Jeep car" },
];

/** Preset options for the Duration filter dropdown */
export const DURATION_OPTIONS: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "lt5", label: "< 5 Days" },
  { value: "5-7", label: "5-7 Days" },
  { value: "gt7", label: "> 7 Days" },
];
