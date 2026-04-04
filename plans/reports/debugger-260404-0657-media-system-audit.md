# Media System Audit — 2026-04-04

## Summary

11 of 12 checks pass. 2 minor issues found: (1) `media-actions.ts` mutation helpers missing `revalidatePath`, (2) `LocalStorageAdapter.put` discards the `contentType` argument, falling back to extension-based MIME on read.

---

## Check Results

### 1. Upload flow — AdminImageField OK

`src/components/admin/admin-image-field.tsx`

- Line 5: imports `uploadMediaFile` and `replaceMediaFile` — correct.
- Line 54: `value.startsWith("/media/")` gates replace vs upload — correct.
- Line 57: `replaceMediaFile(formData)` called when replacing — correct.
- Line 68: `uploadMediaFile(formData)` called for new uploads — correct.
- Line 72: `onChange(result.data.url)` called after upload — correct.
- No `folder` param passed from this component — correct per spec.

Cache-buster pattern (lines 62-64): `onChange(value + "?v=" + Date.now())` then `setTimeout(() => onChange(value), 100)` is safe — the dirty URL is only held for ~100ms in React state. Parent form saves from controlled state after user clicks Save, not mid-flight. No risk of persisting the `?v=` URL to DB under normal UX flow. (Edge case: if save fires within 100ms — theoretical, not a practical bug.)

---

### 2. Upload flow — Media Library Dialog OK

`src/components/admin/admin-media-upload-dialog.tsx`

- Line 33: `folder?: string` prop received as `defaultFolder`.
- Line 38: `setFolder(defaultFolder ?? "")` — pre-populates state.
- Line 81: `if (folder) formData.append("folder", folder)` — appended before action call.
- Line 83: `uploadMediaFile(formData)` called correctly.
- Folder field is editable by user (line 139) — user can override pre-selected folder.

---

### 3. Server actions OK

`src/app/admin/_actions/media-upload-action.ts`

- `uploadMediaFile` (line 29): reads `folder` from formData → passed to `db.insert` at line 54. Correct.
- `replaceMediaFile`: finds record by URL (line 84), validates `storagePath` (line 85-87), overwrites storage (line 94), updates DB metadata only — url/filename unchanged (lines 98-104). Correct.
- Both actions call `revalidatePath("/admin/media")`.

---

### 4. Serve endpoint OK

`src/app/media/[filename]/route.ts`

- `SAFE_FILENAME = /^[a-z0-9][a-z0-9._-]*$/` (line 5) — allows alphanumeric, dots, dashes, underscores. Correctly handles `tour-ha-long-bay.webp`, `img-123-2.webp`, etc.
- Redundant `filename.includes("..")` check at line 15 — regex already blocks dots at start and double dots are blocked by the character class (only one dot allowed between runs of `[a-z0-9_-]`). Actually `.` is included in the class so `a..b` passes the regex but `..` alone fails the start anchor. Double-check: `test("a..b")` → true (passes regex). The explicit `includes("..")` guard is needed and correctly placed — good defense-in-depth.
- ETag = `"${filename}"` (line 33): suitable since filenames are content-addressed (SEO slug + collision suffix). Cache-Control: `public, max-age=31536000, immutable` on both 200 and 304.
- `X-Content-Type-Options: nosniff` set (line 56).

---

### 5. Storage layer — MINOR ISSUE

`src/lib/storage/local-storage-adapter.ts`

- `put(key, data, _contentType)` line 29: `contentType` param is **ignored** (prefixed with `_`). File is written as raw bytes without any metadata sidecar.
- `get(key)` line 36: MIME derived from `extname(key)` via `MIME_MAP`.

**Issue**: For SVG and GIF passthrough uploads, the original `mimeType` (`image/svg+xml`, `image/gif`) is not stored. Since `get` derives MIME from extension, SVGs stored as `.svg` will be served as `image/svg+xml` (correct). GIFs stored as `.gif` will be served as `image/gif` (correct). WebP always gets `.webp` extension from optimizer.

**Verdict**: No practical bug for current upload types because the extension is always written correctly by `generateSeoFilename`. However, the `_contentType` discard is a latent correctness risk if non-image types are added. Low severity for now.

**Recommended fix** (optional): Store content type in a sidecar or metadata file, or trust the extension mapping as-is and document the constraint.

---

### 6. Image optimizer OK

`src/lib/media/image-optimizer.ts`

- SVG/GIF passthrough: lines 26-40 — passes buffer unchanged, reads dimensions via sharp (with fallback on failure).
- Raster: `sharp(buffer).resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 })` — correct per spec.
- Returns `{ data, width, height, mimeType, ext }` — all fields used by callers.

---

### 7. SEO slug generator OK

`src/lib/media/seo-slug-generator.ts`

- Vietnamese `đ/Đ` handled explicitly before NFD (line 42-43) — necessary because `đ` doesn't decompose with NFD.
- NFD + strip combining diacritics (lines 44-45) — correct.
- Slug slice at 60 chars + trailing-dash trim (line 22) — correct.
- Collision loop (lines 27-31): checks storage `exists()`, appends `-2`, `-3`, etc.

One note: collision check calls `storage.exists()` synchronously in a while loop. Under high concurrency two simultaneous uploads with same alt text could both pass the `exists` check and generate the same filename. This is a known TOCTOU race on local storage. Acceptable for low-traffic admin use; document if scaling to CDN/S3.

