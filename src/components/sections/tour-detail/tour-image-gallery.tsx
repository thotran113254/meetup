"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Images } from "lucide-react";

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

export function TourImageGallery() {
  return (
    <div>
      {/* Image grid */}
      <div className="flex gap-[14px] h-[280px] md:h-[393px]">
        {/* Large image — left */}
        <div className="relative flex-[1.015] rounded-xl overflow-hidden">
          <Image
            src={GALLERY_IMAGES[0]}
            alt="Tour main photo"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 698px"
          />
          {/* Photo count badge */}
          <div className="absolute bottom-3 right-3 bg-white rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <span className="text-[14px] font-medium text-[#1D1D1D]">
              2/30
            </span>
            <Images className="w-4 h-4 text-[#1D1D1D]" />
          </div>
        </div>

        {/* 2x2 grid — right */}
        <div className="hidden md:grid flex-1 grid-cols-2 grid-rows-2 gap-[14px]">
          {GALLERY_IMAGES.slice(1).map((src, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden">
              <Image
                src={src}
                alt={`Tour photo ${i + 2}`}
                fill
                className="object-cover"
                sizes="337px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="mt-3" aria-label="Breadcrumb">
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
