# Phase 3: Media Proxy (Serve Endpoint)

## Context Links
- [plan.md](plan.md) — Overview
- [phase-01-storage-abstraction.md](phase-01-storage-abstraction.md) — Storage layer (dependency)
- [next.config.ts](/home/automation/meetup/next.config.ts) — Existing cache headers pattern

## Overview
- **Priority**: P1
- **Status**: Pending
- **Effort**: 1.5h
- **Blocked by**: Phase 1

API route that serves uploaded files from storage with aggressive cache headers. This decouples file serving from filesystem layout — when switching to R2/S3, only the adapter changes; the URL stays the same.

## Key Insights
- Next.js already sets cache headers for `/images/*` (1yr immutable) — same pattern for media
- Files are content-addressed (timestamp+hash) so immutable caching is safe
- Must stream response, not buffer entire file in memory
- Existing `next.config.ts` has a `/images/(.*)` cache rule — our route handles its own headers

## Architecture

### Serve Flow

```
GET /api/media/f/[filename]
  |
  |-- 1. Extract filename from params
  |-- 2. Validate filename format (no path traversal)
  |-- 3. storage.get(filename)
  |-- 4. If not found: 404
  |-- 5. Return file with headers:
  |       Content-Type: {mimeType}
  |       Cache-Control: public, max-age=31536000, immutable
  |       ETag: {filename} (filename IS the content hash)
```

### URL Pattern

All uploaded media served at: `/api/media/f/{filename}`

Examples:
- `/api/media/f/1712217600000-a3f2b9c1.webp`
- `/api/media/f/1712217600000-b4e9c2d3.svg`

This URL is what gets stored in `media.url` column and used in `<img src>` / `<Image src>`.

## Files to Create

| File | Purpose | ~Lines |
|---|---|---|
| `src/app/api/media/f/[filename]/route.ts` | Serve uploaded files | ~60 |

## Files to Modify

| File | Change |
|---|---|
| `next.config.ts` | Add remotePatterns or nothing (self-hosted, no remote needed). Add `/api/media/f/*` to known cached paths if desired. |

## Implementation Steps

1. **Create `src/app/api/media/f/[filename]/route.ts`**
   - `export async function GET(_request: NextRequest, { params }: RouteContext)`
   - Extract filename from `params`
   - Validate filename: must match `/^[\w.-]+$/` (no slashes, no `..`)
   - Call `getStorageAdapter().get(filename)`
   - If null: return 404 JSON
   - Return `new Response(data, { headers })` with:
     - `Content-Type`: from storage adapter response
     - `Cache-Control`: `public, max-age=31536000, immutable`
     - `Content-Length`: buffer length
     - `ETag`: `"${filename}"` (filename contains hash — acts as content fingerprint)
   - Support conditional requests: check `If-None-Match` header, return 304 if ETag matches

2. **Update `next.config.ts`** (optional enhancement)
   - Add Next.js Image `remotePatterns` is not needed since our media URLs are same-origin API routes
   - No changes needed unless we want to use `next/image` with these URLs — in which case add `images.remotePatterns` for the site's own domain or use relative paths (Next.js Image handles same-origin paths natively)

3. **No auth on serve endpoint** — images are public content. Auth is only on upload/delete.

## Response Headers

```
HTTP/1.1 200 OK
Content-Type: image/webp
Content-Length: 142857
Cache-Control: public, max-age=31536000, immutable
ETag: "1712217600000-a3f2b9c1.webp"
X-Content-Type-Options: nosniff
```

For 304 responses:
```
HTTP/1.1 304 Not Modified
ETag: "1712217600000-a3f2b9c1.webp"
Cache-Control: public, max-age=31536000, immutable
```

## Todo List

- [ ] Create serve route at src/app/api/media/f/[filename]/route.ts
- [ ] Implement filename validation (path traversal prevention)
- [ ] Add cache headers (1yr immutable)
- [ ] Add ETag + conditional 304 support
- [ ] Verify image loads in browser at /api/media/f/{filename}
- [ ] Verify Cache-Control headers in browser devtools

## Success Criteria
- `GET /api/media/f/{filename}` returns the image with correct Content-Type
- Cache-Control header set to 1yr immutable
- 304 returned on repeated request with matching ETag
- 404 returned for nonexistent files
- Path traversal attempts (e.g., `../etc/passwd`) return 400
- No auth required (public access)

## Risk Assessment
- **Path traversal**: Mitigated by strict filename regex — reject anything with `/`, `\`, `..`
- **Large file memory pressure**: For local adapter, we buffer the file. Acceptable for images <10MB. Future: switch to streaming with `fs.createReadStream` if needed
- **Missing files (DB points to deleted file)**: Return 404 gracefully; admin can re-upload

## Security Considerations
- Filename validation is the critical security gate — strict allowlist regex
- `X-Content-Type-Options: nosniff` prevents MIME sniffing attacks
- No directory listing — only exact filename matches
- Rate limiting not needed on reads (behind CDN/Nginx in production)
