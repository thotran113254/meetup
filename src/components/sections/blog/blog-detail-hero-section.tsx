import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  /** Post title shown as last breadcrumb item */
  postTitle: string;
  /** Hero banner image src */
  heroImage: string;
  /** Alt text for hero image */
  heroAlt: string;
}

/**
 * BlogDetailHeroSection — full-width hero banner with rounded corners + breadcrumb row.
 * Matches Figma node 13925:85935 (desktop) and 13925:86013 (mobile).
 * Desktop: 1546×487px image inside a 1600px container with 27px horizontal padding.
 * Mobile: 343×257px image with 16px padding.
 */
export function BlogDetailHeroSection({ postTitle, heroImage, heroAlt }: Props) {
  return (
    <section className="w-full bg-white">
      {/* Hero image — rounded xl, 487px desktop / 257px mobile */}
      <div className="px-4 sm:px-[27px] pt-4 sm:pt-[37px]">
        <div className="relative w-full max-w-[1546px] mx-auto overflow-hidden rounded-xl h-[257px] md:h-[487px]">
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1546px"
          />
        </div>
      </div>

      {/* Breadcrumb — Homepage > Blog > Post title */}
      <nav
        className="max-w-[1400px] mx-auto mt-3 lg:mt-4 px-4 sm:px-6 lg:px-[100px]"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[10px] md:text-[12px] font-medium leading-[1.2]">
          <li>
            <Link
              href="/"
              className="text-[#BDBDBD] hover:text-[#828282] transition-colors whitespace-nowrap"
            >
              Homepage
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-[#BDBDBD]" />
          </li>
          <li>
            <Link
              href="/blog"
              className="text-[#BDBDBD] hover:text-[#828282] transition-colors"
            >
              Blog
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-[#BDBDBD]" />
          </li>
          <li className="text-[#1D1D1D] line-clamp-1">{postTitle}</li>
        </ol>
      </nav>
    </section>
  );
}
