import { CheckCircle2, XCircle } from "lucide-react";

/**
 * ServiceIncludeExclude — Two-column included/excluded list for service detail.
 * Desktop: side-by-side columns. Mobile: stacked.
 * Figma: node 13845:19522 "Included & Excluded" section
 */

const INCLUDED_ITEMS = [
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà, Hạ Long, Ninh Bình, Cát Bà",
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà",
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà",
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà",
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà",
];

const EXCLUDED_ITEMS = [
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà, Hạ Long, Ninh Bình, Cát Bà",
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà",
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà",
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà",
  "Hanoi, Hạ Long, Ninh Bình, Cát Bà",
];

function ItemList({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: "included" | "excluded";
}) {
  const Icon = type === "included" ? CheckCircle2 : XCircle;
  const iconColor = type === "included" ? "text-[#3BBCB7]" : "text-[#E25B5B]";

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[13px] md:text-[14px] font-bold text-[#1D1D1D] mb-3">{title}</p>
      <div className="rounded-xl border border-[#1D1D1D]/8 overflow-hidden">
        {items.map((item, i) => (
          <div key={i}>
            {i > 0 && <div className="h-px bg-[#1D1D1D]/5 mx-3" />}
            <div className="flex items-start gap-2 px-3 py-3">
              <Icon className={`w-4 h-4 shrink-0 mt-[1px] ${iconColor}`} />
              <span className="text-[12px] md:text-[13px] text-[#1D1D1D] leading-[1.5]">
                {item}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServiceIncludeExclude() {
  return (
    <div className="rounded-none md:rounded-xl p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] bg-white">
      <h2 className="text-[16px] md:text-[20px] font-bold text-[#1D1D1D] mb-4 md:mb-5">
        Included &amp; Excluded
      </h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <ItemList title="Included" items={INCLUDED_ITEMS} type="included" />
        <ItemList title="Excluded" items={EXCLUDED_ITEMS} type="excluded" />
      </div>
    </div>
  );
}
