# Code Review: Homepage Redesign

**Date:** 2026-03-27
**Reviewer:** code-reviewer
**Score:** 7.5 / 10
**TypeScript:** PASS (zero errors)
**Build:** PASS (confirmed by tester report)

---

## Scope

| Category | Files | LOC |
|----------|-------|-----|
| Layout | site-header, site-footer, floating-social | ~333 |
| Sections | hero, tour-package, reviews, experience x3, services, etickets, youtube, about, newsletter | ~968 |
| Shared | tour-card, site-config, globals.css, layout.tsx, page.tsx | ~304 |
| **Total** | **17 files** | **~1605** |

Modified in HEAD~1: site-header, site-footer, hero-section, site-config, globals.css, layout.tsx, page.tsx
Newly created: tour-package, reviews, experience, services, etickets, youtube, about, newsletter, floating-social, tour-card

---

## Overall Assessment

Solid homepage redesign with clean component decomposition, good separation of concerns, proper use of server vs client components, and consistent CSS variable usage across most files. TypeScript passes cleanly. The main issues are around dark-mode compatibility, accessibility gaps in forms, hardcoded colors that bypass theming, and a few DRY violations in carousel code.

---

## Critical Issues

### C1. Missing `htmlFor` on all `<label>` elements (etickets-section, newsletter-section)

**Impact:** Screen readers cannot associate labels with inputs. WCAG 2.1 Level A violation.

**Files:**
- `src/components/sections/etickets-section.tsx` -- 5 labels without `htmlFor`, 5 inputs without `id`
- `src/components/sections/newsletter-section.tsx` -- 3 inputs with no labels at all (only placeholder text)

**Fix example (etickets):**
```tsx
<label htmlFor="from-field" className="...">From</label>
<input id="from-field" type="text" name="from" ... />
```

**Fix example (newsletter):** Add visually-hidden labels or explicit `<label>` elements for each input.

### C2. Dark mode breaks on multiple sections

**Impact:** With `ThemeProvider` enabling `system` theme, dark mode users see white `bg-white` backgrounds with dark text on dark backgrounds.

**Affected files:**
- `site-header.tsx` line 17: `bg-white` (sticky header)
- `hero-section.tsx` line 11: `bg-white`
- `tour-package-section.tsx` line 66: `bg-white`
- `reviews-section.tsx` line 84: `bg-white`
- `etickets-section.tsx` line 44: `bg-white` (form panel)
- `site-footer.tsx` line 35: hardcoded gradient `#5DD5CD, #2CBCB3`

**Fix:** Replace `bg-white` with `bg-[var(--color-background)]` or `bg-[var(--color-card)]`. The footer gradient is acceptable as-is (intentionally branded).

---

## High Priority

### H1. Duplicate "Amex" in PAYMENT_METHODS array

**File:** `src/components/layout/site-footer.tsx` line 6
```ts
const PAYMENT_METHODS = ["Visa", "Mastercard", "Amex", "JCB", "PayPal", "Amex"];
```
"Amex" appears twice. Likely a typo -- second one might be intended as another payment method.

### H2. Hardcoded hex colors bypass CSS variables (dark mode + theming)

**Impact:** ~15 instances of `#2CBCB3`, `#E87C3E`, `#FACC15`, `#34E0A1`, `#EF4444`, `#25D366` directly in className/style attributes. These won't respond to theme changes.

**Key offenders:**
- `site-header.tsx`: Logo color `#2CBCB3` (lines 24, 29, 42, 94), favorites hover `#E87C3E` (line 64)
- `site-footer.tsx`: Social hover `#2CBCB3` (line 65), payment text `#2CBCB3` (line 143)
- `floating-social.tsx`: All 3 buttons use inline `style={{ backgroundColor: ... }}`
- `hero-section.tsx`: Yellow blob `#FACC15` (line 61)
- `reviews-section.tsx`: Star fill `#FACC15` (line 66), Tripadvisor green `#34E0A1` (line 90)

**Fix:** Add CSS variables for recurring brand colors:
```css
:root {
  --color-star: #FACC15;
  --color-whatsapp: #25D366;
  /* ... */
}
```
For logo and branded elements (footer gradient, floating social), inline hex is acceptable if intentional.

### H3. `href="#"` on MeetUp LIVE button

**File:** `src/components/layout/floating-social.tsx` line 17

Causes page jump to top on click. Use `href="javascript:void(0)"` is also bad practice.

**Fix:** Use `<button>` element instead, or link to the actual live stream URL.

### H4. Carousel scroll logic duplicated 3 times

**DRY violation across:**
- `tour-package-section.tsx` (lines 52-63)
- `reviews-section.tsx` (lines 73-81)
- `services-section.tsx` (lines 27-32)

All three define identical `SCROLL_AMOUNT`, `scrollRef`, and `scroll()` function.

**Fix:** Extract a `useHorizontalScroll()` hook:
```ts
function useHorizontalScroll(amount = 300) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };
  return { ref, scroll };
}
```

---

## Medium Priority

### M1. `scrollbar-hide` class used without definition

**File:** `src/components/sections/services-section.tsx` line 56 uses `scrollbar-hide` class.
**Other carousels** use `style={{ scrollbarWidth: "none" }}` inline.

`scrollbar-hide` is not defined in `globals.css` nor is it a standard Tailwind v4 utility. Inconsistent approach -- pick one.

**Fix:** Use `style={{ scrollbarWidth: "none" }}` consistently across all carousels, or add a `@utility scrollbar-hide` in `globals.css`.

