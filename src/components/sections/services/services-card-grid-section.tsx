"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-animations";

/**
 * ServicesCardGridSection — Grid of 5 service cards with image bg,
 * dark gradient overlay, price badge, and service name.
 * Desktop: 4 columns first row + 1 card second row.
 * Mobile: 2 columns grid.
 * Figma: node 13845:15302
 */

type ServiceCard = {
  id: string;
  name: string;
  price: string;
  image: string;
  href: string;
};

const SERVICE_CARDS: ServiceCard[] = [
  { id: "fast-track", name: "Fast track service", price: "$669", image: "/images/service-fast-track.png", href: "/services/fast-track" },
  { id: "evisa", name: "eVisa service", price: "$669", image: "/images/service-evisa.png", href: "/services/evisa" },
  { id: "airport-pickup", name: "Airport Pickup service", price: "$669", image: "/images/service-airport-pickup.png", href: "/services/airport-pickup" },
  { id: "esim", name: "eSim service", price: "$669", image: "/images/service-esim.png", href: "/services/esim" },
  { id: "customize-tour", name: "Customize Tour service", price: "$669", image: "/images/service-customize-tour.jpg", href: "/services/customize-tour" },
];

function ServiceCardItem({ card }: { card: ServiceCard }) {
  return (
    <Link
      href={card.href}
      className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square"
    >
      <Image
        src={card.image}
        alt={card.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, 338px"
      />
      {/* Dark gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-[#1D1D1D]" />
      {/* Price badge + name */}
      <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 flex flex-col gap-1.5 md:gap-2">
        <div
          className="inline-flex items-center gap-1 px-1.5 py-[5px] rounded-[4px] w-fit"
          style={{ background: "linear-gradient(260.3deg, #3BBCB7 20%, #B1FFFC 71%)" }}
        >
          <span className="text-[8px] md:text-[10px] font-medium leading-[1.3] text-[#1D1D1D]/50">
            From
          </span>
          <span className="text-base md:text-xl font-bold text-[#194F4D] leading-[1.2] tracking-[0.05px]">
            {card.price}
          </span>
        </div>
        <p className="text-[11px] md:text-xs font-bold leading-[1.3] text-white truncate">
          {card.name}
        </p>
      </div>
    </Link>
  );
}

export function ServicesCardGridSection() {
  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-[100px]">
        <ScrollReveal>
          <div className="flex flex-col gap-3 mb-5 md:mb-6">
            <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)]">
              Introduce About Travel Services
            </h2>
            <p className="text-xs md:text-sm text-[#828282] leading-[1.5] max-w-[533px]">
              Meetup Travel offers a comprehensive range of services to make your
              Vietnam journey seamless — from airport fast track and visa assistance
              to eSIM connectivity and fully customized tour experiences.
            </p>
          </div>
        </ScrollReveal>

        {/* Grid: 2 cols mobile, 4 cols desktop */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {SERVICE_CARDS.map((card) => (
              <ServiceCardItem key={card.id} card={card} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
