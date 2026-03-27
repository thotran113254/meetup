import Image from "next/image";
import { Eye, Calendar, MapPin } from "lucide-react";

/**
 * ExperienceSection — "Best experience in [Region]" layout.
 * Figma: left featured portrait card 338x600 + right 3x2 grid of 338x338 cards, gap-16px.
 * Featured card: progress bars at top, price badge, tags, title overlay.
 * Grid cards: same overlay style as TourCard.
 */

type TourItem = {
  id: number;
  title: string;
  price: string;
  duration: string;
  spots: number;
  tags: string[];
};

const MOCK_TOURS: TourItem[] = [
  { id: 1, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", duration: "4D3N", spots: 3, tags: ["Adventure", "Solo"] },
  { id: 2, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", duration: "4D3N", spots: 3, tags: ["Adventure", "Solo"] },
  { id: 3, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", duration: "4D3N", spots: 3, tags: ["Adventure", "Solo"] },
  { id: 4, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", duration: "4D3N", spots: 3, tags: ["Adventure", "Solo"] },
  { id: 5, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", duration: "4D3N", spots: 3, tags: ["Adventure", "Solo"] },
  { id: 6, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", duration: "4D3N", spots: 3, tags: ["Adventure", "Solo"] },
];

const REGION_IMAGES: Record<string, string[]> = {
  North: ["/images/exp-north-1.png", "/images/exp-north-2.png", "/images/exp-north-3.png", "/images/exp-north-4.png", "/images/exp-north-5.png", "/images/exp-north-6.png"],
  Mid:   ["/images/exp-mid-1.png",   "/images/exp-mid-2.png",   "/images/exp-mid-3.png",   "/images/exp-mid-4.png",   "/images/exp-mid-5.png",   "/images/exp-mid-6.png"],
  South: ["/images/exp-south-1.png", "/images/exp-south-2.png", "/images/exp-south-3.png", "/images/exp-south-4.png", "/images/exp-south-5.png", "/images/exp-south-6.png"],
};

const FALLBACK_IMAGES = REGION_IMAGES.North;

/** Shared price badge with teal gradient, same as TourCard */
function PriceBadge({ price }: { price: string }) {
  return (
    <div
      className="flex items-center gap-0.5 px-[6px] py-[5px] rounded-[4px] w-fit"
      style={{ background: "linear-gradient(260.5deg, #3BBCB7 20%, #B1FFFC 71%)" }}
    >
      <span className="text-[10px] font-medium leading-[1.3]" style={{ color: "rgba(29,29,29,0.5)" }}>From</span>
      <span className="text-[20px] font-bold text-[#194F4D] leading-[1.2]">{price}</span>
    </div>
  );
}

/** Tag pill — white bg, h-20px */
function TagPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="bg-white rounded-[4px] h-[20px] px-[4px] flex items-center gap-[4px] text-[10px] font-medium text-[#1D1D1D]">
      {icon}
      {label}
    </span>
  );
}

/** Small square card — 338x338, used in 3x2 right grid. 280px on mobile */
function TourCardSmall({ tour, imageSrc }: { tour: TourItem; imageSrc: string }) {
  return (
    <div className="relative w-[280px] h-[280px] sm:w-[338px] sm:h-[338px] rounded-[12px] overflow-hidden group cursor-pointer flex-none">
      <Image src={imageSrc} alt={tour.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="338px" />
      <div className="absolute top-3.5 right-3.5 bg-white size-[36px] rounded-[8px] flex items-center justify-center z-10">
        <Eye className="w-5 h-5 text-[#1D1D1D]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[160px]" style={{ background: "linear-gradient(to bottom, transparent 0%, #1B5654 71%)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-[16px] flex flex-col gap-[10px] z-10">
        <PriceBadge price={tour.price} />
        <div className="flex flex-wrap gap-1">
          <TagPill icon={<Calendar className="w-3 h-3 flex-none" />} label={tour.duration} />
          <TagPill icon={<MapPin className="w-3 h-3 flex-none" />} label={`${tour.spots} Spots`} />
          {tour.tags.map((t) => <TagPill key={t} icon={<MapPin className="w-3 h-3 flex-none" />} label={t} />)}
        </div>
        <p className="text-[12px] font-bold text-white leading-[1.3] truncate">{tour.title}</p>
      </div>
    </div>
  );
}

/** Portrait card — 338x600, progress bars at top. 280px wide on mobile */
function TourCardPortrait({ tour, imageSrc }: { tour: TourItem; imageSrc: string }) {
  return (
    <div className="relative w-[280px] h-[500px] sm:w-[338px] sm:h-[600px] rounded-[12px] overflow-hidden group cursor-pointer flex-none">
      <Image src={imageSrc} alt={tour.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="338px" />
      {/* Progress bars — top 14px, left 18px, 4 bars */}
      <div className="absolute top-[14px] left-[18px] flex gap-1.5 z-10">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-[96px] h-[6px] rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`} />
        ))}
      </div>
      <div className="absolute top-3.5 right-3.5 bg-white size-[36px] rounded-[8px] flex items-center justify-center z-10">
        <Eye className="w-5 h-5 text-[#1D1D1D]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[206px]" style={{ background: "linear-gradient(to bottom, transparent 0%, #1B5654 71%)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-[16px] flex flex-col gap-[10px] z-10">
        <PriceBadge price={tour.price} />
        <div className="flex flex-wrap gap-1">
          <TagPill icon={<Calendar className="w-3 h-3 flex-none" />} label={tour.duration} />
          <TagPill icon={<MapPin className="w-3 h-3 flex-none" />} label={`${tour.spots} Spots`} />
          {tour.tags.map((t) => <TagPill key={t} icon={<MapPin className="w-3 h-3 flex-none" />} label={t} />)}
        </div>
        <p className="text-[12px] font-bold text-white leading-[1.3] truncate">{tour.title}</p>
      </div>
    </div>
  );
}

type ExperienceSectionProps = {
  region: string;
  description?: string;
};

export function ExperienceSection({ region, description }: ExperienceSectionProps) {
  const images = REGION_IMAGES[region] ?? FALLBACK_IMAGES;
  const portraitTour = MOCK_TOURS[0];
  const gridTours = MOCK_TOURS.slice(1); // 5 cards → 3+2 layout

  return (
    <section className="py-[50px] bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Title row — region in teal, "View all" button 103x40 */}
        <div className="flex items-center justify-between mb-6 h-[40px]">
          <h3 className="text-[24px] font-bold text-[var(--color-foreground)]">
            Best experience in{" "}
            <span className="text-[#3BBCB7]">{region}side</span>
          </h3>
          <a
            href={`/tours?region=${region.toLowerCase()}`}
            className="w-[103px] h-[40px] text-[14px] font-bold text-white bg-[#3BBCB7] hover:bg-[var(--color-primary-dark)] rounded-[12px] transition-colors flex items-center justify-center flex-none"
          >
            View all
          </a>
        </div>

        {description && (
          <p className="text-[var(--color-muted-foreground)] mb-4 max-w-xl">{description}</p>
        )}

        {/* Layout: portrait left (338x600) + 3x2 grid right — mobile: horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {/* Left portrait card — shrinks on mobile */}
          <div className="flex-none w-[280px] sm:w-[338px]">
            <TourCardPortrait tour={portraitTour} imageSrc={images[0] ?? FALLBACK_IMAGES[0]} />
          </div>

          {/* Right: 3x2 grid — on mobile shows as horizontal scroll row */}
          <div className="flex sm:grid sm:grid-cols-3 gap-4 flex-none">
            {gridTours.map((card, i) => (
              <TourCardSmall
                key={card.id}
                tour={card}
                imageSrc={images[i + 1] ?? FALLBACK_IMAGES[i + 1] ?? FALLBACK_IMAGES[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
