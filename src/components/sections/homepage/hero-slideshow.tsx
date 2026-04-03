"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
};

type Props = {
  slides: Slide[];
};

/**
 * HeroSlideshow — client component for CMS-driven hero banner.
 * 1 slide: static fade-in (original behavior).
 * 2+ slides: auto-rotating carousel, 5s interval, with arrows + dot indicators.
 */
export function HeroSlideshow({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const count = slides.length;

  // Auto-advance every 5s when multiple slides
  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % count);
    }, 5000);
    return () => clearInterval(timer);
  }, [count]);

  const prev = () => setCurrent((i) => (i - 1 + count) % count);
  const next = () => setCurrent((i) => (i + 1) % count);

  // Fallback: no slides in DB → static banner
  if (count === 0) {
    return (
      <section className="w-full bg-[var(--color-background)] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <motion.div
          className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl aspect-[343/257] md:aspect-[1546/487]"
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

  const slide = slides[current];

  return (
    <section className="w-full bg-[var(--color-background)] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl aspect-[343/257] md:aspect-[1546/487]">
        {/* Slide images with crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={current === 0}
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {/* Optional gradient overlay when title/subtitle are shown */}
            {(slide.subtitle || slide.title) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Slide text overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${slide.id}`}
            className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 z-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {slide.subtitle && (
              <p className="text-white/80 text-xs md:text-sm font-medium mb-1">
                {slide.subtitle}
              </p>
            )}
            <h1 className="text-white font-bold text-base md:text-2xl lg:text-3xl leading-[1.2] tracking-tight drop-shadow">
              {slide.title}
            </h1>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows — only when multiple slides */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 right-4 z-20 flex gap-1.5 items-center">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
