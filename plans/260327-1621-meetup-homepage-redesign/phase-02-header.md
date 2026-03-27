---
phase: 2
priority: high
status: completed
effort: medium
dependsOn: [1]
---

# Phase 2: Header — Navigation Redesign

## Overview
Rewrite header to match Figma: Meetup Travel logo (left), centered navigation with dropdown indicators, social/action icons (right).

## Design Reference
Screenshot: `/tmp/figma-captures/section-00-hero.png` (top area)

## Files to Modify
- `src/components/layout/site-header.tsx` — Full rewrite

## Design Details
- **Logo**: "Meetup" in teal with "TRAVEL" subtitle (custom logo text or image)
- **Nav items**: Tour ▾, Services ▾, eTickets, Destination, Blog, About Meetup ▾
- **Right side**: Currency/language icon, heart favorites, social icons
- **Style**: White background, no border-bottom (clean), sticky
- **Mobile**: Hamburger menu with same items

## Implementation Steps

### 1. Rewrite `site-header.tsx`
- Use `siteConfig.navigation.main` for nav items
- Add chevron-down icons for items with `hasDropdown: true`
- Logo: Either use an image or styled text "Meetup" + "TRAVEL"
- Right side: Simplified to essential icons
- Mobile drawer: Full-width with all nav items

### 2. Dropdown Placeholders
- Add dropdown container with `group-hover` for items with `hasDropdown`
- Content can be placeholder (empty dropdown), populated later

## Success Criteria
- [ ] Header matches Figma layout
- [ ] Logo displays "Meetup TRAVEL"
- [ ] Dropdown chevrons on Tour, Services, About Meetup
- [ ] Mobile responsive with hamburger menu
- [ ] Sticky on scroll
