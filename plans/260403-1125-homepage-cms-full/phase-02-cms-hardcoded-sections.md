# Phase 2: CMS-ify About, Newsletter, eTickets Sections

## Context Links
- [AboutSection](../../src/components/sections/homepage/about-section.tsx) (150 lines, fully hardcoded)
- [NewsletterSection](../../src/components/sections/homepage/newsletter-section.tsx) (128 lines, fully hardcoded)
- [EticketsSection](../../src/components/sections/homepage/etickets-section.tsx) (194 lines, fully hardcoded)
- [Phase 1 types](./phase-01-section-registry.md)
- Existing pattern: [TourPackageSection](../../src/components/sections/homepage/tour-package-section.tsx) (server wrapper + client component)

## Overview
- **Priority**: P1
- **Status**: Pending
- **Effort**: 3h
- **Blocked by**: Phase 1 (needs type definitions)

Convert three hardcoded sections to the established server-component-wrapper pattern: server component loads CMS data with fallback, passes to client component for rendering.

## Key Insights

1. **Pattern to follow** — every CMS section uses the same approach:
   - Server component calls `getSetting<T>("key")`
   - Falls back to hardcoded constant if null/error
   - Passes data to client component as props
   - Example: `TourPackageSection` (server) -> `TourPackageCarousel` (client)

2. **About section** is complex visually (clothesline gallery, composite images) but the CMS data is simple: text strings + image URLs. The layout logic stays in the client component unchanged.

3. **Newsletter section** has minimal CMS needs — just title + description. Form logic stays client-side.

4. **eTickets section** — cities and passengers arrays are the main CMS data. Form UI and date pickers stay client-side unchanged.

## Architecture

### Conversion Pattern (same for all 3)

```
BEFORE:
  about-section.tsx (client, hardcoded data + rendering)

AFTER:
  about-section.tsx        (server, loads CMS, passes to client)
  about-section-content.tsx (client, receives props, renders UI)
```

The current client component gets renamed to `*-content.tsx` and receives data as props. A new thin server wrapper takes the old filename.

### Data Shapes (from Phase 1 types)

**AboutData**: title, quote, mobilePhotos[], desktopImage, teamImage, dragonImage, templeImage, cloudImage
**NewsletterData**: title, description
**EticketsData**: title, cities[], passengers[]

## Related Code Files

### Files to Modify (rename to content component)
| Current File | New Name | Change |
|---|---|---|
| `src/components/sections/homepage/about-section.tsx` | `about-section-content.tsx` | Remove hardcoded data, accept props, add "use client" if not present |
| `src/components/sections/homepage/newsletter-section.tsx` | `newsletter-section-content.tsx` | Remove hardcoded title/desc, accept props |
| `src/components/sections/homepage/etickets-section.tsx` | `etickets-section-content.tsx` | Remove hardcoded CITIES/PASSENGERS, accept props |

### Files to Create (server wrappers)
| File | Purpose |
|---|---|
| `src/components/sections/homepage/about-section.tsx` | Server wrapper: load `homepage_about`, fallback, render `AboutSectionContent` |
| `src/components/sections/homepage/newsletter-section.tsx` | Server wrapper: load `homepage_newsletter`, fallback, render `NewsletterSectionContent` |
| `src/components/sections/homepage/etickets-section.tsx` | Server wrapper: load `homepage_etickets`, fallback, render `EticketsSectionContent` |

### No changes needed
- `src/app/(website)/page.tsx` — imports stay the same (same filenames)
- DB schema — no migration, uses existing siteSettings

## Implementation Steps

### Step 1: About Section (60 min)

**1a. Create `about-section-content.tsx`** — copy current `about-section.tsx`, then:
- Add `"use client";` at top (it uses no hooks currently, but Image component needs it for the clothesline layout interactivity potential)
- Actually, re-check: current AboutSection has NO "use client" — it's a server component using `Image` from next/image. The MOBILE_PHOTOS const and SVG are all static markup. This means we can keep the content as a server component too.
- **Decision**: `AboutSectionContent` does NOT need "use client". It renders static markup from props. Keep as server component.
- Extract `MOBILE_PHOTOS` and all image URLs into a `FALLBACK_ABOUT` constant
- Accept `data: AboutData` as prop
- Replace hardcoded strings/URLs with `data.*` references

**1b. Create new `about-section.tsx`** server wrapper:
```tsx
import { getSetting } from "@/db/queries/settings-queries";
import type { AboutData } from "@/lib/types/homepage-cms-types";
import { AboutSectionContent } from "./about-section-content";

const FALLBACK_ABOUT: AboutData = {
  title: "About us",
  quote: "Friendship, integrity and a spirit of self-improvement forge the strength of an organization that continues to grow.",
  mobilePhotos: [
    { src: "/images/about-clothesline-1.png", alt: "Team in office", deg: 23, left: "5%", top: "36%", stringH: 15 },
    { src: "/images/about-clothesline-3.png", alt: "Team with flag", deg: 15, left: "28%", top: "38%", stringH: 22, wide: true },
    { src: "/images/about-clothesline-5.png", alt: "Team at flower garden", deg: 0, left: "55%", top: "40%", stringH: 30 },
    { src: "/images/about-clothesline-2.png", alt: "Team at viewpoint", deg: -10, left: "80%", top: "38%", stringH: 18 },
  ],
  desktopImage: "/images/about-us.png",
  teamImage: "/images/about-team-photo.png",
  dragonImage: "/images/about-dragon.png",
  templeImage: "/images/about-temple.png",
  cloudImage: "/images/about-cloud.png",
};

export async function AboutSection() {
  let data = FALLBACK_ABOUT;
  try {
    const cms = await getSetting<AboutData>("homepage_about");
    if (cms) data = { ...FALLBACK_ABOUT, ...cms };
  } catch { /* fallback */ }
  return <AboutSectionContent data={data} />;
}
```

