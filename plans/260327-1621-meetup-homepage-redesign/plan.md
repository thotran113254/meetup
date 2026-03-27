---
status: completed
mode: parallel
created: 2026-03-27
scope: hold
blockedBy: []
blocks: []
---

# Meetup Travel Homepage Redesign

## Overview
Redesign homepage from generic "YourBrand" template to Meetup Travel travel agency site, matching Figma prototype exactly.

## Design Reference
Figma captures: `/tmp/figma-captures/section-00-hero.png` through `section-15.png`

## Design Tokens
| Token | Value |
|-------|-------|
| Primary | `#2CBCB3` (teal) |
| Primary dark | `#239A93` |
| Accent (script text) | `#E87C3E` (orange/coral) |
| Background | `#ffffff` |
| Card border | `#e5e7eb` |
| Footer bg | gradient `#2CBCB3` → `#5DD5CD` |
| Radius | `0.75rem` |
| Script font | `Dancing Script` or `Pacifico` |
| Body font | system sans-serif (Geist) |

## Execution Strategy

```
Phase 1 (Foundation)     ──────────────────────►
                                                 │
Phase 2 (Header)         ─────────►              │
Phase 3 (Sections A)     ─────────► PARALLEL     │
Phase 4 (Sections B)     ─────────►              │
Phase 5 (Footer+Float)   ─────────►              │
                                                 │
Phase 6 (Assembly)       ◄───────────────────────┘
```

Phase 1 runs first (foundation). Phases 2-5 run in parallel. Phase 6 assembles everything.

## File Ownership Matrix

| Phase | Owns (create/edit) | Reads only |
|-------|-------------------|------------|
| 1 | `site-config.ts`, `globals.css`, `layout.tsx` | - |
| 2 | `site-header.tsx` | `site-config.ts` |
| 3 | `hero-section.tsx`, `tour-package-section.tsx`, `tour-card.tsx`, `reviews-section.tsx` | `site-config.ts`, `globals.css` |
| 4 | `experience-section.tsx`, `services-section.tsx`, `etickets-section.tsx`, `youtube-section.tsx`, `about-section.tsx`, `newsletter-section.tsx` | `site-config.ts` |
| 5 | `site-footer.tsx`, `floating-social.tsx` | `site-config.ts` |
| 6 | `page.tsx` | All section components |

## Phases

- [x] [Phase 1: Foundation](./phase-01-foundation.md) — Config, theme, fonts
- [x] [Phase 2: Header](./phase-02-header.md) — Navigation redesign
- [x] [Phase 3: Sections A](./phase-03-sections-hero-tours-reviews.md) — Hero, Tour Package, Reviews
- [x] [Phase 4: Sections B](./phase-04-sections-experiences-services-etickets-youtube-about-newsletter.md) — Experiences, Services, eTickets, YouTube, About, Newsletter
- [x] [Phase 5: Footer & Floating](./phase-05-footer-floating-social.md) — Footer + floating social buttons
- [x] [Phase 6: Assembly](./phase-06-homepage-assembly.md) — Compose homepage + cleanup

## Success Criteria
- Homepage matches Figma prototype visually
- All 12 sections rendered
- Responsive (mobile + desktop)
- No TypeScript errors, builds clean
- Static data (no DB schema changes needed)
