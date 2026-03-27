---
phase: 6
priority: critical
status: completed
effort: small
dependsOn: [2, 3, 4, 5]
---

# Phase 6: Homepage Assembly & Cleanup

## Overview
Compose all new sections into homepage, remove unused old components, verify build.

## Files to Modify
- `src/app/page.tsx` — Rewrite with new sections

## Implementation Steps

### 1. Rewrite `page.tsx`
```tsx
// Section order from Figma:
<HeroSection />
<TourPackageSection />
<ReviewsSection />
<ExperienceSection region="North" tours={northTours} />
<ExperienceSection region="Mid" tours={midTours} />
<ExperienceSection region="South" tours={southTours} />
<ServicesSection />
<EticketsSection />
<YoutubeSection />
<AboutSection />
<NewsletterSection />
```

### 2. Update SEO metadata
- Title: "Meetup Travel - Where Local Experts Craft A Journey Uniquely Yours"
- Description: travel-focused copy
- JSON-LD: Organization schema with Meetup Travel data

### 3. Cleanup
- Delete unused section components IF not used by other pages:
  - `features-section.tsx` — check /services
  - `stats-section.tsx` — check /about
  - `pricing-section.tsx` — check /services
  - `cta-section.tsx` — check other pages
  - Keep `faq-section.tsx` (likely reused)
- Only delete if confirmed unused across all pages

### 4. Build Verification
```bash
pnpm typecheck
pnpm build
```

## Success Criteria
- [ ] Homepage renders all 12 sections in correct order
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] SEO metadata updated for Meetup Travel
- [ ] No unused imports or dead code
