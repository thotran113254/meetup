"use client";

import { useState } from "react";
import { ChevronDown, AlertTriangle } from "lucide-react";

const STAR_OPTIONS = ["3 STAR", "4 STAR", "5 STAR"];
const ADULT_OPTIONS = ["1", "2", "3", "4", "5", "6"];
const CHILD_OPTIONS = ["0", "1", "2", "3"];
const STAY_OPTIONS = ["3 Days", "4 Days", "5 Days", "7 Days", "10 Days"];

/** Styled select dropdown matching Figma spec */
function SelectField({
  label,
  options,
  placeholder = "Select",
  value,
  onChange,
}: {
  label: string;
  options: string[];
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label className="text-[12px] text-[#828282]">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[40px] border border-[#ECECEC] rounded-[12px] px-3 text-[12px] text-[#1D1D1D] appearance-none bg-white cursor-pointer focus:outline-none focus:border-[#3BBCB7]"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828282] pointer-events-none" />
      </div>
    </div>
  );
}

/** Travel Budget Planner card — interactive form with total calculation */
export function TourBudgetPlanner() {
  const [starLevel, setStarLevel] = useState("");
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  const [stay, setStay] = useState("");

  /* Simple estimate: base price per star * (adults + children*0.5) * days */
  const basePrices: Record<string, number> = {
    "3 STAR": 150,
    "4 STAR": 200,
    "5 STAR": 280,
  };
  const days = parseInt(stay) || 0;
  const numAdults = parseInt(adults) || 0;
  const numChildren = parseInt(children) || 0;
  const base = basePrices[starLevel] || 0;
  const total = base * (numAdults + numChildren * 0.5) * days;

  return (
    <div className="bg-white rounded-[12px] p-[20px] flex flex-col gap-3" style={{ boxShadow: "0 0 40px rgba(0,0,0,0.06)" }}>
      <h3 className="text-[14px] font-bold text-[#1D1D1D]">Travel Budget Planner</h3>

      {/* Star level dropdown */}
      <SelectField
        label="Your option"
        options={STAR_OPTIONS}
        placeholder="3 STAR"
        value={starLevel}
        onChange={setStarLevel}
      />

      {/* Three selects in a row */}
      <div className="flex gap-2">
        <SelectField label="Number of Adult" options={ADULT_OPTIONS} value={adults} onChange={setAdults} />
        <SelectField label="Number of Child" options={CHILD_OPTIONS} value={children} onChange={setChildren} />
        <SelectField label="Length of stay" options={STAY_OPTIONS} value={stay} onChange={setStay} />
      </div>

      {/* Total bar */}
      <div className="flex items-center justify-between bg-[#3BBCB7] rounded-[8px] h-[40px] px-4">
        <span className="text-white text-[14px]">Total around:</span>
        <span className="text-white text-[21px] font-bold">${total.toLocaleString()}</span>
      </div>

      {/* Important Notice */}
      <div className="bg-[#F8F8F8] rounded-[12px] p-[10px] flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-[18px] h-[18px] text-[#6B5420] flex-none" />
          <span className="text-[14px] font-bold text-[#1D1D1D]">Important Notice:</span>
        </div>
        <ul className="text-[12px] text-[#1D1D1D] leading-[1.6] list-disc pl-4 flex flex-col gap-1">
          <li>All refund requests must be submitted <span className="font-bold">in writing</span> via email.</li>
          <li>Refunds will be processed within <span className="font-bold">7-10 business days</span> after approval.</li>
          <li>Non-refundable deposits and service fees <span className="font-bold">are not eligible</span> for refund.</li>
        </ul>
      </div>
    </div>
  );
}
