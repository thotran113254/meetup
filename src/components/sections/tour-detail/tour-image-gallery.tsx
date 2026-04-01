"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Images } from "lucide-react";
import { TourGalleryPopup } from "./tour-gallery-popup";

const GALLERY_IMAGES = [
  "/images/tour-1-floating-market.png",
  "/images/tour-2-hoi-an.png",
  "/images/tour-3-mekong.png",
  "/images/tour-4-palm-trees.png",
  "/images/tour-1-floating-market.png",
];

const BREADCRUMB_ITEMS = [
  { label: "Homepage", href: "/" },
  { label: "Tour Packages", href: "/tours" },
  { label: "Adventures", href: "/tours" },
];

/* ── Mobile swipeable slider ── */

function MobileImageSlider({ onOpenPopup }: { onOpenPopup: (index: number) => void }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = GALLERY_IMAGES.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(Math.max(0, Math.min(index, total - 1)));
    },
    [total]
  );

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function handleTouchEnd() {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      goTo(current + 1);
    } else if (touchDeltaX.current > threshold) {
      goTo(current - 1);
    }
  }

  return (
    <div>
      {/* Slider viewport */}
      <div
        ref={containerRef}
        className="relative h-[211px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide track */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} className="relative w-full h-full shrink-0">
              <Image
                src={src}
                alt={`Tour photo ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Photo count badge — opens popup */}
        <button
          onClick={() => onOpenPopup(current)}
          className="absolute bottom-3 right-3 bg-white/80 rounded-lg px-2 py-1 flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span className="text-[12px] font-medium text-[#1D1D1D]">
            {current + 1}/{total}
          </span>
          <Images className="w-3 h-3 text-[#1D1D1D]" />
        </button>
      </div>

      {/* Tab indicators */}
      <div className="flex items-center justify-center gap-1 mt-2">
        {GALLERY_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to photo ${i + 1}`}
            className={`rounded-full transition-all duration-200 ${
              i === current
                ? "w-4 h-1 bg-[#1D1D1D]"
                : "w-1 h-1 bg-[#BDBDBD]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Desktop grid gallery ── */

function DesktopImageGrid({ onOpenPopup }: { onOpenPopup: (index: number) => void }) {
  return (
    <div className="flex gap-[14px] h-[393px]">
      {/* Large image — left */}
      <button onClick={() => onOpenPopup(0)} className="relative flex-[1.015] rounded-xl overflow-hidden cursor-pointer">
        <Image
          src={GALLERY_IMAGES[0]}
          alt="Tour main photo"
          fill
          className="object-cover"
          priority
          sizes="698px"
        />
        {/* Photo count badge */}
        <div className="absolute bottom-3 right-3 bg-white/80 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
          <span className="text-[14px] font-medium text-[#1D1D1D]">
            2/{GALLERY_IMAGES.length}
          </span>
          <Images className="w-4 h-4 text-[#1D1D1D]" />
        </div>
      </button>

      {/* 2x2 grid — right */}
      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-[14px]">
        {GALLERY_IMAGES.slice(1).map((src, i) => (
          <button key={i} onClick={() => onOpenPopup(i + 1)} className="relative rounded-xl overflow-hidden cursor-pointer">
            <Image
              src={src}
              alt={`Tour photo ${i + 2}`}
              fill
              className="object-cover"
              sizes="337px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */

export function TourImageGallery() {
  const [popupIndex, setPopupIndex] = useState<number | null>(null);

  return (
    <div>
      {/* Gallery popup */}
      {popupIndex !== null && (
        <TourGalleryPopup
          images={GALLERY_IMAGES}
          initialIndex={popupIndex}
          onClose={() => setPopupIndex(null)}
        />
      )}

      {/* Mobile: swipeable slider */}
      <div className="md:hidden">
        <MobileImageSlider onOpenPopup={setPopupIndex} />
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden md:block">
        <DesktopImageGrid onOpenPopup={setPopupIndex} />
      </div>

      {/* Breadcrumb */}
      <nav className="mt-3 px-4 md:px-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-[12px] font-medium">
          {BREADCRUMB_ITEMS.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <Link
                href={item.href}
                className="text-[#BDBDBD] hover:text-[#828282] transition-colors"
              >
                {item.label}
              </Link>
              <ChevronRight className="w-3 h-3 text-[#BDBDBD]" />
            </li>
          ))}
          <li className="text-[#1D1D1D]">Name of packages</li>
        </ol>
      </nav>
    </div>
  );
}
