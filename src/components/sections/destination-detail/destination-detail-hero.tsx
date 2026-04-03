"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * DestinationDetailHero — Hero banner with city name marquee and breadcrumb.
 * Shows full-width image, teal gradient overlay, scrolling city name text.
 * Figma desktop: 13842:17128, mobile: 13856:61985.
 */
export function DestinationDetailHero({
  cityName,
  heroImage,
}: {
  cityName: string;
  heroImage: string;
}) {
  const marqueeText = cityName.toUpperCase();

  return (
    <section className="w-full bg-[var(--color-background)] px-4 sm:px-6 lg:px-[27px] pt-4 sm:pt-[37px]">
      {/* Hero banner with image + gradient + marquee */}
      <motion.div
        className="relative w-full max-w-[1546px] mx-auto overflow-hidden rounded-xl aspect-[343/257] md:aspect-[1546/487]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image
          src={heroImage}
          alt={`${cityName} — Explore with Local Experts`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1546px"
        />

        {/* Teal gradient overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[43%]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(59,188,183,0) 0%, #3BBCB7 100%)",
          }}
        />

        {/* Marquee text — infinitely scrolling city name */}
        <div className="absolute bottom-0 left-0 right-0 h-[52px] md:h-[108px] overflow-hidden">
          <div
            className="animate-marquee flex items-center whitespace-nowrap text-[43px] md:text-[90px] font-medium leading-[1.2]"
            style={{ fontFamily: "'DT Phudu', sans-serif" }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="shrink-0 bg-clip-text text-transparent bg-gradient-to-b from-white to-[#C8FFFD] mx-6 md:mx-12"
              >
                {i % 2 === 0 ? marqueeText : "*"}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Breadcrumb — below hero */}
      <nav
        className="max-w-[1546px] mx-auto mt-3 lg:mt-4 px-2 lg:px-[73px]"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2 text-[10px] md:text-[12px] font-medium leading-[1.2]">
          <li>
            <Link
              href="/"
              className="text-[#BDBDBD] hover:text-[#828282] transition-colors"
            >
              Homepage
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-[#BDBDBD]" />
          </li>
          <li>
            <Link
              href="/destinations"
              className="text-[#BDBDBD] hover:text-[#828282] transition-colors"
            >
              Destination
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-[#BDBDBD]" />
          </li>
          <li className="text-[#1D1D1D]">{cityName}</li>
        </ol>
      </nav>

      <h1 className="sr-only">{cityName} — Explore with Local Experts</h1>
    </section>
  );
}
