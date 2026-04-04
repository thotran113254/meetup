---
title: "Media Upload & Management System"
description: "Real file uploads with sharp optimization, storage abstraction, media proxy, and admin UI replacement"
status: pending
priority: P1
effort: 12h
branch: main
tags: [media, upload, admin, storage, optimization]
created: 2026-04-04
---

# Media Upload & Management System

## Summary

Replace URL-only media registration with real file upload pipeline: multipart upload -> sharp optimization -> local storage (swappable to R2/S3) -> API proxy with cache headers -> admin UI with drag-and-drop.

## Architecture Overview

```
Browser (admin)                    Server
 |                                  |
 | multipart/form-data             |
 |-----[POST /api/media/upload]--->|
 |                                  |-- validate (type, size)
 |                                  |-- sharp resize/compress
 |                                  |-- storage-adapter.put(file)
 |                                  |-- insert DB record
 |<----{ id, url, filename }-------|
 |                                  |
 | <img src="/api/media/f/xxx.webp">|
 |-----[GET /api/media/f/:name]--->|
 |                                  |-- storage-adapter.get(name)
 |<----[image + cache headers]-----|
```

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Storage root | `data/uploads/` at project root | Outside `public/` to control access; `data/` is a clean namespace |
| File naming | `{timestamp}-{8-char-hash}.{ext}` | Collision-proof, sortable, no PII in filenames |
| Optimization | Sharp on upload -> single optimized output | KISS: one output, not multiple sizes; Next.js Image handles responsive |
| Output format | WebP (fallback original for SVG/GIF) | 30-50% smaller than JPEG/PNG; browser support >97% |
| Max dimensions | 2048px longest edge | Sufficient for hero banners; keeps files <500KB typically |
| Quality | 80 for WebP | Good balance of quality vs size |
| URL pattern | `/api/media/f/[filename]` | Namespace under existing `/api/media`, `f/` for "file" |
| Max upload size | 10MB | Covers all reasonable web images |
| Storage adapter | Interface with LocalStorageAdapter default | Swap to R2Adapter later without changing upload/serve logic |

## Data Flow

1. **Upload**: Admin selects file -> browser sends `FormData` -> API validates -> sharp processes -> adapter writes to disk -> DB row inserted -> response with URL
2. **Serve**: Any page requests `/api/media/f/filename.webp` -> API reads from adapter -> streams with `Cache-Control: public, max-age=31536000, immutable`
3. **Browse**: Media library fetches paginated list from DB -> shows thumbnails using serve URL -> click to copy URL or select for insertion
4. **Delete**: Admin clicks delete -> API removes DB row -> adapter deletes file from disk

## Schema Changes

Extend existing `media` table (non-breaking):
- Add `storagePath` (text, nullable) — physical path in storage adapter
- Add `mimeType` (text, nullable) — e.g. `image/webp`
- Add `width` (integer, nullable) — pixel width after optimization
- Add `height` (integer, nullable) — pixel height after optimization

Existing rows with `storagePath = null` are legacy URL-only entries (backward compatible).

## Phases

| # | Phase | Files | Effort | Status |
|---|---|---|---|---|
| 1 | [Storage Abstraction](phase-01-storage-abstraction.md) | 3 new | 1.5h | Pending |
| 2 | [Upload API](phase-02-upload-api.md) | 2 new, 2 modified | 3h | Pending |
| 3 | [Media Proxy](phase-03-media-proxy.md) | 1 new, 1 modified | 1.5h | Pending |
| 4 | [Admin Upload UI](phase-04-admin-upload-ui.md) | 3 new, 2 modified | 3h | Pending |
| 5 | [Integration](phase-05-integration.md) | ~15 modified | 2h | Pending |
| 6 | [Migration](phase-06-migration.md) | 1 script | 1h | Pending |

## Dependency Graph

```
Phase 1 (Storage) --> Phase 2 (Upload API) --> Phase 4 (Admin UI)
                  --> Phase 3 (Media Proxy) --> Phase 4 (Admin UI)
                                            --> Phase 5 (Integration)
                                            --> Phase 6 (Migration)
```

Phase 1 blocks everything. Phases 2 and 3 can run in parallel after 1. Phase 4 needs both 2 and 3. Phase 5 needs 3 (serve URLs). Phase 6 runs last.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Sharp build fails on VPS | Medium | High | Use `sharp` npm package (prebuilt binaries); fallback: skip optimization, store original |
| Large file exhausts memory | Low | Medium | Stream processing with sharp; 10MB upload cap; reject early on Content-Length |
| Disk fills up on VPS | Low | High | Monitor disk usage; compression reduces ~60%; future: move to R2 |
| Breaking existing image refs | Medium | High | Keep `/public/images/` working; migration is additive, not destructive |
| Admin components regression | Low | Medium | Upload component is additive — text input stays as fallback initially |

## Rollback Plan

Each phase is independently revertable:
- **Phase 1**: No user-facing change, just library code
- **Phase 2**: New API route, remove route file to revert
- **Phase 3**: New serve route, remove to revert (existing `/images/` paths unaffected)
- **Phase 4**: New UI component, revert admin dialogs to text inputs
- **Phase 5**: Revert admin component changes (text inputs still work)
- **Phase 6**: Migration script is read-only on existing files (copies, doesn't move)

## Test Matrix

| Layer | What | How |
|---|---|---|
| Unit | Storage adapter put/get/delete | Jest/Vitest with temp dir |
| Unit | Sharp optimization (size, format, dimensions) | Process test image, assert output |
| Unit | Upload validation (file type, size limits) | Mock request with various payloads |
| Integration | Upload -> store -> serve roundtrip | POST file, GET served URL, compare |
| Integration | Media library CRUD with real uploads | Upload, list, delete via admin actions |
| E2E | Admin drag-and-drop upload flow | Manual QA in browser |

## Backwards Compatibility

- Existing `/public/images/*` paths continue working (Next.js static serving unchanged)
- Existing `media` table rows with URL-only data still work (storagePath=null treated as external URL)
- Admin components accept both URL input and file upload
- No breaking changes to existing API endpoints
