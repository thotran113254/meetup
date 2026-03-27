---
phase: 4
priority: high
status: completed
effort: large
dependsOn: [1]
---

# Phase 4: Sections B — Experiences, Services, eTickets, YouTube, About, Newsletter

## Overview
Create remaining content sections. These are all independent from Phase 3 sections.

## Design Reference
- Experiences: `/tmp/figma-captures/section-03.png` through `section-07.png`
- Services: `/tmp/figma-captures/section-08.png`
- eTickets: `/tmp/figma-captures/section-09.png`
- YouTube: `/tmp/figma-captures/section-10.png`
- About: `/tmp/figma-captures/section-11.png`
- Newsletter: `/tmp/figma-captures/section-13.png`

## Files to Create
- `src/components/sections/experience-section.tsx` — Reusable for North/Mid/South
- `src/components/sections/services-section.tsx`
- `src/components/sections/etickets-section.tsx`
- `src/components/sections/youtube-section.tsx`
- `src/components/sections/about-section.tsx`
- `src/components/sections/newsletter-section.tsx`

## Section Details

### Experience Section (reused 3x)
- Heading: "Best experience in [North/Mid/South]..."
- 6 tour cards in 3x2 grid (reuses `TourCard` from Phase 3)
- Props: `region: string`, `tours: TourCard[]`

### Services Section
- "Service phụ" heading
- 4 service cards carousel: Fast track, eVisa, Airport Pickup, eSim
- Cards: image, price, service name
- Carousel with < > arrows

### eTickets Section
- Teal banner with "e-Tickets" text + airplane illustration
- Search form: From, To, Departure date, Return date
- Number of passengers, seat class
- Search button
- Light background card container

### YouTube Section
- "Our channel" heading + YouTube icon
- 5 vertical video thumbnail cards
- Labels: Our team, Travel guide, Internet vs. Local expert, Choice of expert, Travel essentials
- Placeholder images

### About Section
- "About us" heading
- Quote: "Friendship, integrity and a spirit of self-improvement..."
- Photo collage on clothesline (decorative images)
- Team group photo with landmarks

### Newsletter Section
- Light teal/mint background card
- "Like a travel expert in your inbox" heading
- Quote text
- Form: First name, Last name, Email, Subscribe button (teal)

## Success Criteria
- [ ] Experience section reusable for 3 regions
- [ ] All 6 sections render correctly
- [ ] eTickets form is functional (client-side only)
- [ ] Responsive on all breakpoints
