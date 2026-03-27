# Phase 1: Header + Hero Banner + Footer

## Overview
- **Priority:** P0 - Foundation
- **Status:** Pending

## Design Specs

### Header (Node: `14079:88174`)
- Height: 64px, max-width: 1400px centered
- Left: Meetup Travel logo
- Center: Nav items — Tour▾, Services▾, eTickets, Destination, Blog, About Meetup▾
- Right: Currency converter icon + Wishlist heart icon (with badge count)
- Dropdowns have chevron icons
- Mobile: Hamburger menu → Mega Menu popup

### Hero Banner (Node: `13230:45802`)
- Full width 1600px, height 524px
- Rounded corners image (16px radius) with 27px left margin, 37px top margin
- Image 1546x487
- "Welcome to Meetup" overlay text (script font)
- "WHERE LOCAL EXPERTS CRAFT A JOURNEY UNIQUELY YOURS" subtitle
- Mobile: 343x257 with rounded image, "Vietnam" text + subtitle

### Footer (Node: `13230:45835`)
- Full width, height 360px
- Gradient teal background (left to right, #2CBCB3 → darker teal)
- Logo + social icons (Instagram, Facebook, TikTok, YouTube)
- Columns: About Meetup Travel (Home/Tours/Hotel/Services/e-Tickets + About Us/Recruitment/Terms/Contact)
- Contact column: WhatsApp numbers, email, office address
- Payment channel: Visa, Mastercard, JCB, AMEX icons
- Bottom: Copyright 2025 + Unsubscribe link
- Mobile: stacked layout

## Files to Modify
- `src/components/layout/site-header.tsx` — Navbar redesign
- `src/components/sections/homepage/hero-section.tsx` — Hero banner
- `src/components/layout/site-footer.tsx` — Footer redesign
- `src/app/globals.css` — Theme variables

## Files to Create
- `src/components/layout/mobile-menu.tsx` — Mobile mega menu
- `src/components/ui/currency-switcher.tsx` — Currency popup
- `src/components/ui/wishlist-drawer.tsx` — Wishlist panel

## Success Criteria
- Header matches Figma exactly (logo, nav, icons)
- Hero banner pixel-perfect with rounded corners
- Footer gradient + layout matches
- Mobile responsive versions work
