"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * HeroSection — Meetup Travel homepage hero banner.
 * Fade-in + subtle scale on mount for polished first impression.
 */
export function HeroSection() {
  return (
    <section className="w-full bg-[var(--color-background)] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <motion.div
        className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl"
        style={{ aspectRatio: "1546 / 487" }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image
          src="/images/hero-banner.png"
          alt="Welcome to Meetup — Where local experts craft a journey uniquely yours"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </motion.div>

      <h1 className="sr-only">
        Welcome to Meetup — Where Local Experts Craft A Journey Uniquely Yours
      </h1>
    </section>
  );
}
