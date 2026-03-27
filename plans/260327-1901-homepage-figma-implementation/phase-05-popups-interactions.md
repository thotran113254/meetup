# Phase 5: Popups + Interactions

## Overview
- **Priority:** P1
- **Status:** Pending

## Popups

### Subscribe Success (PC: `13856:92540`, MB: `13856:92578`)
- PC: 400x264, MB: 343x220
- Light mint/green bg card, rounded corners, centered
- Green checkmark icon (48px), "Subcribe Success" title (teal)
- Body text about checking Promotions/Spam folder

### Subscribe Fail (PC: `13856:92555`, MB: `13856:92586`)
- PC: 400x222, MB: 343x178
- Light peach/cream bg card
- Sad face emoji icon (48px), "Subcribe Fail" title (brown/dark)
- "Oops! That doesn't look like a valid email..."

### Unsubscribe Confirmation (PC: `14516:32186`, MB: `14516:32244`)
- PC: 481x282, MB: 343x255
- White bg card
- Sad face icon, "Unsubcribe?" title
- Confirmation text
- Two buttons: "Confirm" (teal) + "Cancel" (outlined/gray)

### Wishlist Drawer (PC: `14343:92973`, MB: `14380:30237`)
- PC: 550x800, MB: 375x618
- Header: "Wishlist" title + X close button
- Scrollable list of tour items (80px height each on PC, 64px mobile)
- Each item: thumbnail image (80x80) + tour name text + delete/trash icon
- Custom scrollbar on right side

### Currency Converter (PC: `14343:90533`, MB: `14343:92660`)
- PC: 205x333, MB: 205x293
- Header: "Convert currency units"
- List of currencies with dividers
- Active currency has checkmark
- Small triangle pointer at top

### Filter Dropdowns
- **Style Filter** (PC: `14380:30477`, MB: `14380:30507`): 199x220 / 167.5x208
  - Options: All, Cuisine ✓, Motorbike, Car, Jeep car
- **Duration Filter** (PC: `14380:30489`, MB: `14380:30519`): 199x177 / 167.5x167
  - Options: All ✓, < 5 Days, 5-7 Days, > 7 Days

## Interactions
- Tour card hover: show description overlay panel
- Tour card eye icon: toggle wishlist
- Carousel arrows: scroll cards left/right
- Filter dropdowns: toggle on click, close on outside click
- Newsletter form: validate email, show success/fail popup
- Unsubscribe link in footer: show unsubscribe confirmation popup
- Mobile hamburger: open mega menu
- Wishlist icon click: open wishlist drawer

## Files to Create
- `src/components/ui/subscribe-popup.tsx` — Success/Fail/Unsubscribe dialogs
- `src/components/ui/wishlist-drawer.tsx` — Wishlist side panel
- `src/components/ui/currency-switcher.tsx` — Currency dropdown
- `src/components/ui/filter-dropdown.tsx` — Style/Duration filters

## Files to Modify
- `src/components/sections/homepage/newsletter-section.tsx` — Wire up subscribe popups
- `src/components/layout/site-header.tsx` — Wire wishlist + currency icons
- `src/components/layout/site-footer.tsx` — Wire unsubscribe link

## Success Criteria
- All popups match Figma (colors, sizing, icons, text)
- Popup overlay with backdrop
- Wishlist drawer slides in from right
- Currency switcher positions correctly below icon
- Filter dropdowns position below trigger buttons
- Form validation + popup flow works
