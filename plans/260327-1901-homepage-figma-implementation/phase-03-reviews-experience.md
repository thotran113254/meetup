# Phase 3: Reviews + Experience Sections (3 Regions)

## Overview
- **Priority:** P0 - Core content
- **Status:** Pending

## Design Specs

### Review Trip Section (Node: `13713:13730`)
- Height: 400px, full width
- Center: Large "4.9" score + "on" text + Tripadvisor logo
- 5 review cards in horizontal carousel
- **Review Card:**
  - Top: tour photo (rounded top corners)
  - Avatar circle + "Alex M" name + Tripadvisor icon + date "2023-11-20"
  - 5 stars rating
  - Bold title "Excelence"
  - Review text excerpt
  - Card: white bg, shadow, rounded corners
- Carousel arrows: circular 40px buttons
- **Mobile:** Same layout, horizontal scroll, score on top

### Experience Sections (3 identical layouts, different data)
- **North** (Node: `13230:45820`): "Best experience in Northside"
- **Mid** (Node: `13982:85916`): "Best experience in Middle"
- **South** (Node: `13982:86068`): "Best experience in Southside"

Each section:
- Height: 660px, content 1400px
- Header: Title (left) + "View all" button (right, teal)
- Layout: Left tall card (338x600) + Right 3x2 grid (6 cards 338x338)
- **Left Card (Featured):**
  - Full-height image, rounded corners
  - Progress indicator bars at top (4 bars, 96px each, 6px height)
  - Active bar highlighted
- **Grid Cards (338x338):**
  - Full image bg, rounded corners
  - Bottom overlay: "From $669" price (teal), tags "Adventure", "Solo"
  - Title below image
- Gap: 16px between cards
- **Mobile (375px):** Title row + "View all", horizontal scroll with 294x294 cards

## Files to Modify
- `src/components/sections/homepage/reviews-section.tsx`
- `src/components/sections/homepage/experience-section.tsx`

## Files to Create
- `src/components/ui/review-card.tsx`
- `src/components/ui/experience-card.tsx`
- `src/components/ui/featured-experience-card.tsx`

## Success Criteria
- Tripadvisor score display matches (4.9 + logo)
- Review cards: avatar, name, date, stars, text
- Experience: left tall card + right 3x2 grid layout
- Progress bars on featured card
- All 3 regions render with correct titles
- Mobile horizontal scroll
