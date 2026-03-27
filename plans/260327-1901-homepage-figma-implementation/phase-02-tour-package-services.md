# Phase 2: Tour Package + Services Sections

## Overview
- **Priority:** P0 - Core content
- **Status:** Pending

## Design Specs

### Tour Package Section (Node: `13230:45804`)
- Height: 576px, content 1400px centered (100px padding)
- Header row: "Tour package" title (left), Duration dropdown + "View all" button (right)
- INPUT FIELD search bar next to View all button
- 4 tour cards (338x516) with 16px gap, horizontal carousel
- Carousel arrows: circular 40px buttons on sides
- **Tour Card Design:**
  - Full-height image background with rounded corners (12px)
  - Eye/visibility icon top-right
  - Bottom overlay: "From $669" price tag (teal bg, white text)
  - Tags below: "4D3N", "3 Spots", "Adventure", "Solo" (bordered pills)
  - Title text below tags
  - First card (active state): white overlay panel showing "Number of Domestic Flights: 04", "Overall Plan" description
- **Mobile (375px):** Title + "View all" btn, search field below, 3 cards (294x294) horizontal scroll

### Services Section (Node: `13246:65371`)
- Height: 351px, content 1400px
- Title: "Service phụ"
- 4 service cards (338x338) with carousel arrows
- **Service Card:**
  - Full image bg, rounded corners
  - Bottom: "From $669" price + service name (Fast track, eVisa, Airport Pickup, eSim)
- Carousel arrows: circular 40px on sides
- **Mobile:** horizontal scroll cards (294x294)

## Shared Components
- `TourCard` — reusable card with image, price, tags, title, eye icon
- `ServiceCard` — image card with price + label
- `CarouselSection` — wrapper with title, filter controls, carousel arrows
- `FilterDropdown` — "Your Style" and "Duration" filter popups

## Files to Modify
- `src/components/sections/homepage/tour-package-section.tsx`
- `src/components/sections/homepage/services-section.tsx`
- `src/components/ui/tour-card.tsx`

## Files to Create
- `src/components/ui/service-card.tsx`
- `src/components/ui/carousel-wrapper.tsx`
- `src/components/ui/filter-dropdown.tsx`

## Success Criteria
- Tour cards match Figma (image, price overlay, tags, title)
- Carousel navigation works with arrows
- Duration/Style filter dropdowns functional
- Service cards match design
- Mobile horizontal scroll works
