# Planner Report: Media Upload & Management System

**Date**: 2026-04-04
**Plan**: `/home/automation/meetup/plans/260404-0551-media-upload-system/`
**Total Effort**: ~12h across 6 phases

## Summary

Designed comprehensive media upload system replacing URL-only media registration with real file upload pipeline. Core flow: multipart upload -> sharp optimization (WebP, max 2048px) -> local storage adapter (swappable to R2/S3) -> API proxy with 1yr immutable cache -> admin UI with drag-drop and media picker.

## Key Design Decisions

1. **Storage**: `data/uploads/` outside public dir, accessed only via `/api/media/f/[filename]` proxy route
2. **Optimization**: Single WebP output per upload (sharp, q80, max 2048px). No multi-size generation — Next.js Image handles responsive. SVG/GIF stored as-is
3. **Naming**: `{timestamp}-{8-char-md5}.{ext}` — collision-proof, sortable, immutable-cacheable
4. **Schema**: 4 nullable columns added to existing `media` table (non-breaking): `storagePath`, `mimeType`, `width`, `height`
5. **Admin UX**: New `AdminImageField` wrapper replaces ~15 text inputs with picker + preview. URL paste still works as fallback
6. **Migration**: Additive only — copies+optimizes `/public/images/` into new system, originals untouched. Estimated 80% size reduction (102MB -> ~20MB)

## Phase Summary

| # | Phase | Effort | New Files | Modified Files | Blocks |
|---|---|---|---|---|---|
| 1 | Storage Abstraction | 1.5h | 2 | 1 | 2, 3 |
| 2 | Upload API | 3h | 2 | 3 | 4, 6 |
| 3 | Media Proxy | 1.5h | 1 | 0-1 | 4, 5, 6 |
| 4 | Admin Upload UI | 3h | 2 | 4 | 5 |
| 5 | Integration | 2h | 1 | ~15 | - |
| 6 | Migration | 1h | 1 | 1 | - |

## Risk Register (High items)

| Risk | Mitigation |
|---|---|
| Sharp binary fails on VPS | Prebuilt binaries ship with npm; fallback: store unoptimized original |
| Breaking existing `/images/` refs | Migration is additive; old paths served by Next.js static serving unchanged |
| Admin regression | Image field is additive — URL text input preserved as fallback/display |

## New Dependencies
- `sharp` + `@types/sharp` (image processing)
- `tsx` (dev, for migration script — may already be available via npx)

## File Ownership (no overlaps between phases)

- Phase 1: `src/lib/storage/*`, `.gitignore`
- Phase 2: `src/app/api/media/upload/*`, `src/lib/media/*`, `src/db/schema.ts`, `package.json`
- Phase 3: `src/app/api/media/f/*`
- Phase 4: `src/components/admin/admin-file-upload-zone.tsx`, `admin-media-upload-dialog.tsx`, `admin-media-picker-dialog.tsx`, `use-admin-media.ts`, `media-actions.ts`
- Phase 5: `src/components/admin/admin-image-field.tsx`, all dialog/tab components
- Phase 6: `scripts/migrate-static-images.ts`

**Status:** DONE
**Summary:** Complete 6-phase plan created with architecture, data flows, failure modes, rollback strategy, and per-component integration mapping.
