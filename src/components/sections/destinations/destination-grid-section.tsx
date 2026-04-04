"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-animations";
import type { DestinationItem } from "@/lib/types/destinations-cms-types";

const ITEMS_PER_PAGE = 12;
const FALLBACK_TITLE = "Where is your favorite place?";

type Props = {
  destinations?: DestinationItem[];
  title?: string;
};

/**
 * DestinationGridSection — Grid of destination cards with pagination.
 * Data comes from CMS (site_settings: destinations_list).
 * Returns null when no destinations are provided.
 */
export function DestinationGridSection({ destinations, title }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!destinations || destinations.length === 0) return null;

  const heading = title || FALLBACK_TITLE;
  const totalPages = Math.max(1, Math.ceil(destinations.length / ITEMS_PER_PAGE));
  const paged = destinations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          <h2 className="text-xl md:text-[32px] font-bold text-[var(--color-foreground)] leading-[1.2] tracking-[0.05px] md:tracking-[0.08px] mb-5 md:mb-8">
            {heading}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {paged.map((dest, idx) => (
              <DestinationCard key={`${dest.slug}-${idx}`} {...dest} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`size-10 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}

function DestinationCard({ name, slug, image, description }: DestinationItem) {
  return (
    <Link href={`/destinations/${slug}`} className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer block">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 338px"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[55%]"
        style={{ background: "linear-gradient(to bottom, rgba(29,29,29,0) 0%, #1D1D1D 100%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
        <h3 className="text-xl md:text-2xl font-bold text-white leading-[1.2]">{name}</h3>
        <p className="text-xs text-[#ECECEC] leading-[1.5]">{description}</p>
      </div>
    </Link>
  );
}
