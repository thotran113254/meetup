# Phase 1: Section Registry + Revalidation Fix

## Context Links
- [Admin settings actions](../../src/app/admin/_actions/settings-actions.ts)
- [Settings queries](../../src/db/queries/settings-queries.ts)
- [Homepage page.tsx](../../src/app/(website)/page.tsx)

## Overview
- **Priority**: P1 (blocks all other phases)
- **Status**: Pending
- **Effort**: 1.5h

Define the `SectionConfig` type system, create a shared types file for all homepage CMS data shapes, and fix the missing `revalidatePath("/")` in `upsertSetting`.

## Key Insights

1. `upsertSetting()` in `settings-actions.ts` does NOT call `revalidatePath`. Every other mutation action (slides, posts, navigation) does. This is a live bug — admin edits to tours/services/reviews/videos don't refresh the homepage until next deploy or manual cache clear.
2. The homepage needs a registry of section keys → component mappings to support dynamic rendering in Phase 4.

## Architecture

### SectionConfig Type

```ts
type SectionConfig = {
  key: SectionKey;       // unique identifier matching component
  visible: boolean;      // toggle on/off
  order: number;         // sort priority (lower = higher)
  title?: string;        // override default section title
  subtitle?: string;     // override default subtitle
};

type SectionKey =
  | "hero" | "tours" | "reviews"
  | "experience-north" | "experience-mid" | "experience-south"
  | "services" | "latest-posts" | "etickets"
  | "youtube" | "about" | "newsletter";
```

### Default Config (fallback when DB has no `homepage_sections_config`)

12 entries in current page.tsx order, all visible. This is the backwards-compatible default.

## Data Flow

```
upsertSetting("homepage_sections_config", config[])
  --> DB write
  --> revalidatePath("/")  <-- FIX
  --> page.tsx re-renders
  --> getSetting<SectionConfig[]>("homepage_sections_config")
  --> sort by order, filter visible
  --> render matching components
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/app/admin/_actions/settings-actions.ts` | Add `revalidatePath("/")` after upsert |
| `src/hooks/use-admin-homepage.ts` | Extend `SectionKey` union + `SETTING_KEYS` map |

### Files to Create
| File | Purpose |
|------|---------|
| `src/lib/types/homepage-cms-types.ts` | All CMS type definitions: SectionConfig, AboutData, NewsletterData, EticketsData |
| `src/lib/constants/homepage-section-defaults.ts` | DEFAULT_SECTIONS_CONFIG array, section key registry |

## Implementation Steps

### Step 1: Fix revalidation in upsertSetting (5 min)

In `src/app/admin/_actions/settings-actions.ts`:
1. Add `import { revalidatePath } from "next/cache";`
2. After the `onConflictDoUpdate` call, add `revalidatePath("/");`
3. This fixes the existing bug for tours/services/reviews/videos too

### Step 2: Create homepage CMS types file (30 min)

Create `src/lib/types/homepage-cms-types.ts`:

```ts
/** Section keys — one per renderable homepage section */
export type HomepageSectionKey =
  | "hero" | "tours" | "reviews"
  | "experience-north" | "experience-mid" | "experience-south"
  | "services" | "latest-posts" | "etickets"
  | "youtube" | "about" | "newsletter";

/** Per-section config stored in homepage_sections_config */
export type SectionConfig = {
  key: HomepageSectionKey;
  visible: boolean;
  order: number;
  title?: string;
  subtitle?: string;
};

/** CMS data shapes for previously-hardcoded sections */

export type AboutData = {
  title: string;
  quote: string;
  mobilePhotos: Array<{
    src: string;
    alt: string;
    deg: number;
    left: string;
    top: string;
    stringH: number;
    wide?: boolean;
  }>;
  desktopImage: string;
  teamImage: string;
  dragonImage: string;
  templeImage: string;
  cloudImage: string;
};

export type NewsletterData = {
  title: string;
  description: string;
};

export type EticketsData = {
  title: string;
  cities: Array<{ value: string; label: string }>;
  passengers: Array<{ value: string; label: string }>;
};
```

### Step 3: Create section defaults file (20 min)

Create `src/lib/constants/homepage-section-defaults.ts`:

```ts
import type { HomepageSectionKey, SectionConfig } from "@/lib/types/homepage-cms-types";

/** Default homepage section order — used when no DB config exists */
export const DEFAULT_SECTIONS_CONFIG: SectionConfig[] = [
  { key: "hero", visible: true, order: 0 },
  { key: "tours", visible: true, order: 1 },
  { key: "reviews", visible: true, order: 2 },
  { key: "experience-north", visible: true, order: 3 },
  { key: "experience-mid", visible: true, order: 4 },
  { key: "experience-south", visible: true, order: 5 },
  { key: "services", visible: true, order: 6 },
  { key: "latest-posts", visible: true, order: 7 },
  { key: "etickets", visible: true, order: 8 },
  { key: "youtube", visible: true, order: 9 },
  { key: "about", visible: true, order: 10 },
  { key: "newsletter", visible: true, order: 11 },
];

/** Human-readable labels for admin UI */
export const SECTION_LABELS: Record<HomepageSectionKey, string> = {
  "hero": "Hero Slides",
  "tours": "Tour Packages",
  "reviews": "Danh gia",
  "experience-north": "Experience - Mien Bac",
  "experience-mid": "Experience - Mien Trung",
  "experience-south": "Experience - Mien Nam",
  "services": "Dich vu",
  "latest-posts": "Bai viet moi",
  "etickets": "e-Tickets",
  "youtube": "YouTube",
  "about": "About Us",
  "newsletter": "Newsletter",
};

/** CMS setting keys map */
export const HOMEPAGE_SETTING_KEYS = {
  config: "homepage_sections_config",
  tours: "homepage_tours",
  services: "homepage_services",
  reviews: "homepage_reviews",
  videos: "homepage_videos",
  experience: "homepage_experience",
  about: "homepage_about",
  newsletter: "homepage_newsletter",
  etickets: "homepage_etickets",
} as const;
```

### Step 4: Extend useAdminHomepage hook types (15 min)

In `src/hooks/use-admin-homepage.ts`:
- Import `HomepageSectionKey` from new types file
- Keep existing `SectionKey` for backwards compat (it maps to the 4 current tabs)
- The hook itself is extended in Phase 3 when new tabs are added

## Todo List

- [ ] Add `revalidatePath("/")` to `upsertSetting` in settings-actions.ts
- [ ] Create `src/lib/types/homepage-cms-types.ts` with all type definitions
- [ ] Create `src/lib/constants/homepage-section-defaults.ts` with defaults + labels
- [ ] Verify existing admin edits (tours/services) now trigger homepage refresh
- [ ] Run `pnpm typecheck` to confirm no type errors

## Success Criteria

- [x] `upsertSetting` calls `revalidatePath("/")` — admin edits refresh homepage
- [x] `HomepageSectionKey` type covers all 12 sections
- [x] `SectionConfig` type has key, visible, order, title?, subtitle?
- [x] `DEFAULT_SECTIONS_CONFIG` matches current hardcoded page.tsx order
- [x] `pnpm typecheck` passes
- [x] No runtime regressions — existing admin features work

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| revalidatePath causes excessive ISR rebuilds | Low | Low | Only triggers on admin save, not on page load |
| Type file imported but unused initially | Low | None | Tree-shaken in production, used in Phase 2-4 |

## Security Considerations

None for this phase — no new endpoints, no auth changes.
