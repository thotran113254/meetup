# Tour Packages Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "All Packages" page (`/tours`) matching Figma node `13561:7588` — a full tour catalog page with hero, Vietnam intro, featured packages, filterable grid with pagination, FAQ, and reused homepage sections.

**Architecture:** Next.js App Router page at `src/app/tours/page.tsx` composed of 5 new section components in `src/components/sections/tours/` plus reused `ReviewsSection` and `NewsletterSection`. Static data arrays for tour content. Client components only where interactivity required (filters, pagination, accordion, carousel).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Radix Accordion, Framer Motion, Lucide icons

**Figma Reference:**
- Desktop: `https://www.figma.com/design/V4UemzwwSm5FEe9FJteXDw/...?node-id=13561-7588`
- Mobile: `https://www.figma.com/design/V4UemzwwSm5FEe9FJteXDw/...?node-id=13802-10551`

---

## File Structure

```
src/
├── app/tours/
│   └── page.tsx                                  # Server component, metadata, section composition
├── components/sections/tours/
│   ├── tours-hero-section.tsx                    # Hero banner + marquee + breadcrumb (~80 LOC)
│   ├── vietnam-intro-section.tsx                 # Map + stats + description (~120 LOC)
│   ├── most-liked-package-section.tsx            # 2 featured large cards + carousel (~100 LOC)
│   ├── tour-package-grid-section.tsx             # 4x3 grid + filters + pagination (~150 LOC)
│   └── tour-faq-section.tsx                      # 2-column accordion FAQ (~90 LOC)
```

**Assets needed (download from Figma or use existing):**
- `public/images/tours-hero-banner.jpg` — hero background photo (tropical river scene)
- `public/images/vietnam-map.png` — Vietnam map illustration with provinces (export from Figma node `13561:8558`)
- `public/images/vietnam-intro-video-thumb.jpg` — video/image placeholder (right side of intro)
- Tour card images — reuse existing `tour-*.png` from `/public/images/`

---

## Task 1: Page Scaffold & Metadata

**Files:**
- Create: `src/app/tours/page.tsx`

- [ ] **Step 1: Create the tours page**

```tsx
// src/app/tours/page.tsx
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-utils";
import { JsonLdScript, buildOrganizationJsonLd } from "@/components/seo/json-ld-script";
import { ToursHeroSection } from "@/components/sections/tours/tours-hero-section";
import { VietnamIntroSection } from "@/components/sections/tours/vietnam-intro-section";
import { MostLikedPackageSection } from "@/components/sections/tours/most-liked-package-section";
import { TourPackageGridSection } from "@/components/sections/tours/tour-package-grid-section";
import { ReviewsSection } from "@/components/sections/homepage/reviews-section";
import { TourFaqSection } from "@/components/sections/tours/tour-faq-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";

export const metadata: Metadata = generatePageMetadata({
  title: "Tour Packages - Explore Vietnam with Local Experts",
  description: "Browse curated tour packages across Vietnam. Filter by style and duration. Book authentic local-guided experiences in North, Mid, and South Vietnam.",
  path: "/tours",
});

export default function ToursPage() {
  return (
    <>
      <JsonLdScript data={[buildOrganizationJsonLd()]} />
      <ToursHeroSection />
      <VietnamIntroSection />
      <MostLikedPackageSection />
      <TourPackageGridSection />
      <ReviewsSection />
      <TourFaqSection />
      <NewsletterSection />
    </>
  );
}
```

- [ ] **Step 2: Create section directory**

```bash
mkdir -p src/components/sections/tours
```

- [ ] **Step 3: Verify build compiles** (will fail until sections exist — expected)

---

## Task 2: Hero Section with Marquee & Breadcrumb

**Files:**
- Create: `src/components/sections/tours/tours-hero-section.tsx`

**Figma reference:** Node `13563:65239` — 1600×576px total (524px image + 12px breadcrumb + 40px gap)