### M2. Footer `email` field mismatch

**File:** `src/components/layout/site-footer.tsx` line 29 destructures `email` from `siteConfig`, but line 124 uses `contact.email` for the rendered link. The `siteConfig.email` (line 19 of site-config) and `siteConfig.navigation.footer.contact.email` (line 84) are the same value, but the destructured `email` is unused.

### M3. Experience section shares mock data across all 3 region instances

**File:** `src/components/sections/experience-section.tsx` -- `MOCK_TOURS` is a module-level constant. All three `<ExperienceSection region="North|Mid|South" />` render identical cards.

This is fine for placeholder stage, but consider accepting `tours` as a prop when connecting to real data.

### M4. YouTube section fixed pixel dimensions

**File:** `src/components/sections/youtube-section.tsx` line 48:
```tsx
style={{ width: "180px", height: "300px" }}
```
Fixed pixel widths don't scale well on smaller viewports. On mobile, cards overflow without context that more exist.

**Fix:** Use responsive Tailwind classes: `w-[160px] sm:w-[180px]` and ensure container handles overflow visibly.

### M5. Missing `<form>` wrapper on etickets search

**File:** `src/components/sections/etickets-section.tsx` -- inputs are managed by state but there is no `<form>` element, no `onSubmit` handler, and the search button is `type="button"`. Users cannot submit with Enter key.

**Fix:** Wrap in `<form onSubmit={...}>` and change button to `type="submit"`.

### M6. `siteConfig.email` (top-level) vs `siteConfig.navigation.footer.contact.email`

**File:** `src/config/site-config.ts` -- same email `vn.meetup.travel@gmail.com` stored in two places. Violation of single source of truth.

**Fix:** Reference `siteConfig.email` in the footer contact section, or remove one.

---

## Low Priority

### L1. Copyright year hardcoded to 2025

**File:** `src/components/layout/site-footer.tsx` line 154: `Copyright 2025 Meetup travel`

**Fix:** Use `new Date().getFullYear()` for auto-updating year.

### L2. "Service phu" heading is Vietnamese in otherwise English page

**File:** `src/components/sections/services-section.tsx` line 39: `Service phu` -- mixed language heading. Consider i18n-ready approach or English equivalent.

### L3. Star rating component accessibility

**File:** `src/components/sections/reviews-section.tsx` -- `StarRating` uses `aria-label` on a `<div>` which is not a landmark or interactive element. Use `role="img"` with the aria-label for correct semantics.

### L4. FloatingSocial is `"use client"` but has no state or hooks

**File:** `src/components/layout/floating-social.tsx` -- No `useState`, `useEffect`, or event handlers. Could be a server component.

**Counter-argument:** May need client-side behavior in the future. Low impact either way.

### L5. `about-section.tsx` line 66 -- `<div>` with `aria-label` but no `role`

A `<div>` with `aria-label="Team group photo"` is not conveyed by screen readers without `role="img"` or using `<figure>`.

---

## Positive Observations

1. **Clean page composition** -- `page.tsx` is 43 lines, purely compositional. Excellent separation.
2. **Proper server/client split** -- Hero, Experience, YouTube, About are server components. Client directive only where truly needed (scroll refs, form state).
3. **CSS variable system** -- Well-structured `:root` and `.dark` theme in globals.css. Most components use `var(--color-*)`.
4. **Semantic HTML** -- Proper `<section>`, `<nav>`, `<header>`, `<footer>` usage throughout.
5. **Aria labels** -- Scroll buttons, social links, hamburger toggle all have aria-labels.
6. **Next.js Image component** -- Used correctly with `fill`, `sizes`, `priority` (hero).
7. **SEO** -- JSON-LD, metadata, and page metadata via `generatePageMetadata()`.
8. **Responsive design** -- Mobile-first with proper breakpoint usage (sm/md/lg).
9. **Type exports** -- `TourCardProps` exported for consumer use.

---

## Recommended Actions (Priority Order)

1. **Fix label-input associations** in etickets + newsletter forms (C1) -- accessibility blocker
2. **Replace `bg-white` with CSS variable** across header + section backgrounds (C2) -- dark mode broken
3. **Extract shared carousel hook** to reduce 3x duplication (H4)
4. **Remove duplicate "Amex"** from payment methods (H1)
5. **Replace `href="#"`** with button or real URL (H3)
6. **Add CSS variables** for recurring brand hex colors (H2)
7. **Wrap etickets inputs in `<form>`** for Enter-key submission (M5)
8. **Standardize scrollbar-hide approach** across carousels (M1)

---

## Metrics

| Metric | Value |
|--------|-------|
| TypeScript Errors | 0 |
| Hardcoded Colors | ~15 instances |
| `"use client"` Components | 7 (appropriate) |
| Server Components | 4 sections + tour-card + footer |
| Accessibility Issues | 3 (C1, L3, L5) |
| DRY Violations | 1 significant (carousel scroll) |
| Files > 200 LOC | 0 (largest: reviews-section at 177) |

---

## Unresolved Questions

1. Is dark mode intended for this site? If not, consider removing `ThemeProvider` system theme detection to avoid the `bg-white` issue entirely.
2. Should the Vietnamese heading "Service phu" remain, or is English the target language?
3. Are the YouTube video cards intended to link to real YouTube videos? Currently no `<a>` wrapping.
4. Should the eTickets search form submit to an API endpoint, or is it purely presentational for now?
