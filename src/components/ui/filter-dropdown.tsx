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
  /** Width of dropdown — style filters are 199px, duration filters 199px */
  width?: number;
};

/**
 * FilterDropdown — Reusable dropdown for Style and Duration filters.
 * Figma: Style filter 199x220, Duration filter 199x177.
 * Positioned below trigger, with checkmark on selected option.
 */
export function FilterDropdown({
  open,
  onClose,
  options,
  selected,
  onSelect,
  width = 199,
}: FilterDropdownProps) {
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
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 z-50 bg-white rounded-[12px] shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] overflow-hidden"
      style={{ width: `${width}px` }}
    >
      <div className="py-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => { onSelect(option.value); onClose(); }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-[#1D1D1D] hover:bg-[#F8F8F8] transition-colors"
          >
            <span className={selected === option.value ? "font-bold" : "font-normal"}>
              {option.label}
            </span>
            {selected === option.value && (
              <Check className="w-4 h-4 text-[#3BBCB7]" />
            )}
          </button>
        ))}
      </div>
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