**Design specs:**
- Background image: tropical river/coconut scene, rounded-[12px], 1546×487px inner (27px horizontal padding, 37px top)
- Teal gradient overlay at bottom: `linear-gradient(to bottom, transparent, #3BBCB7)` covering bottom 209px
- Marquee text: "TOUR PACKAGES * TOUR PACKAGES *" — font DT Phudu Medium 90px, gradient text (white to #C8FFFD), positioned at bottom of image, scrolling horizontally via CSS animation
- Breadcrumb below image: "Homepage > Tour Packages" — 12px BT Beau Sans Medium, "Homepage" in #BDBDBD, "Tour Packages" in #1D1D1D, chevron separator

- [ ] **Step 1: Create tours-hero-section.tsx**

```tsx
// src/components/sections/tours/tours-hero-section.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function ToursHeroSection() {
  return (
    <section className="w-full bg-[var(--color-background)] px-4 sm:px-6 lg:px-[27px] pt-4 sm:pt-[37px]">
      {/* Hero banner with image + gradient + marquee */}
      <motion.div
        className="relative w-full max-w-[1546px] mx-auto overflow-hidden rounded-xl"
        style={{ aspectRatio: "1546 / 487" }}
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

        {/* Teal gradient overlay — bottom 209px */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[209px]"
          style={{ background: "linear-gradient(to bottom, rgba(59,188,183,0) 0%, #3BBCB7 100%)" }}
        />

        {/* Marquee text — scrolling "TOUR PACKAGES * TOUR PACKAGES *" */}
        <div className="absolute bottom-0 left-0 right-0 h-[108px] overflow-hidden">
          <div className="animate-marquee flex items-center gap-[100px] whitespace-nowrap text-[48px] md:text-[90px] font-medium leading-[1.2]"
            style={{ fontFamily: "'DT Phudu', sans-serif" }}
          >
            {[...Array(6)].map((_, i) => (
              <span key={i} className="shrink-0 bg-clip-text text-transparent bg-gradient-to-b from-white to-[#C8FFFD]">
                {i % 2 === 0 ? "Tour Packages" : "*"}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Breadcrumb — below hero */}
      <nav className="max-w-[1546px] mx-auto mt-3 lg:mt-4 px-2 lg:px-[73px]" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-[12px] font-medium leading-[1.2]">
          <li>
            <Link href="/" className="text-[#BDBDBD] hover:text-[#828282] transition-colors">
              Homepage
            </Link>
          </li>
          <li><ChevronRight className="w-3 h-3 text-[#BDBDBD]" /></li>
          <li className="text-[#1D1D1D]">Tour Packages</li>
        </ol>
      </nav>

      <h1 className="sr-only">Tour Packages — Explore Vietnam with Local Experts</h1>
    </section>
  );
}
```

- [ ] **Step 2: Add marquee animation to globals.css**

Add to `src/app/globals.css`:
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 20s linear infinite;
}
```

- [ ] **Step 3: Download hero banner image from Figma**

Export the hero background image from Figma node `13561:7592` and save as `public/images/tours-hero-banner.jpg`.

- [ ] **Step 4: Verify component renders — `pnpm typecheck`**

---

## Task 3: Vietnam Intro Section

**Files:**
- Create: `src/components/sections/tours/vietnam-intro-section.tsx`

**Figma reference:** Node `13561:7611` — 1600×453px

**Design specs:**
- Left column: "INTRODUCE" (12px uppercase) + "about" below + "Vietnam" large decorative script font (~100px)
- Center: Vietnam map illustration (344×453px) with circular location pin markers containing photos
- Right column (x=1044, w=458): video/image placeholder (458×256, gray bg with play icon) + description text (458×108, 14px Regular #828282)
- Bottom-left stats (x=100, y=280): 3 stat blocks side-by-side (170px each, gap ~24px)
  - "20 Million" — bold 21px + subtitle 12px gray (2 lines)
  - "#1 Growth" — bold 21px + subtitle
  - "9 Consecutive Years" — bold 21px + subtitle

- [ ] **Step 1: Create vietnam-intro-section.tsx**

```tsx
// src/components/sections/tours/vietnam-intro-section.tsx
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-animations";

const STATS = [
  {
    value: "20 Million",
    description: "Historical record of international arrivals reached in December 2025",
  },
  {
    value: "#1 Growth",
    description: "Ranked the fastest-growing tourism destination in Asia by UN Tourism",
  },
  {
    value: "9 Consecutive Years",
    description: 'The only nation to be "Asia\'s Best Golf Destination" since 2017',
  },
];

