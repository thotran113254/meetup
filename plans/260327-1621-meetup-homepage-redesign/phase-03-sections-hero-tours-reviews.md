---
phase: 3
priority: high
status: completed
effort: large
dependsOn: [1]
---

# Phase 3: Sections A — Hero, Tour Package, Reviews

## Overview
Create the top 3 content sections: Hero banner, Tour Package carousel, Tripadvisor Reviews.

## Design Reference
- Hero: `/tmp/figma-captures/section-00-hero.png`
- Tours: `/tmp/figma-captures/section-01.png`, `section-02.png`
- Reviews: `/tmp/figma-captures/section-02.png` (bottom half)

## Files to Create
- `src/components/sections/hero-section.tsx` — Overwrite existing
- `src/components/sections/tour-package-section.tsx` — New
- `src/components/ui/tour-card.tsx` — New reusable card
- `src/components/sections/reviews-section.tsx` — New (replaces testimonials)

## Section 1: Hero

### Design
- Full-width, white bg
- Left: "Welcome to Meetup" in script font (orange `--color-accent`), "WHERE LOCAL EXPERTS CRAFT A JOURNEY UNIQUELY YOURS" in bold dark teal
- Background: Photo collage of Vietnam landmarks (left) + team group photo (right) with yellow burst shape
- Small airplane decoration element

### Implementation
- Use `next/image` for photo collage (placeholder images)
- Script text via `font-[var(--font-script)]` class
- Bold tagline in uppercase, dark text
- Responsive: Stack on mobile

## Section 2: Tour Package

### Design
- "Tour package" heading (left), Duration Select dropdown + "View all" button (right)
- 4 tour cards in horizontal scroll/carousel
- Navigation arrows (< >)
- Cards show: image, eye icon overlay, price badge "From $669", tags (4D3N, 3 Spots, Adventure, Solo), title

### Implementation
- Horizontal scrollable container with snap-x
- `TourCard` component: image, price overlay, tags, title
- Static data array of tour packages
- Duration select: styled `<select>` element
- "View all" button in teal

### Tour Card Props
```ts
type TourCard = {
  image: string;
  title: string;
  price: number;
  duration: string;
  spots: number;
  tags: string[];
  slug: string;
}
```

## Section 3: Tripadvisor Reviews

### Design
- Large "4.9" rating + Tripadvisor logo
- 5 review cards in horizontal carousel
- Each card: avatar, name, date, 5 stars, "Excelence" title, review text
- Navigation arrows

### Implementation
- Static reviews data
- Horizontal scroll carousel (reuse pattern from tour cards)
- Star rating component (5 filled stars)
- Tripadvisor logo as SVG or text

## Success Criteria
- [ ] Hero matches Figma with script font + photo collage placeholder
- [ ] Tour cards carousel scrolls horizontally with snap
- [ ] Review cards display rating + carousel
- [ ] All sections responsive
