# Code Review: Homepage Figma Implementation

**Reviewer:** code-reviewer | **Date:** 2026-03-27 | **Branch:** main

---

## Overall Score: 7 / 10

Solid Figma-to-code translation with clean component decomposition, good TypeScript types, and proper server/client component boundaries. Key gaps: accessibility on modal dialogs, DRY violations (duplicate sub-components and hardcoded color tokens), and missing dark mode support on hardcoded colors.

---

## Scope

- **Files reviewed:** 17 (layout 3, homepage sections 8, UI components 5, hook 1)
- **Total LOC:** 2,008
- **TypeScript:** Passes `tsc --noEmit` cleanly -- zero type errors
- **All files under 200 lines** -- compliant with project code standards

---

## Critical Issues (Must Fix)

### C1. Modal/Drawer missing ARIA dialog semantics

**Files:** `subscribe-popup.tsx`, `wishlist-drawer.tsx`, `mobile-menu.tsx`

None of the overlay components use `role="dialog"`, `aria-modal="true"`, or focus trapping. Screen readers will not announce these as dialogs, and keyboard users can Tab behind the overlay into hidden content.

**Impact:** WCAG 2.1 AA violation (4.1.2 Name, Role, Value). Screen reader users cannot interact meaningfully with these overlays.

**Fix example (subscribe-popup.tsx):**
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="subscribe-popup-title"
  className="relative w-[400px] ..."
  onClick={(e) => e.stopPropagation()}
>
  <h3 id="subscribe-popup-title" ...>
```

Also implement focus trap (use `@radix-ui/react-dialog` or a lightweight trap utility). On open, focus should move to the dialog; on close, focus returns to the trigger element.

### C2. Carousel nav arrows hidden on small viewports

**Files:** `tour-package-section.tsx`, `reviews-section.tsx`, `services-section.tsx`

Arrow buttons use `absolute -left-10 / -right-10`, placing them **outside** the container bounds. On screens where container is near full-width, arrows are clipped by `overflow: hidden` on parent or simply off-screen. There is no visible affordance that the user can scroll horizontally.

**Impact:** Mobile/tablet users have no scroll indicator; touch users must discover swipe by accident.

**Fix:** Move arrows inside the container (e.g., `left-2 / right-2`) with semi-transparent overlay, or add a visible scroll indicator (dot pagination / fade edge hint). At minimum, add scroll-snap padding so content peeks from the edge.

---

## Warnings (Should Fix)

### W1. Two different teal primaries used interchangeably

`#3BBCB7` (16 files, 32 occurrences) vs `#2CBCB3` (18 files, 71 occurrences). The CSS variable `--color-primary` is `#2CBCB3`, but most section components hardcode `#3BBCB7` directly.

**Impact:** Inconsistent brand color; dark mode will not work because hardcoded hex values ignore the `.dark` class overrides. Any future brand color change requires find-and-replace across dozens of files.

**Fix:** Replace all `#3BBCB7` instances with `var(--color-primary)` or define a second token if both values are intentional per Figma. Map the teal gradient stops to CSS variables too.

### W2. `PriceBadge` and `TagPill` duplicated across files

`experience-section.tsx` defines local `PriceBadge` and `TagPill` components that duplicate the same markup inlined in `tour-card.tsx` and `services-section.tsx`.

**Impact:** DRY violation. A design change to the price badge requires updating 3+ locations.

**Fix:** Extract `PriceBadge` and `TagPill` into `src/components/ui/price-badge.tsx` and `src/components/ui/tag-pill.tsx`. Import in all three consuming files.

### W3. `TikTokIcon` defined in two files

Identical SVG component exists in both `site-footer.tsx` (line 10-16) and `mobile-menu.tsx` (line 9-15).

**Impact:** DRY violation. Both carry identical SVG path data.

**Fix:** Extract to `src/components/ui/icons/tiktok-icon.tsx` and import in both.

### W4. `scrollbarWidth: "none"` repeated inline across 5 files

Every carousel uses `style={{ scrollbarWidth: "none" }}` as inline style, which only works in Firefox. WebKit/Blink needs `::-webkit-scrollbar { display: none }`.

**Impact:** Scrollbar visible in Chrome/Safari/Edge. Inconsistent cross-browser behavior.

**Fix:** Add a utility class in `globals.css`:
```css
@utility scrollbar-hide {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}
```
Then replace all inline styles with `className="... scrollbar-hide"`.

### W5. Newsletter form does not actually submit data

`newsletter-section.tsx` validates email format client-side and shows a popup, but never sends data anywhere. The email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) is also overly simplistic (allows `a@b.c`).

**Impact:** Form is non-functional. Users see "success" but nothing is persisted.

**Fix:** Wire to an API endpoint or email service. If intentionally deferred, add a `// TODO:` comment and disable the success popup until backend integration.

