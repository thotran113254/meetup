# Phase 6: Mobile Responsive + Testing

## Overview
- **Priority:** P1
- **Status:** Pending

## Mobile Design Specs (Node: `13316:45808`, 375px)

### Mobile Header (Node: `14343:90695`)
- Height: 48px
- Left: Meetup logo (small)
- Right: Hamburger menu icon
- On scroll: sticky header

### Mobile Mega Menu (Node: `14394:91168`)
- Full screen overlay (375x837)
- Header: Logo + X close
- Menu items: Home, Tour▾ (expandable: View all→, Tour package→, Tour lẻ→), Services▾, eTickets, Destination | Blog (2-col), About Meetup▾
- Social icons row: Instagram, Facebook, TikTok, YouTube
- Info cards: timezone "Asia/Saigon, GMT+7", hours "Mon-Sun: 06:00 AM - 12:00 AM"
- WhatsApp contact section

### Section Mobile Adaptations
- **Hero:** 343x257, rounded image, "Vietnam" + subtitle overlay
- **Tour Package:** Title + View all (row), search below, horizontal scroll 294px cards
- **Reviews:** Score on top, horizontal scroll review cards
- **Experience (x3):** Title + View all, horizontal scroll 294px cards (no grid, no featured card)
- **Services:** Title, horizontal scroll 294px cards
- **eTickets:** Image section (116px) top, form stacked below, full-width search btn
- **YouTube:** Title centered, horizontal scroll video cards
- **About:** Simplified — title, subtitle, team photo section
- **Newsletter:** 343px card, stacked form fields
- **Footer:** Stacked layout, same gradient bg

### Breakpoints
- Desktop: >= 1024px (1400px content)
- Tablet: 768px-1023px (adaptive)
- Mobile: < 768px (375px design, fluid)

## Testing Checklist
- [ ] Desktop 1920px viewport
- [ ] Desktop 1440px viewport
- [ ] Desktop 1024px viewport
- [ ] Tablet 768px viewport
- [ ] Mobile 375px viewport
- [ ] Mobile 320px viewport (small)
- [ ] All carousels scroll correctly
- [ ] All popups open/close
- [ ] Newsletter form validates
- [ ] Mobile menu opens/closes
- [ ] Wishlist drawer works
- [ ] Currency switcher works
- [ ] Filter dropdowns work
- [ ] Images load correctly
- [ ] No horizontal overflow
- [ ] Smooth scroll behavior
- [ ] Hover states on desktop
- [ ] Touch interactions on mobile

## Chrome DevTools Verification
- Screenshot comparison at each breakpoint
- Performance audit (LCP, CLS, FID)
- Accessibility check
- Mobile emulation testing
