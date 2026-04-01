"use client";

import { Minus, Plus } from "lucide-react";
import type { QuantityItem, ServiceItem } from "@/lib/validations/checkout-schema";

/** Single row with label, price, count, +/- buttons */
function CounterRow({
  label,
  subtitle,
  price,
  count,
  onDecrement,
  onIncrement,
}: {
  label: string;
  subtitle?: string;
  price?: number;
  count: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-[12px] font-bold text-[#1D1D1D] leading-[1.3]">{label}</span>
        {subtitle && (
          <span className="text-[10px] text-[#828282] leading-[1.5]">{subtitle}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {price !== undefined && (
          <span className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px]">
            ${price}
          </span>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDecrement}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label={`Decrease ${label}`}
          >
            <Minus className="w-4 h-4 text-[#1D1D1D]" />
          </button>
          <span className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px] w-5 text-center">
            {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={onIncrement}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label={`Increase ${label}`}
          >
            <Plus className="w-4 h-4 text-[#1D1D1D]" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Quantity selector — list of counter rows for guest types */
export function QuantitySelector({
  title,
  maxLabel,
  items,
  onUpdate,
}: {
  title: string;
  maxLabel: string;
  items: QuantityItem[];
  onUpdate: (index: number, count: number) => void;
}) {
  return (
    <div className="bg-white rounded-[8px] md:rounded-[12px] p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px] flex-1">
          {title}
        </span>
        <span className="text-[12px] text-[#828282] text-right">{maxLabel}</span>
      </div>
      <div className="bg-[#F8F8F8] rounded-[6px] px-[10px] py-2 flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`}>
            {i > 0 && <div className="h-px bg-[#1D1D1D]/5 mb-2" />}
            <CounterRow
              label={item.label}
              price={item.price}
              count={item.count}
              onDecrement={() => onUpdate(i, Math.max(0, item.count - 1))}
              onIncrement={() => onUpdate(i, item.count + 1)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Additional services selector */
export function ServiceSelector({
  title,
  maxLabel,
  items,
  onUpdate,
}: {
  title: string;
  maxLabel: string;
  items: ServiceItem[];
  onUpdate: (index: number, count: number) => void;
}) {
  return (
    <div className="bg-white rounded-[8px] md:rounded-[12px] p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] flex flex-col gap-3 overflow-hidden">
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px] flex-1">
          {title}
        </span>
        <span className="text-[12px] text-[#828282] text-right">{maxLabel}</span>
      </div>
      <div className="bg-[#F8F8F8] rounded-[6px] px-[10px] py-2 flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={item.label}>
            {i > 0 && <div className="h-px bg-[#1D1D1D]/5 mb-2" />}
            <CounterRow
              label={item.label}
              subtitle={item.description}
              count={item.count}
              onDecrement={() => onUpdate(i, Math.max(0, item.count - 1))}
              onIncrement={() => onUpdate(i, item.count + 1)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
