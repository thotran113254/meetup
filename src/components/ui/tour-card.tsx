import Image from "next/image";
import { Eye } from "lucide-react";
import Link from "next/link";

/**
 * TourCard — reusable card for tour packages and experience listings.
 * Shows image with price overlay, tag pills, and truncated title.
 * Server component — no interactivity required.
 */

export type TourCardProps = {
  image: string;
  title: string;
  price: number;
  duration: string;
  spots: number;
  tags: string[];
  slug: string;
};

export function TourCard({ image, title, price, duration, spots, tags, slug }: TourCardProps) {
  return (
    <Link
      href={`/tours/${slug}`}
      className="group flex-none w-[260px] sm:w-[280px] snap-start rounded-2xl overflow-hidden bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image container with overlays */}
      <div className="relative h-[180px] bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="280px"
        />

        {/* Eye icon — top right */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow">
          <Eye className="w-4 h-4 text-[var(--color-foreground)]" />
        </div>

        {/* Price badge — bottom left */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full">
          From ${price}
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        {/* Tag pills row */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)] font-medium">
            {duration}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)] font-medium">
            {spots} Spots
          </span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title — truncated to 2 lines */}
        <p className="text-sm font-semibold text-[var(--color-foreground)] line-clamp-2 leading-snug">
          {title}
        </p>
      </div>
    </Link>
  );
}
