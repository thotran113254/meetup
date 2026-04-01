"use client";

import { AlertTriangle, Baby } from "lucide-react";
import { TourBudgetPlanner } from "./tour-budget-planner";

/** Price row — label left, price right */
function PriceRow({ label, price }: { label: string; price: string }) {
  return (
    <div className="flex items-center justify-between py-[8px]">
      <span className="text-[12px] text-[#828282]">{label}</span>
      <span className="text-[14px] font-bold text-[#1D1D1D]">{price}</span>
    </div>
  );
}

/** Price group — group tour or private tour */
function PriceGroup({ title, rows }: { title: string; rows: { label: string; price: string }[] }) {
  return (
    <div className="bg-[#F8F8F8] rounded-[6px] px-[10px] py-[8px]">
      <p className="text-[12px] font-bold text-[#1D1D1D] mb-1">{title}</p>
      {rows.map((row, i) => (
        <div key={row.label}>
          {i > 0 && <div className="h-px bg-[#ECECEC]" />}
          <PriceRow label={row.label} price={row.price} />
        </div>
      ))}
    </div>
  );
}

/** Card wrapper with consistent shadow */
function SidebarCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-none md:rounded-[12px] p-4 md:p-5 flex flex-col gap-2 shadow-[0_0_40px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  );
}

export function TourPricingSidebar() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Card 1: Price */}
      <SidebarCard>
        <h3 className="text-[14px] font-bold text-[#1D1D1D]">Price</h3>
        <div className="flex flex-col gap-2">
          <PriceGroup
            title="Group tour:"
            rows={[
              { label: "4-Star", price: "From $1800" },
              { label: "5-Star", price: "From $2000" },
            ]}
          />
          <PriceGroup
            title="Private tour:"
            rows={[
              { label: "4-Star", price: "From $2600" },
              { label: "5-Star", price: "From $2800" },
            ]}
          />
        </div>

        {/* Children policy */}
        <div className="bg-[#EBF8F8] rounded-[6px] p-[10px] flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Baby className="w-[18px] h-[18px] text-[#194F4D] flex-none" />
            <span className="text-[14px] font-bold text-[#194F4D]">Children policy:</span>
          </div>
          <ul className="text-[12px] text-[#1D1D1D] leading-[1.6] list-disc pl-4">
            <li>Children aged <span className="font-bold">6-9</span> are charged 75% of the adult rate.</li>
            <li>Children aged <span className="font-bold">10</span> and above are charged as adults.</li>
            <li>Children aged <span className="font-bold">2-5</span> are free (sharing bed with parents).</li>
          </ul>
        </div>

        {/* Cancellation policy */}
        <div className="bg-[#FFFAED] rounded-[6px] p-[10px] flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-[18px] h-[18px] text-[#6B5420] flex-none" />
            <span className="text-[14px] font-bold text-[#6B5420]">Cancellation policy:</span>
          </div>
          <ul className="text-[12px] text-[#1D1D1D] leading-[1.6] list-disc pl-4">
            <li>Cancel before <span className="font-bold">07 days</span>: charge <span className="font-bold">30%</span> of total.</li>
            <li>Cancel before <span className="font-bold">03 days</span>: charge <span className="font-bold">50%</span> of total.</li>
            <li>Cancel within <span className="font-bold">1 - 2 days</span>: charge <span className="font-bold">100%</span> of total.</li>
          </ul>
        </div>
      </SidebarCard>

      {/* Card 2: Additional Service */}
      <SidebarCard>
        <h3 className="text-[14px] font-bold text-[#1D1D1D]">Additional service</h3>
        <div className="bg-[#F8F8F8] rounded-[6px] px-[10px] py-[8px] flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#828282]">Vip Private tour</span>
            <span className="text-[14px] font-bold text-[#1D1D1D]">$25/guests</span>
          </div>
          <div className="h-px bg-[#ECECEC]" />
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#828282]">Book Scooter</span>
            <span className="text-[14px] font-bold text-[#1D1D1D]">$50/verhicle</span>
          </div>
        </div>
      </SidebarCard>

      {/* Card 3: Budget Planner (extracted component) */}
      <TourBudgetPlanner />

      {/* Action Buttons */}
      <div className="flex gap-[6px] px-4 md:px-5">
        <button className="flex-1 h-[40px] bg-[#FEDA86] text-[#1D1D1D] rounded-[12px] text-[14px] font-bold hover:bg-[#fdd05e] transition-colors cursor-pointer">
          Contact Expert
        </button>
        <button className="flex-1 h-[40px] bg-[#3BBCB7] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#2fa9a4] transition-colors cursor-pointer">
          Book Now
        </button>
      </div>
    </div>
  );
}