export function VietnamIntroSection() {
  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-0 lg:min-h-[453px]">
            {/* Left: Title + Map */}
            <div className="flex-1 relative">
              {/* Section label */}
              <div className="mb-2">
                <p className="text-[12px] font-medium uppercase tracking-wider text-[var(--color-foreground)]">
                  Introduce
                </p>
                <p className="text-[12px] font-medium text-[var(--color-foreground)]">
                  about
                </p>
              </div>

              {/* "Vietnam" decorative text */}
              <h2
                className="text-[60px] md:text-[80px] lg:text-[100px] leading-[1] text-[var(--color-foreground)]"
                style={{ fontFamily: "'Italianno', cursive" }}
              >
                Vietnam
              </h2>

              {/* Vietnam map — centered in remaining space */}
              <div className="relative w-[280px] md:w-[344px] h-[350px] md:h-[453px] mx-auto lg:absolute lg:left-[40%] lg:-translate-x-1/2 lg:top-0">
                <Image
                  src="/images/vietnam-map.png"
                  alt="Map of Vietnam with tour destinations"
                  fill
                  className="object-contain"
                  sizes="344px"
                />
              </div>

              {/* Stats — bottom left */}
              <div className="flex flex-wrap gap-6 mt-8 lg:absolute lg:bottom-0 lg:left-0 lg:w-[558px]">
                {STATS.map((stat) => (
                  <div key={stat.value} className="w-[170px]">
                    <p className="text-[18px] md:text-[21px] font-bold text-[var(--color-foreground)] leading-[1.2]">
                      {stat.value}
                    </p>
                    <p className="text-[12px] text-[#828282] leading-[1.5] mt-2">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Video placeholder + description */}
            <div className="w-full lg:w-[458px] shrink-0">
              {/* Video/image placeholder */}
              <div className="relative w-full aspect-video lg:h-[256px] bg-[#D9D9D9] rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7L8 5z" fill="#1D1D1D" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description text */}
              <p className="mt-5 text-[14px] leading-[1.5] tracking-[0.035px] text-[#828282]">
                Lorem ipsum dolor sit amet consectetur. Scelerisque fermentum aliquet convallis turpis lectus orci arcu ultrices viverra. Vitae ut nam adipiscing nunc sed at. Arcu sem sed arcu lacus. Sed lacus semper eu lectus fermentum eu a.Lorem ipsum dolor sit amet consectetur. Scelerisque fermentum aliquet convallis turpis lectus orci arcu ultrices viverra. Vitae ut nam adipiscing nunc sed at. Arcu sem sed
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Export Vietnam map from Figma**

Export the map group from Figma node `13561:8558` as PNG/SVG → save to `public/images/vietnam-map.png`. Include the location pins with circular photo markers.

- [ ] **Step 3: Verify — `pnpm typecheck`**

---

## Task 4: Most Liked Package Section

**Files:**
- Create: `src/components/sections/tours/most-liked-package-section.tsx`

**Figma reference:** Node `13561:7597` — 1600×573px

**Design specs:**
- Title: "Most Liked Package" — H3, 32px Bold, #1D1D1D
- 2 large cards side by side (692×516px each, gap-16px), rounded-12px
- Each card: full-bleed image, gradient overlay at bottom (transparent → #1B5654), price badge, tags, title
- Left card has "Overall Plan" popup overlay (white panel with scrollable text inside the card area)
- Eye icon top-right of each card (36×36 white rounded square)
- Carousel arrows: 40×40 rounded-full bg-black/50, positioned at vertical center, outside card area (left at x=40, right at x=1480)

- [ ] **Step 1: Create most-liked-package-section.tsx**

```tsx
// src/components/sections/tours/most-liked-package-section.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Calendar, MapPin, X } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-animations";

type FeaturedTour = {
  id: string;
  image: string;
  title: string;
  price: number;
  duration: string;
  spots: number;
  tags: string[];
  flights: number;
  description: string;
};

const FEATURED_TOURS: FeaturedTour[] = [
  {
    id: "featured-1",
    image: "/images/tour-1-floating-market.png",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    flights: 4,
    description: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's Lorem ipsum...",
  },
  {
    id: "featured-2",
    image: "/images/tour-2-hoi-an.png",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    flights: 4,
    description: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.",
  },
];

function FeaturedCard({ tour, showOverlay }: { tour: FeaturedTour; showOverlay?: boolean }) {
  const [overlayOpen, setOverlayOpen] = useState(showOverlay ?? false);

  return (
    <div className="relative flex-1 min-w-0 h-[400px] md:h-[516px] rounded-xl overflow-hidden group">
      <Image src={tour.image} alt={tour.title} fill className="object-cover" sizes="692px" />

      {/* Eye icon */}
      <button className="absolute top-3.5 right-3.5 bg-white size-9 rounded-lg flex items-center justify-center z-10 cursor-pointer">
        <Eye className="w-5 h-5 text-[#1D1D1D]" />
      </button>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[206px]"
        style={{ background: "linear-gradient(to bottom, rgba(59,188,183,0), rgba(35,113,110,0.74) 47%, #1B5654)" }}
      />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 w-full md:w-[338px] p-4 flex flex-col gap-2.5 z-10">
        <div className="flex items-center gap-0.5 px-1.5 py-[5px] rounded w-fit"
          style={{ background: "linear-gradient(260.5deg, #3BBCB7 20%, #B1FFFC 71%)" }}
        >
          <span className="text-[10px] font-medium leading-[1.3] text-[#1D1D1D]/50">From</span>
          <span className="text-[20px] font-bold text-[#194F4D] leading-[1.2] tracking-[0.05px]">${tour.price}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="bg-white rounded h-5 px-1 flex items-center gap-1 text-[10px] font-medium text-[#1D1D1D]">
            <Calendar className="w-3 h-3" />{tour.duration}
          </span>
          <span className="bg-white rounded h-5 px-1 flex items-center gap-1 text-[10px] font-medium text-[#1D1D1D]">
            <MapPin className="w-3 h-3" />{tour.spots} Spots
          </span>
          {tour.tags.map(tag => (
            <span key={tag} className="bg-white rounded h-5 px-1 flex items-center gap-1 text-[10px] font-medium text-[#1D1D1D]">
              <MapPin className="w-3 h-3" />{tag}
            </span>
          ))}
        </div>
        <p className="text-[12px] font-bold text-white leading-[1.3] truncate">{tour.title}</p>
      </div>

      {/* Overall Plan popup overlay — inside card */}
      {overlayOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-2.5 z-20">
          <div className="bg-white rounded-xl p-4 max-h-[344px] overflow-y-auto flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px]">
                Number of Domestic Flights: <span className="text-[#3BBCB7]">{String(tour.flights).padStart(2, "0")}</span>
              </p>
              <button onClick={() => setOverlayOpen(false)} className="cursor-pointer">
                <X className="w-6 h-6 text-[#1D1D1D]" />
              </button>
            </div>
            <div className="h-px bg-[#1D1D1D]/10" />
            <div>
              <p className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px] mb-1">Overall Plan</p>
              <p className="text-[14px] text-[#828282] leading-[1.5] tracking-[0.035px]">{tour.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MostLikedPackageSection() {
  return (
    <section className="section-padding bg-white relative">
      <div className="container-wide flex flex-col gap-5">
        <ScrollReveal>
          <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)]">
            Most Liked Package
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="relative">
            {/* Carousel arrows */}
            <button aria-label="Previous" className="hidden md:flex absolute -left-5 lg:-left-[60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center z-10 cursor-pointer">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex flex-col md:flex-row gap-4">
              {FEATURED_TOURS.map((tour, i) => (
                <FeaturedCard key={tour.id} tour={tour} showOverlay={i === 0} />
              ))}
            </div>

            <button aria-label="Next" className="hidden md:flex absolute -right-5 lg:-right-[60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 items-center justify-center z-10 cursor-pointer">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify — `pnpm typecheck`**

---

## Task 5: Tour Package Grid with Filters & Pagination

**Files:**
- Create: `src/components/sections/tours/tour-package-grid-section.tsx`

**Figma reference:** Node `13680:10116` — 1600×1721px

**Design specs:**
- Title: "Tour package" — H3 32px Bold + filter dropdowns right-aligned (2 INPUT FIELDs, 199px each, gap-8px)
- Grid: 4 columns × 3 rows of TourCard (338×516px), gap-16px horizontal, gap-20px vertical
- Pagination: 6 buttons (40×40px each, gap-8px), centered below grid, active button has teal bg
- Reuses existing `TourCard` component and `FilterDropdown` with `STYLE_OPTIONS` and `DURATION_OPTIONS`

- [ ] **Step 1: Create tour-package-grid-section.tsx**

```tsx
// src/components/sections/tours/tour-package-grid-section.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TourCard, type TourCardProps } from "@/components/ui/tour-card";
import { FilterDropdown, STYLE_OPTIONS, DURATION_OPTIONS } from "@/components/ui/filter-dropdown";
import { ScrollReveal } from "@/components/ui/scroll-animations";

// 12 tour cards for the grid (3 rows × 4 columns)
const ALL_TOURS: TourCardProps[] = Array.from({ length: 12 }, (_, i) => ({
  image: `/images/tour-${(i % 4) + 1}-${["floating-market", "hoi-an", "mekong", "palm-trees"][i % 4]}.png`,
  title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
  price: 669,
  duration: "4D3N",
  spots: 3,
  tags: ["Adventure", "Solo"],
  slug: `tour-package-${i + 1}`,
}));

const ITEMS_PER_PAGE = 12;
const TOTAL_PAGES = 6;

export function TourPackageGridSection() {
  const [styleOpen, setStyleOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [style, setStyle] = useState("all");
  const [duration, setDuration] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const styleLabel = STYLE_OPTIONS.find(o => o.value === style)?.label ?? "Style";
  const durationLabel = DURATION_OPTIONS.find(o => o.value === duration)?.label ?? "Duration";

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide flex flex-col gap-5">
        {/* Header: title + filters */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)]">
              Tour package
            </h2>

            <div className="flex gap-2">
              {/* Style filter */}
              <div className="relative">
                <button
                  onClick={() => { setStyleOpen(o => !o); setDurationOpen(false); }}
                  className="flex items-center justify-between w-[160px] md:w-[199px] h-10 border border-[var(--color-border)] rounded-xl px-3 bg-white text-[12px] md:text-[14px] font-bold text-[var(--color-foreground)] cursor-pointer"
                >
                  <span className="truncate">{styleLabel}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)] flex-none" />
                </button>
                <FilterDropdown open={styleOpen} onClose={() => setStyleOpen(false)} options={STYLE_OPTIONS} selected={style} onSelect={setStyle} />
              </div>

              {/* Duration filter */}
              <div className="relative">
                <button
                  onClick={() => { setDurationOpen(o => !o); setStyleOpen(false); }}
                  className="flex items-center justify-between w-[160px] md:w-[199px] h-10 border border-[var(--color-border)] rounded-xl px-3 bg-white text-[12px] md:text-[14px] font-bold text-[var(--color-foreground)] cursor-pointer"
                >
                  <span className="truncate">{durationLabel}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)] flex-none" />
                </button>
                <FilterDropdown open={durationOpen} onClose={() => setDurationOpen(false)} options={DURATION_OPTIONS} selected={duration} onSelect={setDuration} />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Grid — 4 columns desktop, 2 tablet, 1 mobile */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-x-4 lg:gap-y-5">
            {ALL_TOURS.map(tour => (
              <TourCard key={tour.slug} {...tour} />
            ))}
          </div>
        </ScrollReveal>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl text-[14px] font-bold cursor-pointer transition-colors ${
                currentPage === page
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[#F3F3F3] text-[var(--color-foreground)] hover:bg-[#E5E5E5]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify — `pnpm typecheck`**

---

## Task 6: FAQ Section (2-Column Accordion)

**Files:**
- Create: `src/components/sections/tours/tour-faq-section.tsx`

**Figma reference:** Node `13622:70571` — 1600×341px

**Design specs:**
- Title: "Frequently Asked Questions" — H3 32px Bold #1D1D1D
- 2-column layout (692px each, gap-16px)
- Each column: 4 accordion items (gap-8px)
- Active/open item: bg #3BBCB7, white bold text 14px, chevron rotated 180deg (white)
  - Content panel below: padding 8px horizontal + 12px bottom, gray text #828282 14px Regular
- Closed item: bg #F3F3F3, dark text #1D1D1D bold 14px, chevron down (dark), h-44px (overflow hidden)
- Rounded-12px per item

- [ ] **Step 1: Create tour-faq-section.tsx**

```tsx
// src/components/sections/tours/tour-faq-section.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-animations";

type FaqItem = { question: string; answer: string };

const FAQ_ITEMS: FaqItem[] = [
  { question: "What to bring", answer: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's" },
  { question: "Where to stay", answer: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs." },
  { question: "What working", answer: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs." },
  { question: "Where to going", answer: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs." },
  { question: "What to bring", answer: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's" },
  { question: "What working", answer: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs." },
  { question: "What working", answer: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs." },
  { question: "Where to going", answer: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs." },
];

function FaqAccordionItem({ item, index, isOpen, onToggle }: { item: FaqItem; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between pl-3 pr-2 py-3 rounded-xl cursor-pointer transition-colors ${
          isOpen ? "bg-[#3BBCB7]" : "bg-[#F3F3F3]"
        }`}
      >
        <span className={`text-[14px] font-bold leading-[1.3] tracking-[0.14px] text-left ${
          isOpen ? "text-white" : "text-[#1D1D1D]"
        }`}>
          {index + 1}. {item.question}
        </span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
          isOpen ? "rotate-180 text-white" : "text-[#1D1D1D]"
        }`} />
      </button>
      {isOpen && (
        <div className="px-2 pb-3">
          <p className="text-[14px] text-[#828282] leading-[1.5] tracking-[0.035px]">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function TourFaqSection() {
  // Track open items per column — default: first item in each column open
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0, 4]));

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const leftColumn = FAQ_ITEMS.slice(0, 4);
  const rightColumn = FAQ_ITEMS.slice(4, 8);

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide flex flex-col gap-5">
        <ScrollReveal>
          <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[var(--color-foreground)]">
            Frequently Asked Questions
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left column */}
            <div className="flex-1 flex flex-col gap-2">
              {leftColumn.map((item, i) => (
                <FaqAccordionItem
                  key={`left-${i}`}
                  item={item}
                  index={i + 1}
                  isOpen={openItems.has(i)}
                  onToggle={() => toggleItem(i)}
                />
              ))}
            </div>

            {/* Right column */}
            <div className="flex-1 flex flex-col gap-2">
              {rightColumn.map((item, i) => (
                <FaqAccordionItem
                  key={`right-${i}`}
                  item={item}
                  index={i + 5}
                  isOpen={openItems.has(i + 4)}
                  onToggle={() => toggleItem(i + 4)}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify — `pnpm typecheck`**

---

## Task 7: Final Assembly, Responsive & Build Verification

**Files:**
- Modify: `src/app/tours/page.tsx` (ensure all imports correct)
- Verify: all section components

- [ ] **Step 1: Ensure all imports in page.tsx are correct**

Review `src/app/tours/page.tsx` — all section imports should resolve. Check that `JsonLdScript` and `buildOrganizationJsonLd` exports exist.

- [ ] **Step 2: Responsive review checklist**

All sections must work at these breakpoints:
- Mobile: 375px (single column, stacked layout)
- Tablet: 768px (2 columns for grid, side-by-side for FAQ)
- Desktop: 1024px+ (4-column grid, full layout)

Key responsive behaviors:
- Hero: aspect ratio maintained, marquee text scales down (48px mobile → 90px desktop)
- Vietnam Intro: stacks vertically on mobile (title → map → stats → description)
- Most Liked: stacks to single column on mobile
- Tour Grid: 1 col → 2 col → 4 col
- FAQ: stacks to single column on mobile
- Pagination: wraps if needed

- [ ] **Step 3: Run TypeScript check**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Run production build**

```bash
pnpm build
```

Expected: build passes with no errors.

- [ ] **Step 5: Visual review against Figma**

Open `http://localhost:3000/tours` and compare each section against the Figma screenshot at node `13561:7588`.

