import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * ContactHeroSection — Breadcrumb + "NEED LOCAL EXPERT ADVICE" heading.
 * Matches Figma design node 13925:89580.
 */
export function ContactHeroSection() {
  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-[100px] pt-4 sm:pt-6 pb-0">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-[40px]">
        <ol className="flex items-center gap-2 text-[12px] font-medium leading-[1.2]">
          <li>
            <Link href="/" className="text-[#BDBDBD] hover:text-[#828282] transition-colors">
              Homepage
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-[#BDBDBD]" />
          </li>
          <li className="text-[#1D1D1D]">Contact</li>
        </ol>
      </nav>

      {/* Page title */}
      <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[#1D1D1D] leading-[1.2] tracking-[0]">
        NEED LOCAL EXPERT ADVICE
      </h1>
    </section>
  );
}
