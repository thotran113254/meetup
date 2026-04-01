import Image from "next/image";
import { MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * ExperienceSection — "Best experience in [Region]side" layout.
 * Figma node: 13982:86068
 * Layout: left featured portrait card 338x600 + right 3x2 grid of square cards, gap-16px.
 * Featured card: 3 progress bars at top, price badge, tags, title overlay.
 * Grid cards: gradient overlay to foreground, price badge, tags, title.
 */

type TourItem = {
  id: number;
  title: string;
  price: string;
  tags: string[];
};

const MOCK_TOURS: TourItem[] = [
  { id: 1, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 2, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 3, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 4, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 5, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 6, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 7, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax", price: "$669", tags: ["Adventure", "Solo"] },
];

/* 7 images per region: 1 portrait + 6 grid cards */
const REGION_IMAGES: Record<string, string[]> = {
  North: [
    "/images/exp-north-1.jpg", "/images/exp-north-2.jpg", "/images/exp-north-3.jpg",
    "/images/exp-north-4.jpg", "/images/exp-north-5.jpg", "/images/exp-north-6.jpg",
    "/images/exp-north-7.jpg",
  ],
  Mid: [
    "/images/exp-mid-1.jpg", "/images/exp-mid-2.jpg", "/images/exp-mid-3.jpg",
    "/images/exp-mid-4.jpg", "/images/exp-mid-5.jpg", "/images/exp-mid-6.jpg",
    "/images/exp-mid-7.jpg",
  ],
  South: [
    "/images/exp-south-1.jpg", "/images/exp-south-2.jpg", "/images/exp-south-3.jpg",
    "/images/exp-south-4.jpg", "/images/exp-south-5.jpg", "/images/exp-south-6.jpg",
    "/images/exp-south-7.jpg",
  ],
};

const FALLBACK_IMAGES = REGION_IMAGES.South;

/** Teal gradient price badge — Figma node 13845:16291 */
function PriceBadge({ price }: { price: string }) {
  return (
    <div
      className="flex items-center gap-1 px-[6px] py-[5px] rounded-[4px] w-fit"
      style={{ background: "linear-gradient(260.3deg, #3BBCB7 20%, #B1FFFC 71%)" }}
    >
      <span className="text-[0.625rem] font-medium leading-[1.3] text-[var(--color-foreground)]/50">From</span>
      <span className="text-xl font-bold text-[var(--color-secondary-foreground)] leading-[1.2] tracking-[0.05px]">{price}</span>
    </div>
  );
}

/** White tag pill with map pin icon */
function TagPill({ label }: { label: string }) {
  return (
    <span className="bg-white rounded-[4px] h-[20px] px-1 flex items-center gap-0.5 text-[0.625rem] font-medium text-[var(--color-foreground)]">
      <MapPin className="w-3 h-3 flex-none" />
      {label}
    </span>
  );
}

/** Shared card overlay — price badge, tags, title */
function CardOverlay({ tour }: { tour: TourItem }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 z-10">
      <div className="flex flex-col gap-[10px]">
        <PriceBadge price={tour.price} />
        <div className="flex gap-1">
          {tour.tags.map((t) => (
            <TagPill key={t} label={t} />
          ))}
        </div>
      </div>
      <p className="text-xs font-bold text-white leading-[1.3] truncate">{tour.title}</p>
    </div>
  );
}

/** Square grid card — fills grid cell with aspect-square, 280px fixed on mobile */
function TourCardSmall({ tour, imageSrc }: { tour: TourItem; imageSrc: string }) {
  return (
    <div className="relative aspect-square w-[294px] md:w-auto flex-none md:flex-initial rounded-xl overflow-hidden group cursor-pointer">
      <Image src={imageSrc} alt={tour.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 294px, 338px" />
      <div className="absolute bottom-0 left-0 right-0 h-[172px] bg-gradient-to-b from-transparent to-[var(--color-foreground)]" />
      <CardOverlay tour={tour} />
    </div>
  );
}

/** Portrait card 338x600 — image + progress bars only (no overlay per Figma) */
function TourCardPortrait({ imageSrc, alt }: { imageSrc: string; alt: string }) {
  return (
    <div className="relative w-[280px] h-[500px] sm:w-[338px] sm:h-[600px] rounded-xl overflow-hidden group cursor-pointer flex-none">
      <Image src={imageSrc} alt={alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="338px" />
      {/* Progress bars — 3 semi-transparent + white active indicator per Figma */}
      <div className="absolute top-[14px] left-[18px] right-[18px] flex gap-1 z-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 h-1.5 bg-[var(--color-foreground)]/50 rounded-full" />
        ))}
        <div className="absolute top-0 left-0 w-[47px] h-1.5 bg-white rounded-full" />
      </div>
    </div>
  );
}

type ExperienceSectionProps = {
  region: string;
};

export function ExperienceSection({ region }: ExperienceSectionProps) {
  const images = REGION_IMAGES[region] ?? FALLBACK_IMAGES;
  const portraitTour = MOCK_TOURS[0];
  const gridTours = MOCK_TOURS.slice(1); // 6 grid cards

  return (
    <section className="py-5 md:py-8 lg:py-10 bg-white">
      <div className="container-wide">
        {/* Title row — all dark text, "View all" teal button */}
        <ScrollReveal>
          <div className="flex items-start justify-between mb-5 gap-4">
            <h3 className="text-xl md:text-[32px] font-bold text-[var(--color-foreground)] leading-[1.2] tracking-[0.05px] md:tracking-[0.08px]">
              Best experience<br className="md:hidden" /> in {region}side
            </h3>
            <a
              href="#"
              className="h-10 px-4 text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-xl transition-colors flex items-center justify-center flex-none cursor-pointer shrink-0"
            >
              View all
            </a>
          </div>
        </ScrollReveal>

        {/* Mobile: horizontal scroll of 294px square cards */}
        <div className="flex gap-2 overflow-x-auto md:hidden scrollbar-hide">
          {MOCK_TOURS.map((card, i) => (
            <TourCardSmall
              key={card.id}
              tour={card}
              imageSrc={images[i] ?? FALLBACK_IMAGES[0]}
            />
          ))}
        </div>

        {/* Desktop: portrait left + 3x2 grid right */}
        <ScrollReveal delay={0.15}>
        <div className="hidden md:flex gap-4">
          <TourCardPortrait imageSrc={images[0] ?? FALLBACK_IMAGES[0]} alt={`Best experience in ${region}side`} />

          <div className="grid grid-cols-3 gap-4 flex-1 min-w-0">
            {gridTours.map((card, i) => (
              <TourCardSmall
                key={card.id}
                tour={card}
                imageSrc={images[i + 1] ?? FALLBACK_IMAGES[0]}
              />
            ))}
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
