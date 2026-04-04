# Phase 4: Dynamic Section Rendering in page.tsx

## Context Links
- [Homepage page.tsx](../../src/app/(website)/page.tsx) (46 lines, static section list)
- [Phase 1 types + defaults](./phase-01-section-registry.md)
- [Phase 2 CMS sections](./phase-02-cms-hardcoded-sections.md)
- [Phase 3 admin config tab](./phase-03-admin-ui-extension.md)

## Overview
- **Priority**: P2
- **Status**: Pending
- **Effort**: 1.5h
- **Blocked by**: Phase 1 + Phase 2 + Phase 3

Replace the static section list in `page.tsx` with dynamic rendering driven by `homepage_sections_config` from the CMS. Sections render in admin-configured order, hidden sections are skipped.

## Key Insights

1. **Current page.tsx** is 46 lines with hardcoded JSX for all 12 sections. Clean and simple.
2. **Dynamic rendering** needs a key-to-component map. Each section is an async server component, so they can be rendered directly in JSX — no dynamic `import()` needed.
3. **Experience sections** are 3 separate entries in config but use the same component with different `region` prop. The key encodes the region: `experience-north` -> `<ExperienceSection region="North" />`.
4. **Fallback**: if `homepage_sections_config` is null (no DB entry), render all sections in current default order. This ensures zero-downtime during rollout.
5. **Custom titles**: sections receive an optional `customTitle` prop from config. Components can use it or ignore it (progressive adoption).

## Architecture

### Section Registry Map

```tsx
const SECTION_MAP: Record<HomepageSectionKey, React.ReactNode> = {
  "hero": <HeroSection />,
  "tours": <TourPackageSection />,
  "reviews": <ReviewsSection />,
  "experience-north": <ExperienceSection region="North" />,
  "experience-mid": <ExperienceSection region="Mid" />,
  "experience-south": <ExperienceSection region="South" />,
  "services": <ServicesSection />,
  "latest-posts": <LatestPostsSection />,
  "etickets": <EticketsSection />,
  "youtube": <YoutubeSection />,
  "about": <AboutSection />,
  "newsletter": <NewsletterSection />,
};
```

**Why a static map, not dynamic imports?** All section components are already imported in page.tsx. They're server components — tree-shaking handles unused ones. A static map is simpler, type-safe, and has zero runtime overhead. KISS.

### Data Flow

```
page.tsx (server component)
  --> getSetting<SectionConfig[]>("homepage_sections_config")
  --> fallback to DEFAULT_SECTIONS_CONFIG if null
  --> sort by order
  --> filter visible === true
  --> map to SECTION_MAP[key]
  --> render in order
```

### Custom Title Prop Threading

**Option A (chosen)**: Sections that support custom titles accept an optional `customTitle?: string` prop. The registry passes it through. Sections that don't care ignore it.

**Option B (rejected)**: Wrap each section in a `<SectionWrapper title={...}>`. Adds a DOM layer and complicates styling. Violates KISS.

**Implementation**: Only a few sections display a visible heading (tours, reviews, experience, services, youtube, about, newsletter). For Phase 4 MVP, pass `customTitle` to sections that already have a title prop or can easily accept one. Defer full title override for all sections to a future iteration if needed.

**Decision**: For this phase, we pass `customTitle` only when rendering. Each section component decides whether to use it. No forced API change on all 12 components — that's Phase 2's job for about/newsletter/etickets, and existing sections can add it incrementally.

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/app/(website)/page.tsx` | Replace static JSX with dynamic section renderer |

### Files to Create
| File | Purpose |
|------|---------|
| `src/lib/helpers/homepage-section-renderer.tsx` | Section map + renderer function (keeps page.tsx clean) |

### Files NOT changed
- All section components — they already work with or without custom titles
- DB schema, queries, admin — already handled in Phase 1-3

## Implementation Steps

### Step 1: Create section renderer helper (30 min)

Create `src/lib/helpers/homepage-section-renderer.tsx`:

```tsx
import type { SectionConfig, HomepageSectionKey } from "@/lib/types/homepage-cms-types";
import { DEFAULT_SECTIONS_CONFIG } from "@/lib/constants/homepage-section-defaults";
import { getSetting } from "@/db/queries/settings-queries";

// Import all section components
import { HeroSection } from "@/components/sections/homepage/hero-section";
import { TourPackageSection } from "@/components/sections/homepage/tour-package-section";
import { ReviewsSection } from "@/components/sections/homepage/reviews-section";
import { ExperienceSection } from "@/components/sections/homepage/experience-section";
import { ServicesSection } from "@/components/sections/homepage/services-section";
import { LatestPostsSection } from "@/components/sections/homepage/latest-posts-section";
import { EticketsSection } from "@/components/sections/homepage/etickets-section";
import { YoutubeSection } from "@/components/sections/homepage/youtube-section";
import { AboutSection } from "@/components/sections/homepage/about-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";

