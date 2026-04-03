import Image from "next/image";
import { MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-animations";
import { getSetting } from "@/db/queries/settings-queries";

/**
 * ExperienceSection — server component.
 * Loads region-specific experience tours from CMS (siteSettings key "homepage_experience").
 * Falls back to FALLBACK_DATA when DB unavailable or setting not set.
 */

type TourItem = {
  id: number;
  title: string;
  price: string;
  tags: string[];
};

type RegionData = {
  tours: TourItem[];
  images: string[];
};

type ExperienceData = Record<string, RegionData>;

const FALLBACK_TOURS: TourItem[] = [
  { id: 1, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 2, title: "Hoi An Ancient Town Private Day Tour from Da Nang", price: "$549", tags: ["Culture", "Group"] },
  { id: 3, title: "Ha Long Bay 2-Day Cruise & Kayaking Adventure", price: "$389", tags: ["Adventure", "Group"] },
  { id: 4, title: "Sapa Trekking & Ethnic Village Homestay 3 Days", price: "$459", tags: ["Trekking", "Solo"] },
  { id: 5, title: "Mekong Delta Ben Tre Floating Market Tour", price: "$299", tags: ["Cultural", "Group"] },
  { id: 6, title: "Phu Quoc Snorkeling & Beach Day Tour", price: "$199", tags: ["Beach", "Family"] },
  { id: 7, title: "My Son Sanctuary & Marble Mountains Half Day", price: "$249", tags: ["History", "Group"] },
];

const FALLBACK_DATA: ExperienceData = {
  North: {
    tours: FALLBACK_TOURS,
    images: [
      "/images/exp-north-1.jpg", "/images/exp-north-2.jpg", "/images/exp-north-3.jpg",
      "/images/exp-north-4.jpg", "/images/exp-north-5.jpg", "/images/exp-north-6.jpg",
      "/images/exp-north-7.jpg",
    ],
  },
  Mid: {
    tours: FALLBACK_TOURS,
    images: [
      "/images/exp-mid-1.jpg", "/images/exp-mid-2.jpg", "/images/exp-mid-3.jpg",
      "/images/exp-mid-4.jpg", "/images/exp-mid-5.jpg", "/images/exp-mid-6.jpg",
      "/images/exp-mid-7.jpg",
    ],
  },
  South: {
    tours: FALLBACK_TOURS,
    images: [
      "/images/exp-south-1.jpg", "/images/exp-south-2.jpg", "/images/exp-south-3.jpg",
      "/images/exp-south-4.jpg", "/images/exp-south-5.jpg", "/images/exp-south-6.jpg",
      "/images/exp-south-7.jpg",
    ],
  },
};

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

function TagPill({ label }: { label: string }) {
  return (
    <span className="bg-white rounded-[4px] h-[20px] px-1 flex items-center gap-0.5 text-[0.625rem] font-medium text-[var(--color-foreground)]">
      <MapPin className="w-3 h-3 flex-none" />
      {label}
    </span>
  );
}

function CardOverlay({ tour }: { tour: TourItem }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 z-10">
      <div className="flex flex-col gap-[10px]">
        <PriceBadge price={tour.price} />
        <div className="flex gap-1">
          {tour.tags.map((t) => <TagPill key={t} label={t} />)}
        </div>
      </div>
      <p className="text-xs font-bold text-white leading-[1.3] truncate">{tour.title}</p>
    </div>
  );
}

function TourCardSmall({ tour, imageSrc }: { tour: TourItem; imageSrc: string }) {
  return (
    <div className="relative aspect-square w-[294px] md:w-auto flex-none md:flex-initial rounded-xl overflow-hidden group cursor-pointer">
      <Image src={imageSrc} alt={tour.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 294px, 338px" />
      <div className="absolute bottom-0 left-0 right-0 h-[172px] bg-gradient-to-b from-transparent to-[var(--color-foreground)]" />
      <CardOverlay tour={tour} />
    </div>
  );
}

function TourCardPortrait({ imageSrc, alt }: { imageSrc: string; alt: string }) {
  return (
    <div className="relative w-[280px] h-[500px] sm:w-[338px] sm:h-[600px] rounded-xl overflow-hidden group cursor-pointer flex-none">
      <Image src={imageSrc} alt={alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="338px" />
      <div className="absolute top-[14px] left-[18px] right-[18px] flex gap-1 z-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 h-1.5 bg-[var(--color-foreground)]/50 rounded-full" />
        ))}
        <div className="absolute top-0 left-0 w-[47px] h-1.5 bg-white rounded-full" />
      </div>
    </div>
  );
}

type ExperienceSectionProps = { region: string };

export async function ExperienceSection({ region }: ExperienceSectionProps) {
  let data = FALLBACK_DATA;
  try {
    const cms = await getSetting<ExperienceData>("homepage_experience");
    if (cms && typeof cms === "object") data = { ...FALLBACK_DATA, ...cms };
  } catch {
    // DB unavailable — use fallback
  }

  const regionData = data[region] ?? FALLBACK_DATA.South;
  const { tours, images } = regionData;
  const fallbackImg = FALLBACK_DATA.South.images[0];

  return (
    <section className="py-5 md:py-8 lg:py-10 bg-white">
      <div className="container-wide">
        <ScrollReveal>
          <div className="flex items-start justify-between mb-5 gap-4">
            <h3 className="text-xl md:text-[32px] font-bold text-[var(--color-foreground)] leading-[1.2] tracking-[0.05px] md:tracking-[0.08px]">
              Best experience<br className="md:hidden" /> in {region}side
            </h3>
            <a
              href="/tours"
              className="h-10 px-4 text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-xl transition-colors flex items-center justify-center flex-none cursor-pointer shrink-0"
            >
              View all
            </a>
          </div>
        </ScrollReveal>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto md:hidden scrollbar-hide">
          {tours.map((card, i) => (
            <TourCardSmall key={card.id} tour={card} imageSrc={images[i] ?? fallbackImg} />
          ))}
        </div>

        {/* Desktop: portrait left + 3x2 grid right */}
        <ScrollReveal delay={0.15}>
          <div className="hidden md:flex gap-4">
            <TourCardPortrait imageSrc={images[0] ?? fallbackImg} alt={`Best experience in ${region}side`} />
            <div className="grid grid-cols-3 gap-4 flex-1 min-w-0">
              {tours.slice(1, 7).map((card, i) => (
                <TourCardSmall key={card.id} tour={card} imageSrc={images[i + 1] ?? fallbackImg} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
