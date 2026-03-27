---
phase: 5
priority: high
status: completed
effort: medium
dependsOn: [1]
---

# Phase 5: Footer & Floating Social Buttons

## Design Reference
- Footer: `/tmp/figma-captures/section-14.png`
- Floating: visible on right side of all captures

## Files to Modify
- `src/components/layout/site-footer.tsx` — Full rewrite
- `src/components/layout/floating-social.tsx` — New

## Footer Design
- **Background**: Teal gradient (left lighter → right darker), rounded top corners
- **Layout**: 4 columns
  - Col 1: Meetup TRAVEL logo (white) + social icons (Instagram, Facebook, TikTok, YouTube)
  - Col 2: ABOUT MEETUP TRAVEL — links (Home, Tours, Hotel, Services, e-Tickets, About Us, Recruitment, Terms & Policy, Contact Us)
  - Col 3: CONTACT — WhatsApp numbers, Email, Office address
  - Col 4: PAYMENT CHANNEL — payment method icons (Visa, Mastercard, Amex, JCB, PayPal)
- **Bottom bar**: "Copyright 2025 Meetup travel | Unsubscribe"
- **Text**: All white on teal background

## Floating Social Buttons
- Fixed position, right side, vertically stacked
- 3 buttons:
  1. MeetUp LIVE (red circle with broadcast icon)
  2. WhatsApp (green circle)
  3. Instagram (gradient pink/orange circle)
- Visible on all pages (add to layout)
- Rounded pill shapes with subtle shadow
- Links to respective social profiles

## Implementation Steps

### Footer
1. Rewrite `site-footer.tsx` with teal gradient bg
2. Use `siteConfig.navigation.footer` data
3. Payment icons: use simple SVGs or text badges
4. White text throughout, links with hover opacity
5. Responsive: stack columns on mobile

### Floating Social
1. Create `floating-social.tsx` as client component
2. Fixed position `right-4 bottom-4` (or vertically centered right)
3. Three circular buttons with icons
4. Add to `layout.tsx` alongside header/footer

## Success Criteria
- [ ] Footer has teal gradient background with rounded top
- [ ] 4-column layout with all content from Figma
- [ ] Floating social buttons visible on right side
- [ ] All links functional
- [ ] Responsive layout