/** Map section key to its React element */
function renderSection(key: HomepageSectionKey): React.ReactNode {
  switch (key) {
    case "hero": return <HeroSection />;
    case "tours": return <TourPackageSection />;
    case "reviews": return <ReviewsSection />;
    case "experience-north": return <ExperienceSection region="North" />;
    case "experience-mid": return <ExperienceSection region="Mid" />;
    case "experience-south": return <ExperienceSection region="South" />;
    case "services": return <ServicesSection />;
    case "latest-posts": return <LatestPostsSection />;
    case "etickets": return <EticketsSection />;
    case "youtube": return <YoutubeSection />;
    case "about": return <AboutSection />;
    case "newsletter": return <NewsletterSection />;
  }
}

/** Load section config from CMS and return ordered, visible sections as React nodes */
export async function getHomepageSections(): Promise<React.ReactNode[]> {
  let config = DEFAULT_SECTIONS_CONFIG;
  try {
    const cms = await getSetting<SectionConfig[]>("homepage_sections_config");
    if (Array.isArray(cms) && cms.length > 0) config = cms;
  } catch {
    // DB unavailable — use defaults (all sections, default order)
  }

  return config
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((s) => renderSection(s.key));
}
```

**Why a switch instead of a Record map?** Switch is exhaustive with TypeScript — the compiler warns if a new key is added to `HomepageSectionKey` but not handled here. A Record map silently omits it. Worth the few extra lines.

### Step 2: Update page.tsx (15 min)

Replace static section list with dynamic renderer:

```tsx
import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo-utils";
import { getHomepageSections } from "@/lib/helpers/homepage-section-renderer";

export const metadata: Metadata = generatePageMetadata({
  title: "Meetup Travel - Where Local Experts Craft A Journey Uniquely Yours",
  description: "Discover Vietnam with local experts...",
  path: "/",
});

export default async function HomePage() {
  const sections = await getHomepageSections();

  return (
    <>
      <JsonLdScript data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />
      {sections.map((section, i) => (
        <Fragment key={i}>{section}</Fragment>
      ))}
    </>
  );
}
```

**Note**: `HomePage` becomes `async` (it already can be — it's a server component). The `Fragment` key uses index which is fine here since section order is stable per render and sections are not reordered client-side.

### Step 3: Verify (45 min)

- `pnpm typecheck` — passes
- `pnpm build` — production build succeeds (catches any server/client boundary issues)
- **Test: no DB config** — delete `homepage_sections_config` from DB. All 12 sections render in default order. Identical to current behavior.
- **Test: hide a section** — insert config with `about.visible = false`. About section disappears from homepage.
- **Test: reorder** — swap tours and reviews in config. Homepage reflects new order.
- **Test: DB unavailable** — stop postgres, reload homepage. All sections render with fallbacks (no crash).

## Todo List

- [ ] Create `src/lib/helpers/homepage-section-renderer.tsx`
- [ ] Update `src/app/(website)/page.tsx` to use `getHomepageSections()`
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds
- [ ] Test: no config in DB -> default order, all visible
- [ ] Test: section hidden in config -> not rendered
- [ ] Test: reordered in config -> rendered in new order
- [ ] Test: DB down -> fallback renders all sections

## Success Criteria

- Homepage renders sections dynamically from CMS config
- Admin can control order and visibility without code changes
- Zero visual regression when no config is set (fallback = current behavior)
- Production build succeeds
- page.tsx stays under 30 lines (clean, delegating)
- Helper file under 80 lines

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Extra DB query per homepage load (getSetting for config) | Low | Low | Single SELECT by key, <1ms. Cached by ISR. |
| Server component async conversion breaks something | Low | Medium | page.tsx is already in server component context; async is native |
| Fragment key={i} causes React reconciliation issues | Very Low | Low | Sections are server-rendered, no client-side reconciliation. Index is stable. |
| New section added later but not in switch | Low | Medium | TypeScript exhaustive switch catches this at compile time |

## Security Considerations

No new endpoints. `getSetting` is read-only server-side. No user input reaches the renderer — section keys are validated against the `HomepageSectionKey` type.

## Next Steps (post-Phase 4)

- **Custom titles**: thread `customTitle` from config into section components that display headings. Low priority — can be done incrementally per section.
- **Preview mode**: admin sees a live preview of section order changes before saving. Future enhancement.
- **Section-specific settings**: each config entry could carry section-specific overrides (e.g., "tours" config could set max items to display). Deferred — YAGNI.
