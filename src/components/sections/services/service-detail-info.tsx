import { Users, Globe } from "lucide-react";
import { MapPin } from "lucide-react";

/**
 * ServiceDetailInfo — Top info card for service detail page.
 * Shows: service title, Highlights overview text, and overview details
 * (Pickup location, Group size, Language).
 * Figma: node 13845:17152 left panel top section
 */

type OverviewDetail = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

const OVERVIEW_DETAILS: OverviewDetail[] = [
  { label: "Pick up", value: "Noi Bai Airport Hanoi | Tan Son Nhat Airport (HCMC) | Quang Ninh Province, Phu Quoc Airport", icon: MapPin },
  { label: "Group size", value: "1 – 100 pax", icon: Users },
  { label: "Language", value: "English, Vietnamese", icon: Globe },
];

const HIGHLIGHTS_TEXT =
  "Welcome to the Airport: Fast track service, available at Tan Son Nhat, Noi Bai Da Nang, and Phu Quoc International airports, will make your trip to Vietnam more comfortable. You can skip long immigration lines and use the priority immigration lane for a smooth, hassle-free experience.\n\nFor ticket confirmation, please share your flight information and preferred meeting time for departing flights. Upon arrival, our friendly staff will greet you with a personalized sign and assist with all procedures. Whether you land in Ho Chi Minh City, Hanoi, Da Nang, or Phu Quoc, the Meet team will help you start your journey easily, stress-free.";

export function ServiceDetailInfo({ serviceName = "Detail service name" }: { serviceName?: string }) {
  return (
    <div className="rounded-none md:rounded-xl p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] bg-white">
      {/* Service name */}
      <h1 className="text-[20px] md:text-[32px] font-bold text-[#1D1D1D] leading-[1.2]">
        {serviceName}
      </h1>

      {/* Divider */}
      <div className="h-px bg-[#1D1D1D]/5 my-4 md:my-5" />

      {/* Highlights */}
      <h2 className="text-[16px] md:text-[20px] font-bold text-[#1D1D1D] mb-2 md:mb-3">
        Highlights
      </h2>
      <div className="text-[13px] md:text-[14px] text-[#828282] leading-[1.6] whitespace-pre-line">
        {HIGHLIGHTS_TEXT}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1D1D1D]/5 my-4 md:my-5" />

      {/* Overviews section */}
      <h2 className="text-[16px] md:text-[20px] font-bold text-[#1D1D1D] mb-3 md:mb-4">
        Overviews
      </h2>
      <div className="flex flex-col gap-2">
        {OVERVIEW_DETAILS.map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-[#F8F8F8] px-4 py-3"
          >
            {/* Mobile: horizontal row */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-6">
              <div className="flex items-center gap-1.5 shrink-0 min-w-[90px]">
                <item.icon className="w-4 h-4 text-[#194F4D] shrink-0" />
                <span className="text-[12px] md:text-[14px] font-bold text-[#1D1D1D]">
                  {item.label}
                </span>
              </div>
              <span className="text-[12px] md:text-[14px] text-[#828282] leading-[1.5]">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
