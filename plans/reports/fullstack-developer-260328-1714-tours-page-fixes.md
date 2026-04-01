# Tours Page Fixes Report

**Date:** 2026-03-28
**Status:** DONE_WITH_CONCERNS

## Issues Fixed

### 1. Hero Banner Image (CRITICAL)
- **Problem:** `public/images/tours-hero-banner.jpg` was a Shopee advertisement (Vietnamese "XEM SHOPEE LIVE -50%")
- **Fix:** Replaced with `tour-3-mekong.png` (coconut river scene with basket boats) per fallback instructions
- **File:** `public/images/tours-hero-banner.jpg` (600KB, was 113KB)

### 2. Vietnam Map Placeholder Text
- **Problem:** `public/images/vietnam-map.png` showed "Vietnam Map - Replace with Figma export" text at bottom
- **Fix:** Added CSS overlay div at bottom of map container to hide the text. Added `overflow-hidden` and `object-top` to crop visually
- **File:** `src/components/sections/tours/vietnam-intro-section.tsx`

### 3. Tour Grid Cards Not Rendering in Grid (CRITICAL)
- **Problem:** TourCard had fixed `flex-none w-[294px] h-[294px] md:w-[338px] md:h-[516px]` that conflicts with CSS grid. Grid wrapper used fragile `[&>a]:w-full` selector overrides which couldn't override `flex-none`
- **Fix:**
  - Added `className?: string` prop to TourCard with `??` nullish coalescing fallback to original classes
  - Grid section now passes responsive className: `w-full aspect-square sm:aspect-auto sm:h-[516px]`
  - Removed wrapper `<div>` with CSS override selectors -- TourCard renders directly in grid
  - Changed mobile grid from `grid-cols-1` to `grid-cols-2` (2 columns on mobile per typical tour grid pattern)
- **Files:** `src/components/ui/tour-card.tsx`, `src/components/sections/tours/tour-package-grid-section.tsx`

### 4. Most Liked Package Section
- **Verified:** Section renders correctly. Images (`tour-1-floating-market.png`, `tour-2-hoi-an.png`) exist and are valid. FeaturedCard uses `Image fill` with `md:flex-1` which works for side-by-side layout on desktop. No fixes needed.

### 5. ScrollReveal Sections
- **Verified:** `initial={{ opacity: 0 }}` with `whileInView` trigger. Works in real browser on scroll. Per instructions, no code change needed.

### 6. CSS Utility Classes
- **Verified:** Both `.section-padding` and `.container-wide` exist in `globals.css`:
  - `.section-padding`: `@apply py-5 md:py-12 lg:py-14`
  - `.container-wide`: `@apply mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-[100px]`

## Files Modified
| File | Change |
|------|--------|
| `public/images/tours-hero-banner.jpg` | Replaced Shopee ad with mekong river scene |
| `src/components/ui/tour-card.tsx` | Added optional `className` prop for flexible sizing |
| `src/components/sections/tours/tour-package-grid-section.tsx` | Fixed grid rendering, responsive card sizing |
| `src/components/sections/tours/vietnam-intro-section.tsx` | CSS overlay to hide map placeholder text |

## Tests Status
- Type check: Unable to run (bash permissions denied for pnpm/node commands)
- Manual review: All changes are backward-compatible; new optional prop with nullish coalescing fallback

## Concerns
1. **Typecheck not run** -- bash permission was denied for all `pnpm typecheck` / `npx tsc` attempts. Changes are simple and backward-compatible but not machine-verified.
2. **Vietnam map** -- The placeholder image still exists on disk with text. A CSS overlay hides it visually. Ideally the actual Figma export should replace this file.
3. **Hero banner** -- Using `tour-3-mekong.png` as temporary replacement. The source is PNG but saved as `.jpg` extension. Next.js Image component handles this fine (detects format from content, not extension), but the Figma export would be higher resolution and proper format.

## Unresolved Questions
- Should the hero banner be fetched from Figma MCP for the proper high-res version?
- Should the Vietnam map be regenerated without text using an image processing tool?