---

### 8. Media actions — ISSUE (missing revalidatePath)

`src/app/admin/_actions/media-actions.ts`

- `fetchAdminMedia`: folder filter via `isNull(media.folder)` for `folder === null`, `eq(media.folder, folder)` otherwise — correct.
- `fetchMediaFolders` (line 40): filters `IS NOT NULL AND != ''`, groups by folder — correct.
- `renameMediaFolder` (line 67): bulk-updates folder name — correct.
- `deleteMediaFolder` (line 73): sets folder to `null` (moves to root) — correct.
- `getMediaUsage` (line 83): scans posts (coverImage, ogImage, content), slides, tourPackages (image, gallery), siteSettings, pages — comprehensive.
- `deleteMedia` (line 144): deletes storage file first, then DB record — correct order.

**Issue**: `renameMediaFolder`, `deleteMediaFolder`, `updateMediaFolder`, `deleteMedia`, `createMedia` do NOT call `revalidatePath`. The admin media page will show stale data after these mutations until Next.js cache expires or a full reload.

`deleteMedia` and `createMedia` are likely called from `useAdminMedia` which calls `refresh()` client-side (hook line 54), so the UI refreshes. But server-side cache for `/admin/media` is not invalidated — affects any SSR or pre-fetched render.

**File**: `src/app/admin/_actions/media-actions.ts` — add `revalidatePath("/admin/media")` after mutations in: `renameMediaFolder` (line 69), `deleteMediaFolder` (line 75), `updateMediaFolder` (line 63), `deleteMedia` (line 159).

---

### 9. Hook OK

`src/hooks/use-admin-media.ts`

- `folders`, `rootCount`, `totalCount` exposed (lines 75-81).
- `addItem` (line 59): prepends to items array, increments total, calls `loadFolders()` — correct optimistic update.
- `refresh` (line 54): re-calls `load` and `loadFolders` — correct.
- `removeMedia` (line 65): calls `deleteMedia` server action, removes from local state, calls `loadFolders()` — correct.

---

### 10. Admin components integration OK

All three components import and use `AdminImageField` correctly:

- `admin-tour-basic-tab.tsx` line 31-36: `value={form.image}`, `onChange={(url) => onChange("image", url)}`, `alt={form.title}` — wired correctly.
- `admin-slide-dialog.tsx` line 60-65: `value={imageUrl || ""}`, `onChange={(url) => setValue("image", url)}` (react-hook-form), `alt={watch("title")}` — wired correctly.
- `admin-homepage-about-tab.tsx` lines 69-74 and 98-103: map over IMAGE_FIELDS and individual photo fields — wired correctly.

No component passes `folder` to `AdminImageField` (as expected — folder only in media library dialog).

---

### 11. API upload endpoint — MINOR ISSUE

`src/app/api/media/upload/route.ts`

- Auth: `checkApiAccess(request)` line 14 — correct.
- Optimization: `optimizeImage` + `generateSeoFilename` called correctly.
- Storage: `storage.put(filename, optimized.data, optimized.mimeType)` — correct.
- DB insert: url = `/media/${filename}` (line 45) — consistent with serve route.
- `revalidatePath("/admin/media")` called (line 61).

**Issue**: DB insert (lines 48-58) does NOT include `folder` field. The API endpoint has no `folder` parameter support. Callers via API cannot assign a folder at upload time. Minor omission — folders can be assigned after upload via `updateMediaFolder`.

**Recommended fix**: Read `folder` from `formData.get("folder")` and include in DB insert if provided.

---

### 12. Next.js config OK

`next.config.ts`

- `/media/(.*)` rule exists (line 66-72): `Cache-Control: public, max-age=31536000, immutable` — matches what the route handler also sets. Redundant but harmless (route handler headers take precedence for dynamic routes).
- Rule is present and correctly formatted.

---

## Issues Summary

| # | Severity | File | Issue |
|---|----------|------|-------|
| 8 | Low | `media-actions.ts:63,69,75,159` | Missing `revalidatePath("/admin/media")` on mutations — stale SSR cache |
| 5 | Low | `local-storage-adapter.ts:29` | `contentType` param discarded; MIME derived from extension only |
| 11 | Low | `api/media/upload/route.ts:48-58` | API upload endpoint does not accept/store `folder` field |

---

## Recommended Fixes

### Fix 1 — Add `revalidatePath` to media-actions.ts mutations

```ts
// After each mutation in: updateMediaFolder, renameMediaFolder, deleteMediaFolder, deleteMedia
import { revalidatePath } from "next/cache";
// ...
revalidatePath("/admin/media");
```

### Fix 2 — API upload: support folder param

```ts
// src/app/api/media/upload/route.ts
const folder = (formData.get("folder") as string) || null;
// Add to DB insert values:
folder,
```

### Fix 3 — LocalStorageAdapter: document or fix contentType discard

Either rename `_contentType` to `contentType` and write a sidecar JSON with metadata, or add a code comment clarifying MIME is always derived from extension (acceptable if extension is always set correctly by the optimizer).

---

## Unresolved Questions

- None — all wiring is confirmed or has concrete evidence for the issues above.
