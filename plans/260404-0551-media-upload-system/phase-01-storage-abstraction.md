# Phase 1: Storage Abstraction Layer

## Context Links
- [plan.md](plan.md) — Overview
- [src/db/schema.ts](/home/automation/meetup/src/db/schema.ts) — Media table schema
- [src/db/connection.ts](/home/automation/meetup/src/db/connection.ts) — DB pattern reference

## Overview
- **Priority**: P1 (blocks all other phases)
- **Status**: Pending
- **Effort**: 1.5h

Create a storage adapter interface and local filesystem implementation. This layer abstracts where files live so swapping to R2/S3 later requires only a new adapter class — no changes to upload/serve logic.

## Key Insights
- Project has no `data/` directory yet — clean slate
- VPS deployment means local filesystem is the practical first target
- The interface must be async (all cloud providers are async)
- Keep adapter stateless — just reads/writes, no caching logic

## Architecture

```
src/lib/storage/
  storage-adapter.ts      — Interface + factory
  local-storage-adapter.ts — Filesystem implementation
```

### Interface Design

```typescript
// storage-adapter.ts
export interface StorageAdapter {
  /** Write file, return storage path (relative key) */
  put(key: string, data: Buffer, contentType: string): Promise<string>;
  /** Read file, return buffer + content type */
  get(key: string): Promise<{ data: Buffer; contentType: string } | null>;
  /** Delete file */
  delete(key: string): Promise<void>;
  /** Check if file exists */
  exists(key: string): Promise<boolean>;
}

export function getStorageAdapter(): StorageAdapter { ... }
```

### Local Adapter

```typescript
// local-storage-adapter.ts
// Reads/writes to UPLOAD_DIR env var, defaulting to data/uploads/
// - put: writeFile to disk, mkdirp parent
// - get: readFile, derive contentType from extension
// - delete: unlink, swallow ENOENT
// - exists: stat check
```

## Files to Create

| File | Purpose | ~Lines |
|---|---|---|
| `src/lib/storage/storage-adapter.ts` | Interface + singleton factory | ~40 |
| `src/lib/storage/local-storage-adapter.ts` | Filesystem adapter | ~70 |

## Files to Modify

| File | Change |
|---|---|
| `.gitignore` | Add `data/` to ignore uploaded files from git |

## Implementation Steps

1. Create `src/lib/storage/storage-adapter.ts`
   - Define `StorageAdapter` interface with `put`, `get`, `delete`, `exists`
   - Export `getStorageAdapter()` factory — singleton, reads `STORAGE_TYPE` env var
   - Default (and only for now): `"local"` -> `LocalStorageAdapter`
   - Add `UPLOAD_DIR` env var support with default `data/uploads`

2. Create `src/lib/storage/local-storage-adapter.ts`
   - Implements `StorageAdapter`
   - Constructor: resolve `UPLOAD_DIR` to absolute path, create dir if missing (recursive mkdir)
   - `put(key, data, contentType)`: write to `{UPLOAD_DIR}/{key}`, create parent dirs, return key
   - `get(key)`: read file, derive MIME from extension via simple map (webp/jpg/png/svg/gif/pdf)
   - `delete(key)`: unlink, catch ENOENT silently
   - `exists(key)`: fs.stat, return boolean

3. Add `data/` to `.gitignore`

4. Add `UPLOAD_DIR` to `.env.example` with comment

## Content Type Map (in local adapter)

```typescript
const MIME_MAP: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};
```

## Todo List

- [ ] Create storage-adapter.ts with interface + factory
- [ ] Create local-storage-adapter.ts with filesystem implementation
- [ ] Add `data/` to .gitignore
- [ ] Add UPLOAD_DIR to .env.example

## Success Criteria
- `getStorageAdapter()` returns a working `LocalStorageAdapter`
- Can put/get/delete a file in `data/uploads/`
- Singleton pattern works (no recreating adapter per request)
- `data/` directory auto-created on first write

## Risk Assessment
- **File permissions on VPS**: Mitigate by using Node.js `fs.mkdir` with `recursive: true`; if permission denied, error surfaces at upload time with clear message
- **Path traversal**: Mitigate by validating key format (alphanumeric + dash + dot only)

## Security Considerations
- Keys must be validated against path traversal (`../` sequences)
- Storage directory must not be under `public/` (prevents direct access bypass)
- File content type derived from extension, not user input
