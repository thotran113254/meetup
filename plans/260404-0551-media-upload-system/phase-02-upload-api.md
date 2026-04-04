# Phase 2: Upload API Endpoint

## Context Links
- [plan.md](plan.md) — Overview
- [phase-01-storage-abstraction.md](phase-01-storage-abstraction.md) — Storage layer (dependency)
- [src/app/api/media/route.ts](/home/automation/meetup/src/app/api/media/route.ts) — Existing media API
- [src/lib/api-auth.ts](/home/automation/meetup/src/lib/api-auth.ts) — Auth pattern
- [src/db/schema.ts](/home/automation/meetup/src/db/schema.ts) — Media schema
- [src/lib/validations/media-schema.ts](/home/automation/meetup/src/lib/validations/media-schema.ts) — Existing validation

## Overview
- **Priority**: P1
- **Status**: Pending
- **Effort**: 3h
- **Blocked by**: Phase 1

New `POST /api/media/upload` endpoint that accepts `multipart/form-data`, processes images with sharp, stores via storage adapter, and inserts DB record.

## Key Insights
- Existing `POST /api/media` registers URL-only records — keep it working, add new upload route alongside
- Next.js 16 handles `formData()` natively on `NextRequest` — no multer needed
- Sharp has prebuilt binaries for Linux x64 — should work on VPS without build tools
- Server Actions can't handle multipart easily — use API route
- Admin UI currently calls server actions, not API routes. New upload will use API route from client, then server action delegates OR client calls API directly

## Architecture

### Upload Flow

```
Client FormData(file, alt?)
  |
  v
POST /api/media/upload
  |
  |-- 1. Parse formData, extract File object
  |-- 2. Validate: type (image/*), size (<10MB)
  |-- 3. Read file into Buffer
  |-- 4. If raster image: sharp pipeline
  |       - Resize to max 2048px longest edge (preserve aspect ratio, no upscale)
  |       - Convert to WebP at quality 80
  |       - Extract width/height metadata
  |-- 5. If SVG/GIF: store original (no sharp processing)
  |-- 6. Generate filename: {timestamp}-{hash8}.{ext}
  |-- 7. storage.put(filename, buffer, mimeType)
  |-- 8. Insert into media table
  |-- 9. Return { data: mediaRow }
```

### Filename Generation

```typescript
function generateFilename(originalName: string, isWebP: boolean): string {
  const timestamp = Date.now();
  const hash = createHash("md5").update(originalName + timestamp).digest("hex").slice(0, 8);
  const ext = isWebP ? "webp" : extname(originalName).toLowerCase();
  return `${timestamp}-${hash}${ext}`;
}
// Example: "1712217600000-a3f2b9c1.webp"
```

## Schema Changes

Extend `media` table (non-breaking additions):

```typescript
// Add to src/db/schema.ts media table:
storagePath: text("storage_path"),     // null = legacy URL-only record
mimeType: text("mime_type"),           // "image/webp", "image/svg+xml", etc.
width: integer("width"),               // pixel width after optimization
height: integer("height"),             // pixel height after optimization
```

After schema change: `pnpm db:push`

## Files to Create

| File | Purpose | ~Lines |
|---|---|---|
| `src/app/api/media/upload/route.ts` | Upload endpoint | ~120 |
| `src/lib/media/image-optimizer.ts` | Sharp processing logic | ~80 |

## Files to Modify

| File | Change |
|---|---|
| `src/db/schema.ts` | Add storagePath, mimeType, width, height to media table |
| `package.json` | Add `sharp` dependency |
| `src/lib/validations/media-schema.ts` | Add upload-specific schema (optional — can keep separate) |

## Implementation Steps

1. **Install sharp**
   ```bash
   pnpm add sharp && pnpm add -D @types/sharp
   ```

2. **Update schema** — add 4 nullable columns to `media` table in `src/db/schema.ts`
   - `storagePath`, `mimeType`, `width`, `height`
   - All nullable for backward compat with existing rows

3. **Push schema**: `pnpm db:push`

4. **Create `src/lib/media/image-optimizer.ts`**
   - Export `optimizeImage(buffer: Buffer, mimeType: string)` -> `{ data: Buffer, width: number, height: number, mimeType: string, ext: string }`
   - For JPEG/PNG/WebP/AVIF: resize to max 2048px, convert to WebP q80
   - For SVG: return original buffer unchanged (mimeType = `image/svg+xml`)
   - For GIF: return original buffer unchanged (preserve animation)
   - Use sharp's `metadata()` for width/height extraction

5. **Create `src/app/api/media/upload/route.ts`**
   - `export async function POST(request: NextRequest)`
   - Auth check via `checkApiAccess(request)`
   - Parse `request.formData()`, get file from `file` field
   - Validate: must be `image/*` MIME, size <= 10MB
   - Read file to Buffer via `Buffer.from(await file.arrayBuffer())`
   - Call `optimizeImage(buffer, file.type)`
   - Generate filename
   - `storage.put(filename, optimizedBuffer, mimeType)`
   - Insert media row with all fields (url = `/api/media/f/${filename}`, storagePath = filename)
   - `revalidatePath("/admin/media")` for ISR
   - Return `{ data: mediaRow }` with status 201

6. **Create upload server action** `src/app/admin/_actions/media-upload-action.ts`
   - Thin wrapper: receives FormData from client, forwards to upload API route internally
   - OR: call storage + sharp directly from server action (avoids HTTP hop)
   - Decision: **Call storage directly** — server actions run on same server, no need for HTTP round-trip
   - Export `uploadMediaFile(formData: FormData)` -> `{ data?: MediaRow; error?: string }`

## Validation Rules

| Check | Value | Error |
|---|---|---|
| File present | `formData.get("file")` exists | 400 "No file provided" |
| File type | `file.type` starts with `image/` | 400 "Only image uploads supported" |
| File size | `file.size <= 10 * 1024 * 1024` | 400 "File too large (max 10MB)" |
| Filename | Not empty | 400 "Invalid filename" |

## Todo List

- [ ] Install sharp + @types/sharp
- [ ] Add storagePath, mimeType, width, height columns to media schema
- [ ] Run pnpm db:push
- [ ] Create image-optimizer.ts with sharp pipeline
- [ ] Create upload/route.ts API endpoint
- [ ] Create media-upload-action.ts server action
- [ ] Verify upload -> store -> DB roundtrip works

## Success Criteria
- `POST /api/media/upload` with image file returns 201 with media record
- Image stored in `data/uploads/` as WebP
- Original 500KB JPEG becomes ~100-200KB WebP
- SVG files stored as-is (no conversion)
- Width/height metadata stored in DB
- Existing `POST /api/media` (URL-only) still works unchanged

## Risk Assessment
- **Sharp binary missing on VPS**: `pnpm add sharp` downloads prebuilt. If fails, degrade to storing original without optimization
- **Memory spike on large file**: 10MB cap limits risk; sharp streams internally; Node buffer allocation is manageable
- **Concurrent uploads**: Each gets unique filename (timestamp+hash); no race condition on writes

## Security Considerations
- Auth required (checkApiAccess) — no anonymous uploads
- File type validated against MIME + magic bytes (sharp validates image structure)
- Generated filenames prevent path traversal (no user-supplied paths)
- Size limit prevents DoS
- No executable files accepted (image/* only)
