"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface TourGalleryPopupProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

/* ── Desktop: large image + thumbnail strip ── */

function DesktopGalleryView({ images, initialIndex, onClose }: TourGalleryPopupProps) {
  const [current, setCurrent] = useState(initialIndex ?? 0);
  const [isOpen, setIsOpen] = useState(false);
  const total = images.length;

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  const goTo = useCallback(
    (i: number) => setCurrent((i + total) % total),
    [total]
  );

  /* Keyboard nav */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goTo(current + 1);
      else if (e.key === "ArrowLeft") goTo(current - 1);
      else if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, onClose]);

  return (
    <div className={`hidden md:flex items-center justify-center fixed inset-0 z-50 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Popup card */}
      <div className={`relative bg-white rounded-xl max-w-[1024px] w-[90vw] max-h-[90vh] p-8 overflow-hidden transition-transform duration-200 ${isOpen ? "scale-100" : "scale-95"}`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[#828282] hover:text-[#1D1D1D] transition-colors cursor-pointer"
          aria-label="Close gallery"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Main image + nav arrows */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-full max-w-[850px] aspect-[850/478] rounded-xl overflow-hidden">
            <Image
              src={images[current]}
              alt={`Photo ${current + 1}`}
              fill
              className="object-cover"
              sizes="850px"
              priority
            />

            {/* Counter badge */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#F2F2F2] px-3 py-1 rounded-t-full">
              <span className="text-[12px] font-semibold text-[#2E2E2E] tracking-[0.5px]">
                {current + 1}/{total}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-[14px] overflow-x-auto max-w-full py-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`relative w-[109px] h-[72px] shrink-0 rounded-xl overflow-hidden transition-all cursor-pointer ${
                  i === current
                    ? "ring-2 ring-[#FEC84B]"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View photo ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="109px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Nav arrows — outside image area */}
        <button
          onClick={() => goTo(current - 1)}
          className="absolute left-4 top-[calc(50%-40px)] w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="absolute right-4 top-[calc(50%-40px)] w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
          aria-label="Next photo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ── Mobile: full-screen vertical scroll ── */

function MobileGalleryView({ images, onClose }: TourGalleryPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  /* Lock body scroll + trigger entrance animation */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setIsOpen(true));
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function handleClose() {
    setIsOpen(false);
    setTimeout(onClose, 250);
  }

  return (
    <div className={`md:hidden fixed inset-0 z-50 bg-black/90 transition-opacity duration-250 ${isOpen ? "opacity-100" : "opacity-0"}`}>
      {/* Header bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-sm">
        <span className="text-white text-[14px] font-bold">
          Gallery ({images.length})
        </span>
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
          aria-label="Close gallery"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Scrollable images with padding */}
      <div className={`h-[calc(100%-52px)] overflow-y-auto transition-transform duration-250 ${isOpen ? "translate-y-0" : "translate-y-8"}`}>
        <div className="flex flex-col gap-1 pb-16">
          {images.map((src, i) => (
            <div key={i} className="relative w-full aspect-[4/3]">
              <Image
                src={src}
                alt={`Photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i < 3}
              />
              {/* Per-image counter at bottom-center */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-2.5 py-0.5 rounded-full">
                <span className="text-[11px] font-semibold text-white tracking-[0.5px]">
                  {i + 1}/{images.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Exported popup component ── */

export function TourGalleryPopup({ images, initialIndex = 0, onClose }: TourGalleryPopupProps) {
  return (
    <>
      <DesktopGalleryView images={images} initialIndex={initialIndex} onClose={onClose} />
      <MobileGalleryView images={images} initialIndex={initialIndex} onClose={onClose} />
    </>
  );
}