- [ ] **Step 6: Commit**

```bash
git add src/app/tours/ src/components/sections/tours/
git commit -m "feat: implement tour packages page with hero, Vietnam intro, grid, FAQ sections"
```

---

## Task 8: Mobile Responsive Optimization (375px)

**Figma reference:** Node `13802:10551` — "(MB) PICK YOUR STYLE [All Packages PAGE]" — 375×7786px

**Critical mobile layout differences from desktop:**

| Section | Desktop | Mobile (375px) |
|---------|---------|----------------|
| Hero | 1546×487px, marquee 90px | 343×257px, marquee ~48px, 16px side padding |
| Vietnam Intro | Horizontal: title+map left, video right | Title top → [stats left + map right] → video below full-width |
| Most Liked | 2 cards side-by-side 692×516px | Horizontal scroll, cards 294×294px (square) |
| Tour Grid | 4 columns, cards 338×516px | 1 column, cards 343×343px (square, full-width) |
| FAQ | 2 columns × 4 items | 1 column × 8 items |
| Filters | 199px each, right-aligned | 167.5px each, side-by-side below title |

### Step-by-step changes per component:

- [ ] **Step 1: Update `tours-hero-section.tsx` for mobile**

Mobile hero: 343×257px (not 1546×487px). Padding 16px sides.

