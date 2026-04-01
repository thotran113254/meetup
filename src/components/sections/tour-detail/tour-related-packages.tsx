import { ChevronLeft, ChevronRight } from "lucide-react";
import { TourCard } from "@/components/ui/tour-card";
import { MostLikedPackageSection } from "@/components/sections/tours/most-liked-package-section";
import { ScrollReveal } from "@/components/ui/scroll-animations";

const RELATED_TOURS = [
  {
    image: "/images/tour-1-floating-market.png",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels-mekong",
  },
  {
    image: "/images/tour-2-hoi-an.png",
    title: "Hoi An Ancient Town Walking Tour with Lantern Making",
    price: 549,
    duration: "3D2N",
    spots: 5,
    tags: ["Culture", "Family"],
    slug: "hoi-an-ancient-town",
  },
  {
    image: "/images/tour-3-mekong.png",
    title: "Mekong Delta Floating Market Experience Full Day",
    price: 399,
    duration: "2D1N",
    spots: 8,
    tags: ["Adventure"],
    slug: "mekong-delta-floating",
  },
  {
    image: "/images/tour-4-palm-trees.png",
    title: "Phu Quoc Island Beach Retreat and Snorkeling Tour",
    price: 899,
    duration: "5D4N",
    spots: 4,
    tags: ["Beach", "Relax"],
    slug: "phu-quoc-island-retreat",
  },
];

export function TourRelatedPackages() {
  return (
    <div className="flex flex-col">
      {/* You Might Like These Packages */}
      <section className="section-padding bg-white">
        <div className="container-wide flex flex-col gap-5">
          <ScrollReveal>
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-[32px] font-bold italic leading-[1.2] tracking-[0.08px] text-[#1D1D1D] font-[family-name:var(--font-italianno)]">
                You Might Like These Packages
              </h2>
              <button className="bg-[#3BBCB7] text-white text-[14px] font-medium px-5 h-[40px] rounded-[12px] hover:bg-[#2fa9a4] transition-colors cursor-pointer">
                View all
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="relative">
              {/* Left arrow */}
              <button
                aria-label="Previous"
                className="hidden md:flex absolute -left-5 lg:-left-[60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center z-10 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              {/* Tour cards row */}
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide md:overflow-visible md:snap-none">
                {RELATED_TOURS.map((tour) => (
                  <TourCard key={tour.slug} {...tour} />
                ))}
              </div>

              {/* Right arrow */}
              <button
                aria-label="Next"
                className="hidden md:flex absolute -right-5 lg:-right-[60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center z-10 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Most Liked Package — reuse existing section */}
      <MostLikedPackageSection />
    </div>
  );
}