### W6. `body.style.overflow` manipulation without coordination

Both `wishlist-drawer.tsx` and `mobile-menu.tsx` independently set `document.body.style.overflow = "hidden"`. If both overlays are open simultaneously (unlikely but possible via programmatic state), closing one will reset overflow while the other is still open.

**Impact:** Edge case scroll lock bug.

**Fix:** Use a ref-counted scroll lock (e.g., `useLockBodyScroll` from a utility that increments/decrements a counter) or ensure only one overlay can be open at a time via shared state.

### W7. Review data uses hardcoded stale dates and repeated content

`reviews-section.tsx` has 5 identical review entries (same name "Alex M", same date "2023.11.30", same body text). Also "Excelence" is misspelled.

**Impact:** Looks like placeholder/test data left in production code.

**Fix:** Either use distinct mock data that looks realistic, or wire to a CMS/API. Fix spelling: "Excellence".

---

## Minor Suggestions

### M1. `ExperienceSection` is a server component but contains no data fetching

It renders only static mock data. This is fine for now, but the `region` prop suggests it should eventually fetch region-specific data. Add a `// TODO` noting intent.

### M2. Hardcoded card dimensions may clip on ultra-narrow screens

`TourCard` uses fixed `w-[338px] h-[516px]`. On screens narrower than 338px (rare but possible on older devices), the card overflows.

**Fix:** Use `min-w-[280px] w-[85vw] max-w-[338px]` for graceful scaling.

### M3. `<select>` in tour-package-section has no `onChange` handler

The duration select (line 66-76 of `tour-package-section.tsx`) renders but doesn't filter anything. No state management connected.

### M4. Copyright year hardcoded as "2025" in footer

`site-footer.tsx` line 165: `Copyright 2025 Meetup travel`. Should be dynamic: `{new Date().getFullYear()}`.

### M5. "Subcribe" typo appears intentional per Figma but looks like a bug

Both `newsletter-section.tsx` (button text) and `subscribe-popup.tsx` (title text) use "Subcribe" and footer uses "Unsubcribe". Comment says "intentional Figma typo" but this will confuse users. Recommend fixing unless client explicitly wants it.

### M6. YouTube section video cards are not clickable

Cards have `cursor-pointer` but no `<a>` or `onClick` handler. Users see pointer cursor but clicking does nothing.

### M7. Image `sizes` attribute could be more responsive

Most images use `sizes="338px"` regardless of viewport. For better performance:
```tsx
sizes="(max-width: 640px) 280px, 338px"
```

---

## What Was Done Well

1. **Clean component decomposition** -- Each section is its own file, well under 200 lines, with clear JSDoc comments referencing Figma node IDs
2. **TypeScript passes cleanly** -- Zero type errors, proper typing on all props
3. **Proper server/client boundary** -- Only components needing interactivity use `"use client"`; `YoutubeSection`, `AboutSection`, `SiteFooter` are correctly server components
4. **`useHorizontalScroll` hook** -- Smart extraction of shared carousel scroll logic into a reusable hook with proper `useCallback` memoization
5. **Consistent Figma fidelity** -- Pixel-accurate dimensions, gradients, and spacing comments throughout
6. **Good accessibility basics** -- `aria-label` on buttons, `sr-only` labels on form fields, `aria-hidden` on decorative elements
7. **Images use Next.js `<Image>`** with `fill` + `sizes` props for automatic optimization
8. **Escape key handling** on popups and drawers
9. **All images verified present** -- All referenced image files exist in `public/images/`

---

## Metrics

| Metric | Value |
|--------|-------|
| Type Coverage | 100% (tsc passes) |
| Test Coverage | N/A (no tests for these components) |
| Linting Issues | 0 (typecheck clean) |
| Files Under 200 LOC | 17/17 |
| Critical Issues | 2 |
| Warnings | 7 |
| Minor | 7 |

---

## Recommended Action Priority

1. **[Critical]** Add ARIA dialog roles + focus trapping to all overlays
2. **[Critical]** Fix carousel arrow visibility on narrow viewports
3. **[Warning]** Consolidate teal color to CSS variable usage
4. **[Warning]** Extract shared PriceBadge, TagPill, TikTokIcon components
5. **[Warning]** Add cross-browser scrollbar-hide utility
6. **[Minor]** Dynamic copyright year
7. **[Minor]** Fix "Subcribe" typo unless confirmed intentional by client

---

## Unresolved Questions

1. Are both `#3BBCB7` and `#2CBCB3` intentional design tokens, or should one be canonical?
2. Is the "Subcribe" / "Unsubcribe" spelling intentional per client branding, or a Figma typo to fix?
3. Will the newsletter form be wired to a backend endpoint in a subsequent phase?
4. Should the YouTube cards link to actual YouTube videos, and if so, what are the URLs?