```tsx
// Change the hero container classes:
// FROM:
className="w-full bg-[var(--color-background)] px-4 sm:px-6 lg:px-[27px] pt-4 sm:pt-[37px]"
// TO (add mobile-first sizing):
className="w-full bg-[var(--color-background)] px-4 sm:px-6 lg:px-[27px] pt-4 sm:pt-[37px]"

// The aspect ratio already scales — 1546/487 works at all sizes
// Marquee text already scales: text-[48px] md:text-[90px] ✓
// Breadcrumb 16px left padding on mobile: px-2 lg:px-[73px] ✓
```

No code changes needed — already responsive via existing classes.

- [ ] **Step 2: Update `vietnam-intro-section.tsx` for mobile layout**

Mobile layout is fundamentally different from desktop. Replace the component layout:

```tsx
// Mobile (375px):
//   Row 1: "Introduce about" + "Vietnam" title (full width)
//   Row 2: [Stats vertically stacked (127px) | Map (flex-1, ~233px)] side-by-side
//   Row 3: Video placeholder (full width, 343×191px) + description below
//
// Desktop (1024px+):
//   Left column: Title + Map centered + Stats at bottom
//   Right column (458px): Video + description

export function VietnamIntroSection() {
  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <ScrollReveal>
          {/* Title — always at top */}
          <div className="mb-4 lg:mb-0">
            <p className="text-[10px] lg:text-[12px] font-medium uppercase tracking-wider text-[var(--color-foreground)]">
              Introduce
            </p>
            <p className="text-[10px] lg:text-[12px] font-medium text-[var(--color-foreground)]">
              about
            </p>
            <h2
              className="text-[40px] md:text-[60px] lg:text-[100px] leading-[1] text-[var(--color-foreground)]"
              style={{ fontFamily: "'Italianno', cursive" }}
            >
              Vietnam
            </h2>
          </div>

          {/* Mobile: [Stats | Map] side by side. Desktop: complex positioning */}
          <div className="flex flex-col lg:flex-row lg:gap-0 lg:relative lg:min-h-[453px]">

            {/* Mobile: Stats + Map row */}
            <div className="flex gap-4 lg:flex-1 lg:relative">
              {/* Stats — stacked vertically on mobile, absolute bottom-left on desktop */}
              <div className="flex flex-col gap-6 w-[127px] shrink-0 lg:absolute lg:bottom-0 lg:left-0 lg:w-[558px] lg:flex-row">
                {STATS.map((stat) => (
                  <div key={stat.value} className="lg:w-[170px]">
                    <p className="text-[14px] lg:text-[21px] font-bold text-[var(--color-foreground)] leading-[1.2]">
                      {stat.value}
                    </p>
                    <p className="text-[10px] lg:text-[12px] text-[#828282] leading-[1.5] mt-1 lg:mt-2">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="relative flex-1 h-[307px] lg:w-[344px] lg:h-[453px] lg:absolute lg:left-[40%] lg:-translate-x-1/2 lg:top-0">
                <Image
                  src="/images/vietnam-map.png"
                  alt="Map of Vietnam with tour destinations"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 233px, 344px"
                />
              </div>
            </div>

            {/* Video + Description — full width on mobile, 458px right column on desktop */}
            <div className="mt-6 lg:mt-0 lg:w-[458px] lg:shrink-0">
              <div className="relative w-full aspect-video lg:h-[256px] bg-[#D9D9D9] rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7L8 5z" fill="#1D1D1D" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="mt-4 lg:mt-5 text-[12px] lg:text-[14px] leading-[1.5] tracking-[0.035px] text-[#828282]">
                Lorem ipsum dolor sit amet consectetur. Scelerisque fermentum aliquet convallis turpis lectus orci arcu ultrices viverra.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `most-liked-package-section.tsx` for mobile**

Mobile: horizontal scroll of 294×294 square cards (not 692×516 side-by-side).

Key change in `MostLikedPackageSection`:
```tsx
// Replace the flex layout with scroll on mobile:
<div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide md:overflow-visible md:snap-none">
  {FEATURED_TOURS.map((tour, i) => (
    <FeaturedCard key={tour.id} tour={tour} showOverlay={i === 0} />
  ))}
