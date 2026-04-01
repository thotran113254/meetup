"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * ToursHeroSection — Full-width hero banner with teal gradient overlay,
 * infinite-scrolling marquee text, and breadcrumb navigation below.
 */
export function ToursHeroSection() {
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
          src="/images/tours-hero-banner.jpg"
          alt="Tour Packages — Explore Vietnam"
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

        {/* Marquee text — infinitely scrolling "TOUR PACKAGES" */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] md:h-[108px] overflow-hidden">
          <div
            className="animate-marquee flex items-center whitespace-nowrap text-[48px] md:text-[90px] font-medium leading-[1.2]"
            style={{ fontFamily: "'DT Phudu', sans-serif" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="shrink-0 bg-clip-text text-transparent bg-gradient-to-b from-white to-[#C8FFFD] mx-6 md:mx-12"
              >
                {i % 2 === 0 ? "TOUR PACKAGES" : "*"}
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
        <ol className="flex items-center gap-2 text-[12px] font-medium leading-[1.2]">
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
          <li className="text-[#1D1D1D]">Tour Packages</li>
        </ol>
      </nav>

      <h1 className="sr-only">
        Tour Packages — Explore Vietnam with Local Experts
      </h1>
    </section>
  );
}
