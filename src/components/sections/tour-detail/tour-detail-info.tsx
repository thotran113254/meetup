import { Users, Mountain, Compass, Gauge, BarChart3, Calendar, MapPin } from "lucide-react";
import type { TourPackage } from "@/lib/types/tours-cms-types";

function PhysicalRatingBars({ rating = 2, size = "sm" }: { rating?: number; size?: "sm" | "lg" }) {
  const heights = size === "lg" ? [10, 14, 18, 22, 26] : [7.5, 11.25, 16.5, 20.25, 24];
  const barW = size === "lg" ? "w-[6px]" : "w-[11.55px]";
  return (
    <div className="flex items-end gap-[1.5px]">
      {heights.map((h, i) => (
        <div key={i} className={`${barW} rounded-[1.5px] ${i < rating ? "bg-[#194F4D]" : "bg-[#7CD2CF]"}`}
          style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

type Props = Partial<Pick<TourPackage,
  "title" | "duration" | "spots" | "tags" | "description" |
  "groupSize" | "tripType" | "rangeLabel" | "tourPace" | "physicalRating" | "places"
>>;

export function TourDetailInfo({
  title = "Explore the Beauty of Vietnam - Adventure Tour",
  duration = "4D3N",
  spots = 3,
  tags = ["Adventures", "Solo"],
  description,
  groupSize = "Min 2 - Max 24",
  tripType = "Group Tours",
  rangeLabel = "Signature Journeys",
  tourPace = "Medium",
  physicalRating = 2,
  places = ["Hanoi", "Danang", "Ho Chi Minh city"],
}: Props) {
  const overviewStats = [
    { label: "Group size",       icon: Users,    value: groupSize, isRating: false },
    { label: "Trip type",        icon: Mountain, value: tripType,  isRating: false },
    { label: "Range",            icon: Compass,  value: rangeLabel, isRating: false },
    { label: "Tour pace",        icon: Gauge,    value: tourPace,  isRating: false },
    { label: "Physical rating",  icon: BarChart3, value: "",       isRating: true  },
  ];

  const displayDesc = description ||
    "Embark on an unforgettable journey through the heart of Vietnam, from the bustling streets of Ho Chi Minh City to the serene waters of the Mekong Delta. Experience authentic local culture, savor traditional cuisine, and discover hidden gems that only local guides can reveal.";

  return (
    <div className="rounded-none md:rounded-xl p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] bg-white">
      <h1 className="text-[24px] md:text-[32px] font-bold text-[#1D1D1D] leading-[1.2]">{title}</h1>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="inline-flex items-center gap-[2px] bg-[#EBF8F8] rounded p-1 md:px-1.5 md:h-6 text-[12px] md:text-[14px] font-medium text-[#1D1D1D]">
          <Calendar className="w-3.5 h-3.5" /> {duration}
        </span>
        <span className="inline-flex items-center gap-[2px] bg-[#EBF8F8] rounded p-1 md:px-1.5 md:h-6 text-[12px] md:text-[14px] font-medium text-[#1D1D1D]">
          <MapPin className="w-3.5 h-3.5" /> {spots} Spots
        </span>
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center bg-[#EBF8F8] rounded p-1 md:px-1.5 md:h-6 text-[12px] md:text-[14px] font-medium text-[#1D1D1D]">
            {tag}
          </span>
        ))}
      </div>

      <div className="h-px bg-[#1D1D1D]/5 my-5" />
      <h2 className="text-[20px] font-bold text-[#1D1D1D] mb-3 md:mb-4">Overviews</h2>

      {/* Mobile */}
      <div className="flex flex-col gap-1 md:hidden">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between bg-[#F8F8F8] rounded-xl p-3">
            <span className="text-[12px] font-bold text-[#1D1D1D] w-[110px]">{stat.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#1D1D1D]">{stat.value}</span>
              {stat.isRating ? <PhysicalRatingBars rating={physicalRating} size="sm" /> : <stat.icon className="w-6 h-6 text-[#194F4D]" />}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-3">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center justify-between bg-[#F8F8F8] rounded-xl h-[127px] p-5">
            <span className="text-[14px] font-bold text-[#1D1D1D] text-center">{stat.label}</span>
            {stat.isRating ? <PhysicalRatingBars rating={physicalRating} size="lg" /> : <stat.icon className="w-8 h-8 text-[#194F4D]" />}
            <span className="text-[14px] text-[#828282] text-center">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#1D1D1D]/5 my-5" />
      <h2 className="text-[20px] font-bold text-[#1D1D1D] mb-3 md:mb-4">Place visited</h2>
      <div className="flex flex-wrap items-center gap-2">
        {places.map((place) => (
          <span key={place} className="inline-flex items-center gap-[2px] bg-[#EBF8F8] rounded px-1.5 h-6 text-[14px] font-medium text-[#1D1D1D]">
            <MapPin className="w-4 h-4" /> {place}
          </span>
        ))}
      </div>

      <div className="h-px bg-[#1D1D1D]/5 my-5" />
      <h2 className="text-[20px] font-bold text-[#1D1D1D] mb-3 md:mb-4">Description</h2>
      <div className="space-y-2 md:space-y-4 text-[14px] text-[#828282] leading-relaxed">
        {displayDesc.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  );
}