</div>

// Update FeaturedCard sizing:
// FROM: className="relative flex-1 min-w-0 h-[400px] md:h-[516px]..."
// TO:
className="relative flex-none w-[294px] h-[294px] md:flex-1 md:w-auto md:h-[516px] snap-start rounded-xl overflow-hidden group"
```

- [ ] **Step 4: Verify `TourCard` handles square mobile layout**

Existing `TourCard` already has: `w-[294px] h-[294px] md:w-[338px] md:h-[516px]`.

For the grid section, cards need to be full-width (343px) and square on mobile. Update TourCard or grid wrapper:

```tsx
// In tour-package-grid-section.tsx, the grid already uses:
// grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
//
// TourCard on mobile in grid context needs to stretch full width:
// Add a wrapper or pass className prop to make cards full-width on mobile grid:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-x-4 lg:gap-y-5">
  {ALL_TOURS.map(tour => (
    <div key={tour.slug} className="w-full aspect-square sm:aspect-auto sm:h-auto">
      <TourCard {...tour} />
    </div>
  ))}
</div>
```

Alternative: Pass a `className` prop to TourCard for grid context to override sizing:
```tsx
// If TourCard doesn't accept className, wrap it and force full-width:
<div className="[&>a]:w-full [&>a]:h-auto [&>a]:aspect-square sm:[&>a]:w-[338px] sm:[&>a]:h-[516px] sm:[&>a]:aspect-auto">
  <TourCard {...tour} />
