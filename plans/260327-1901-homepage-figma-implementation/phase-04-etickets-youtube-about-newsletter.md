# Phase 4: eTickets + YouTube + About + Newsletter

## Overview
- **Priority:** P1
- **Status:** Pending

## Design Specs

### eTickets Section (Node: `13263:4171`)
- Height: 211px, full width
- Left panel (338px): teal/sky gradient bg, airplane image, "e-Tickets" cursive title
- Right panel (1056px): booking form in white card
  - Row 1: From, To, Departure date, Return date (4 equal columns)
  - Row 2: "Number of passengers, seat class" spanning width
  - Search button: teal, 58x150px vertical on right side
  - Circular nav dots: left/right at y=89
- **Mobile:** Stacked — image top (116px), form card below (352px), fields stacked vertically, full-width search button

### YouTube Section (Node: `13284:1721`)
- Height: 546px
- Center title: "Our channel" + YouTube icon (red play button)
- 5 video thumbnail cards in staggered heights layout
  - Cards: 270px wide, 478px tall, rounded corners (16px)
  - Staggered: y offsets [28, 48, 68, 48, 28] creating wave effect
  - Labels below each: "Our team", "Travel guide", "Internet vs. Local expert", "Choice of expert", "Travel essentials"
- **Mobile:** Title centered, 3 cards visible in horizontal scroll

### About Us Section (Node: `13289:45217`)
- Height: 769px
- Title: "About us" (serif/bold, centered)
- Subtitle: "Friendship, integrity and a spirit of self-improvement..." (centered, italic)
- **Clothesline gallery:** 7-8 photos hanging from a decorative wavy teal line with pin dots
  - Photos tilted at slight angles, rounded corners
  - Wave line spans full width
- **Team composite:** Large group photo of team with Vietnam flags
  - Flanked by Vietnam landmarks (Dragon Bridge, temple)
  - Cloud/mist effect at bottom
- **Mobile:** Simplified — title, subtitle, team photo section, landmarks

### Newsletter Section (Node: `13713:14432`)
- Height: 312px, centered 928px wide
- Light teal bg card, rounded corners
- Left: "Like a travel expert in your inbox ✈" title + quote text
- Right: Form with 3 inputs (First name, Last name, Email) + Subscribe button (teal)
- **Mobile:** 343px wide, stacked layout

## Files to Modify
- `src/components/sections/homepage/etickets-section.tsx`
- `src/components/sections/homepage/youtube-section.tsx`
- `src/components/sections/homepage/about-section.tsx`
- `src/components/sections/homepage/newsletter-section.tsx`

## Files to Create
- `src/components/ui/video-card.tsx`
- `src/components/ui/clothesline-gallery.tsx`

## Success Criteria
- eTickets: airplane image + booking form layout matches
- YouTube: staggered card heights with wave effect
- About: clothesline photo gallery with wavy line
- Newsletter: form layout with teal card bg
- All sections mobile responsive
