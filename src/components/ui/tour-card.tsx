import Image from "next/image";
import { Eye, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

/**
 * TourCard — Figma spec 338x516px card with teal gradient price badge.
 * Full-bleed image, gradient overlay at bottom 206px, white tag pills,
 * eye icon top-right, price badge with teal gradient background.
 */

export type TourCardProps = {
  image: string;
  title: string;
  price: number;
  duration: string;
  spots: number;
  tags: string[];
  slug: string;
  /** Optional className override for sizing (grid vs carousel contexts) */
  className?: string;
};

export function TourCard({ image, title, price, duration, spots, tags, slug, className }: TourCardProps) {
  return (
    <Link
      href="#"
      className={
        className ??
        "group relative flex-none w-[294px] h-[294px] md:w-[338px] md:h-[516px] snap-start rounded-[12px] overflow-hidden block"
      }
    >
      {/* Full-height background image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="338px"
      />

      {/* Eye icon button — top-right, white rounded square 36x36 */}
      <div className="absolute top-3.5 right-3.5 bg-white size-[36px] rounded-[8px] flex items-center justify-center z-10">
        <Eye className="w-5 h-5 text-[#1D1D1D]" />
      </div>

      {/* Gradient overlay — transparent to #1B5654 at bottom 206px */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[206px]"
        style={{ background: "linear-gradient(to bottom, transparent 0%, #1B5654 71%)" }}
      />

      {/* Bottom content — price badge, tags, title */}
      <div className="absolute bottom-0 left-0 right-0 p-[16px] flex flex-col gap-[10px] z-10">
        {/* Price badge — teal gradient */}
        <div
          className="flex items-center gap-0.5 px-[6px] py-[5px] rounded-[4px] w-fit"
          style={{ background: "linear-gradient(260.5deg, #3BBCB7 20%, #B1FFFC 71%)" }}
        >
          <span className="text-[10px] font-medium leading-[1.3]" style={{ color: "rgba(29,29,29,0.5)" }}>
            From
          </span>
          <span className="text-[20px] font-bold text-[#194F4D] leading-[1.2] tracking-[0.05px]">
            ${price}
          </span>
        </div>

        {/* Tag pills — white bg, h-20px, icon 12x12 */}
        <div className="flex flex-wrap gap-1">
          <span className="bg-white rounded-[4px] h-[20px] px-[4px] flex items-center gap-[4px] text-[10px] font-medium text-[#1D1D1D]">
            <Calendar className="w-3 h-3 flex-none" />
            {duration}
          </span>
          <span className="bg-white rounded-[4px] h-[20px] px-[4px] flex items-center gap-[4px] text-[10px] font-medium text-[#1D1D1D]">
            <MapPin className="w-3 h-3 flex-none" />
            {spots} Spots
          </span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-white rounded-[4px] h-[20px] px-[4px] flex items-center gap-[4px] text-[10px] font-medium text-[#1D1D1D]"
            >
              <MapPin className="w-3 h-3 flex-none" />
              {tag}
            </span>
          ))}
        </div>

        {/* Title — bold 12px white, single line truncated */}
        <p className="text-[12px] font-bold text-white leading-[1.3] truncate">
          {title}
        </p>
      </div>
    </Link>
  );
}