**1c. File size check**: Current about-section.tsx is 150 lines. After splitting:
- `about-section.tsx` (server wrapper): ~30 lines
- `about-section-content.tsx` (rendering): ~120 lines
Both under 200 line limit.

### Step 2: Newsletter Section (30 min)

**2a. Create `newsletter-section-content.tsx`** — copy current file, then:
- Keep `"use client"` (it has form state: `useState`, `handleSubmit`)
- Accept `title: string` and `description: string` as props
- Replace hardcoded "Like a travel expert\nin your inbox" with `props.title`
- Replace hardcoded quote with `props.description`
- Keep all form logic, input handling, popup unchanged

**2b. Create new `newsletter-section.tsx`** server wrapper:
```tsx
import { getSetting } from "@/db/queries/settings-queries";
import type { NewsletterData } from "@/lib/types/homepage-cms-types";
import { NewsletterSectionContent } from "./newsletter-section-content";

const FALLBACK: NewsletterData = {
  title: "Like a travel expert in your inbox",
  description: "Friendship, integrity and a spirit of self-improvement forge the strength of an organization that continues to grow.",
};

export async function NewsletterSection() {
  let data = FALLBACK;
  try {
    const cms = await getSetting<NewsletterData>("homepage_newsletter");
    if (cms) data = { ...FALLBACK, ...cms };
  } catch { /* fallback */ }
  return <NewsletterSectionContent title={data.title} description={data.description} />;
}
```

**2c. File size**: ~20 lines server wrapper, ~110 lines client component. Both fine.

### Step 3: eTickets Section (45 min)

**3a. Create `etickets-section-content.tsx`** — copy current file, then:
- Keep `"use client"` (has useState for form fields)
- Remove `const CITIES = [...]` and `const PASSENGERS = [...]` from top level
- Accept props: `title: string`, `cities: {value, label}[]`, `passengers: {value, label}[]`
- Pass cities/passengers into the FormSelect components
- Replace hardcoded "e-Tickets" in TealPanel with `props.title`

**3b. Create new `etickets-section.tsx`** server wrapper:
```tsx
import { getSetting } from "@/db/queries/settings-queries";
import type { EticketsData } from "@/lib/types/homepage-cms-types";
import { EticketsSectionContent } from "./etickets-section-content";

const FALLBACK: EticketsData = {
  title: "e-Tickets",
  cities: [
    { value: "hanoi", label: "Hanoi (HAN)" },
    // ... all 11 cities from current CITIES const
  ],
  passengers: [
    { value: "1-economy", label: "1 passenger, Economy" },
    // ... all 7 from current PASSENGERS const
  ],
};

export async function EticketsSection() {
  let data = FALLBACK;
  try {
    const cms = await getSetting<EticketsData>("homepage_etickets");
    if (cms) data = { ...FALLBACK, ...cms };
  } catch { /* fallback */ }
  return <EticketsSectionContent title={data.title} cities={data.cities} passengers={data.passengers} />;
}
```

**3c. File size**: ~40 lines server wrapper (due to FALLBACK arrays), ~160 lines client component. Client is under 200 but close — the internal sub-components (TealPanel, PunchHole, FormSelect, FormDate) could be extracted if needed later. Not now (YAGNI).

### Step 4: Verify (15 min)

- `pnpm typecheck` — no type errors
- `pnpm dev` — all 3 sections render identically to before
- No DB data needed — fallbacks produce exact same output
- Check `page.tsx` imports still resolve (same export names from same file paths)

## Todo List

- [ ] Create `about-section-content.tsx` from current about-section.tsx (accept data prop)
- [ ] Create new `about-section.tsx` server wrapper with FALLBACK_ABOUT
- [ ] Create `newsletter-section-content.tsx` from current newsletter-section.tsx (accept title/desc props)
- [ ] Create new `newsletter-section.tsx` server wrapper with FALLBACK
- [ ] Create `etickets-section-content.tsx` from current etickets-section.tsx (accept title/cities/passengers props)
- [ ] Create new `etickets-section.tsx` server wrapper with FALLBACK
- [ ] Run `pnpm typecheck` — passes
- [ ] Visual regression check — all 3 sections render identically

## Success Criteria

- All 3 sections load CMS data via `getSetting` with proper fallbacks
- Zero visual changes when no CMS data is set (fallback = current hardcoded values)
- `page.tsx` requires zero changes (same imports, same component names)
- All files under 200 lines
- `pnpm typecheck` passes

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AboutSection content component exceeds 200 lines | Low | Low | Already 120 lines after split; extract sub-components only if needed |
| Prop drilling makes components less readable | Low | Low | Props are flat data objects, not deep nesting |
| CMS data shape mismatch with fallback | Medium | Medium | Spread `{ ...FALLBACK, ...cms }` ensures missing fields get defaults |

## Security Considerations

No new endpoints or auth changes. Data flows through existing `getSetting` which is read-only server-side.
