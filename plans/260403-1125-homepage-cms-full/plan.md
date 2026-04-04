---
title: "Full Homepage CMS — Manage All 12 Sections from Admin"
description: "Extend admin panel to manage every homepage section: section registry, hero slides, experience, about, newsletter, eTickets"
status: pending
priority: P1
effort: 10h
branch: main
tags: [cms, admin, homepage, backend, frontend]
created: 2026-04-03
---

# Full Homepage CMS

## Problem Statement

Homepage has 12 sections. Only 4 are manageable from admin (tours, services, reviews, videos). Hero slides have a separate admin page but no link from homepage admin. Experience sections have CMS backend but no admin UI. About, Newsletter, and eTickets are fully hardcoded with no CMS at all. Section ordering/visibility is fixed in code.

## Architecture Decision: Extend siteSettings JSONB

**Why not a new table?** The existing `siteSettings` key-value JSONB store is already proven for 4 homepage sections. Adding new keys (`homepage_about`, `homepage_newsletter`, `homepage_etickets`, `homepage_sections_config`) follows the established pattern with zero schema migration. The data is small JSON (< 50KB per key). No new queries or connection patterns needed.

**Why not move hero slides into siteSettings?** Slides already use a dedicated table with proper CRUD, sort order, and active/inactive toggles. The admin page exists at `/admin/slides`. Moving data would be a regression. Instead, surface the existing `/admin/slides` link within the homepage admin UI.

## Data Flow

```
Admin Panel (client) 
  --> useAdminHomepage hook 
    --> upsertSetting() server action 
      --> siteSettings table (JSONB)
        --> revalidatePath("/") [NEW - currently missing]

Homepage (server components)
  --> getSetting<T>("key") 
    --> render with CMS data || fallback
```

**Critical fix**: `upsertSetting()` does NOT call `revalidatePath("/")`. Homepage server components see stale data until next deploy. Must add revalidation.

## Phase Summary

| # | Phase | Effort | Status | Files |
|---|-------|--------|--------|-------|
| 1 | [Fix revalidation + add section config type](./phase-01-section-registry.md) | 1.5h | Pending | 4 files |
| 2 | [CMS-ify About, Newsletter, eTickets sections](./phase-02-cms-hardcoded-sections.md) | 3h | Pending | 6 files |
| 3 | [Extend admin homepage — new tabs + section config UI](./phase-03-admin-ui-extension.md) | 4h | Pending | 10 files |
| 4 | [Dynamic section rendering in page.tsx](./phase-04-dynamic-homepage.md) | 1.5h | Pending | 2 files |

## Dependency Graph

```
Phase 1 (registry + revalidation)
  |
  +--> Phase 2 (CMS-ify hardcoded sections) -- no dependency on Phase 3
  |
  +--> Phase 3 (admin UI) -- no dependency on Phase 2
  |
  v
Phase 4 (dynamic rendering) -- depends on Phase 1 + 2 + 3
```

Phases 2 and 3 can run in parallel after Phase 1 completes.

## CMS Keys (New)

| Key | Type | Purpose |
|-----|------|---------|
| `homepage_sections_config` | `SectionConfig[]` | Order, visibility, custom titles for all 12 sections |
| `homepage_about` | `AboutData` | Title, quote, mobile photos, desktop/team/dragon/temple/cloud images |
| `homepage_newsletter` | `NewsletterData` | Title, description text |
| `homepage_etickets` | `EticketsData` | Title, cities list, passengers list |

## Backwards Compatibility

- All new CMS keys default to `null` (not set) in DB
- Every section component keeps its existing FALLBACK data
- If `homepage_sections_config` is null, page.tsx renders all 12 sections in current hardcoded order
- No DB migration required (siteSettings is key-value, just insert new keys)
- Existing admin tabs (tours, services, reviews, videos) unchanged

## Rollback Plan

- Phase 1: Revert the revalidatePath addition (one line). Section config type is additive.
- Phase 2: Components still render with fallback. Delete CMS keys from DB and revert component changes.
- Phase 3: Admin UI is independent. Revert admin page changes; homepage still works.
- Phase 4: Replace dynamic page.tsx with current static version (46 lines, trivially restorable from git).

## Test Matrix

| Scope | What | How |
|-------|------|-----|
| Unit | Section config type validation | Zod schema parse tests |
| Integration | getSetting returns correct data for new keys | Manual: insert via admin, verify homepage |
| Integration | revalidatePath triggers on upsertSetting | Save in admin, reload homepage without cache clear |
| E2E | Admin adds About content, homepage reflects it | Manual flow |
| E2E | Admin toggles section visibility, homepage hides it | Manual flow |
| E2E | Empty DB: all sections render with fallbacks | Delete all siteSettings rows, reload homepage |
| Regression | Existing 4 tabs still work | Edit a tour in admin, verify homepage |

## Unresolved Questions

1. Should section titles from `homepage_sections_config` override the component's internal title, or just be a label for admin UI? (Recommendation: override — more useful for i18n/customization)
2. Should we add drag-and-drop reordering or simple up/down arrows? (Recommendation: up/down arrows — KISS, no extra dependency)