</div>
```

- [ ] **Step 5: Update filter dropdowns for mobile**

Mobile filters: 167.5px each, stacked below title.

Already handled by existing classes:
```tsx
// flex-col md:flex-row — title stacks above filters on mobile ✓
// w-[160px] md:w-[199px] — close to 167.5px ✓
```

Adjust to exact mobile width:
```tsx
// FROM: w-[160px] md:w-[199px]
// TO: w-[calc(50%-4px)] md:w-[199px]
// This makes both filters share the full mobile width
```

Wrap filters in a full-width container on mobile:
```tsx
<div className="flex gap-2 w-full md:w-auto">
  <div className="relative flex-1 md:flex-none">
    <button className="... w-full md:w-[199px] ...">
```

- [ ] **Step 6: FAQ single column on mobile — already handled**

FAQ already uses `flex-col md:flex-row gap-4` ✓. On mobile, all 8 items stack into 1 column.

- [ ] **Step 7: Test at mobile breakpoint**

```bash
# Start dev server
pnpm dev

# Open http://localhost:3000/tours
# Use Chrome DevTools → toggle device toolbar → set to 375px width
# Verify each section matches mobile Figma (node 13802:10551)
```

Checklist:
- [ ] Hero: 343×257px area, marquee visible, breadcrumb below
- [ ] Vietnam Intro: Stats left, map right, video below full-width
- [ ] Most Liked: Horizontal scroll, 294×294 square cards
- [ ] Tour Grid: 1 column, cards full-width and square (343×343)
- [ ] Pagination: Centered, wraps if needed
- [ ] FAQ: Single column, 8 items
- [ ] Review Trip: Already responsive ✓
- [ ] Newsletter: Already responsive ✓
- [ ] No horizontal overflow at 375px

- [ ] **Step 8: Commit mobile responsive changes**

```bash
git add -A src/components/sections/tours/
git commit -m "feat: add mobile responsive layout for tour packages page (375px)"
```

---

## Reused Components (No Changes Needed)

| Component | Source | Section on Page |
|-----------|--------|-----------------|
| `SiteHeader` | `src/components/layout/site-header.tsx` | Top nav (via layout.tsx) |
| `SiteFooter` | `src/components/layout/site-footer.tsx` | Footer (via layout.tsx) |
| `ReviewsSection` | `src/components/sections/homepage/reviews-section.tsx` | Tripadvisor reviews |
| `NewsletterSection` | `src/components/sections/homepage/newsletter-section.tsx` | Email subscription |
| `TourCard` | `src/components/ui/tour-card.tsx` | Grid cards |
| `FilterDropdown` | `src/components/ui/filter-dropdown.tsx` | Style/Duration filters |
| `ScrollReveal` | `src/components/ui/scroll-animations.tsx` | Scroll animations |

## Assets Checklist

- [ ] `public/images/tours-hero-banner.jpg` — Export from Figma node `13561:7592`
- [ ] `public/images/vietnam-map.png` — Export from Figma node `13561:8558` (entire map group with pins)
- [ ] Tour card images reused from existing assets

## Design Tokens Reference

| Token | Value | Usage |
|-------|-------|-------|
| PRIMARY/blue-500 | `#3BBCB7` | Active FAQ, buttons, gradients |
| PRIMARY/blue-900 | `#194F4D` | Price text |
| GREYSCALE/90 | `#1D1D1D` | Body text, dark elements |
| GREYSCALE/30 | `#828282` | Subtitle, description text |
| GREYSCALE/10 | `#BDBDBD` | Breadcrumb inactive |
| BACKGROUND/20 | `#F3F3F3` | Inactive FAQ, pagination |
| Font: BT Beau Sans | Bold/Medium/Regular | All body text |
| Font: DT Phudu | Medium | Marquee "TOUR PACKAGES" |
| Font: Italianno (or decorative) | — | "Vietnam" script text |
