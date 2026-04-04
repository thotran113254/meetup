# Phase 6: Static Asset Migration

## Context Links
- [plan.md](plan.md) — Overview
- [phase-01-storage-abstraction.md](phase-01-storage-abstraction.md) — Storage adapter
- [phase-02-upload-api.md](phase-02-upload-api.md) — Upload + optimization
- [public/images/](/home/automation/meetup/public/images/) — Static assets to migrate

## Overview
- **Priority**: P3
- **Status**: Pending
- **Effort**: 1h
- **Blocked by**: Phase 2, Phase 3

Migrate existing `/public/images/` static files into the new media system. This is a one-time operation that copies files through the optimization pipeline and registers them in the media DB table.

## Key Insights
- 90 files totaling ~102MB in `/public/images/` (including 52MB in `destinations/` subfolder with unoptimized PNGs)
- Several destination images are massive (danang.png = 20MB, hochiminh.jpg = 13MB) — optimization will dramatically reduce size
- SVG files (icons) should be stored as-is
- Migration is additive: copies files, does NOT delete originals
- After migration, gradually update references in DB/code from `/images/x.jpg` to `/api/media/f/x.webp`
- Reference update can be done in a follow-up since old paths still work

## Migration Strategy

### Two-step approach:

**Step A: Migrate files** (script)
- Read each file from `public/images/`
- Run through optimization pipeline (sharp)
- Store via storage adapter
- Insert media DB row with both old path and new URL
- Output mapping: `{ oldPath: "/images/x.jpg", newUrl: "/api/media/f/xxx.webp" }`

**Step B: Update references** (separate task, can be deferred)
- Find all `/images/` references in `siteSettings` JSONB values
- Update to new `/api/media/f/` URLs
- Find hardcoded `/images/` paths in source code
- Update to new URLs (or leave as-is since `/public/images/` still works)

## File Inventory

| Category | Count | Total Size | After Optimization (est.) |
|---|---|---|---|
| About page images (.png) | 13 | ~4.5MB | ~1.5MB |
| Experience images (.jpg) | 14 | ~1.3MB | ~700KB |
| Destination images (.png/.jpg) | 6 | ~53MB | ~3MB (massive savings) |
| Homepage assets (.png) | ~15 | ~8MB | ~3MB |
| Tour images (.jpg/.png) | ~20 | ~25MB | ~8MB |
| SVG icons | ~8 | ~40KB | ~40KB (no change) |
| Other | ~14 | ~10MB | ~4MB |
| **Total** | **~90** | **~102MB** | **~20MB** |

Estimated 80% size reduction from optimization — critical for VPS disk and page load.

## Files to Create

| File | Purpose | ~Lines |
|---|---|---|
| `scripts/migrate-static-images.ts` | Migration script (run once) | ~100 |

## Implementation Steps

1. **Create `scripts/migrate-static-images.ts`**
   - Uses `ts-node` or `tsx` to run
   - Recursively reads `public/images/` directory
   - For each file:
     a. Read file into buffer
     b. Determine MIME type from extension
     c. Run through `optimizeImage()` from Phase 2
     d. Generate filename via same logic as upload API
     e. Store via `getStorageAdapter().put()`
     f. Insert media row: `{ url: "/api/media/f/{filename}", storagePath: filename, filename: originalName, ... }`
     g. Log: `old: /images/about-us.png -> new: /api/media/f/1712300000-abc123.webp (420KB -> 95KB)`
   - Output summary: total files, total size before/after, any failures
   - Idempotent: check if filename already exists in media table before inserting

2. **Add run script to package.json**
   ```json
   "migrate:images": "npx tsx scripts/migrate-static-images.ts"
   ```

3. **Run migration on server**
   ```bash
   pnpm migrate:images
   ```

4. **Verify**: check `data/uploads/` has all files, media library shows them

5. **Update DB references** (optional follow-up)
   - Query `siteSettings` for values containing `/images/`
   - Replace with corresponding `/api/media/f/` URLs
   - This can be a second script or done manually via admin UI

6. **Do NOT delete `/public/images/`** — keep as fallback. Remove only after confirming all references updated.

## Migration Script Pseudocode

```typescript
import { readdir, readFile, stat } from "fs/promises";
import { join, extname } from "path";
import { optimizeImage } from "../src/lib/media/image-optimizer";
import { getStorageAdapter } from "../src/lib/storage/storage-adapter";
import { getDb } from "../src/db/connection";
import { media } from "../src/db/schema";

const PUBLIC_IMAGES = "public/images";
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"];

async function migrate() {
  const adapter = getStorageAdapter();
  const db = getDb();
  const files = await walkDir(PUBLIC_IMAGES);
  let migrated = 0, skipped = 0, totalBefore = 0, totalAfter = 0;

  for (const filePath of files) {
    const ext = extname(filePath).toLowerCase();
    if (!IMAGE_EXTS.includes(ext)) { skipped++; continue; }

    const buffer = await readFile(filePath);
    const mimeType = MIME_MAP[ext];
    totalBefore += buffer.length;

    const result = await optimizeImage(buffer, mimeType);
    const filename = generateFilename(filePath, result.ext === ".webp");

    await adapter.put(filename, result.data, result.mimeType);
    totalAfter += result.data.length;

    await db.insert(media).values({
      url: `/api/media/f/${filename}`,
      filename: basename(filePath),
      storagePath: filename,
      mimeType: result.mimeType,
      type: "image",
      size: result.data.length,
      width: result.width,
      height: result.height,
      alt: basename(filePath, ext).replace(/-/g, " "),
    });

    console.log(`${filePath} -> ${filename} (${formatBytes(buffer.length)} -> ${formatBytes(result.data.length)})`);
    migrated++;
  }

  console.log(`\nDone: ${migrated} migrated, ${skipped} skipped`);
  console.log(`Size: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (${Math.round((1 - totalAfter/totalBefore) * 100)}% reduction)`);
}
```

## Todo List

- [ ] Create scripts/migrate-static-images.ts
- [ ] Add migrate:images script to package.json
- [ ] Run migration on dev environment
- [ ] Verify all files in data/uploads/ and media library
- [ ] Log size reduction results
- [ ] (Future) Update siteSettings references from /images/ to /api/media/f/
- [ ] (Future) Update hardcoded /images/ references in source

## Success Criteria
- All 90 image files processed without errors
- Each file has a corresponding media DB row
- Optimized files are significantly smaller (target: >50% reduction overall)
- `public/images/` left intact (no deletions)
- Migration script is idempotent (safe to re-run)
- Media library page shows all migrated images

## Risk Assessment
- **Script crashes mid-migration**: Idempotent design means re-run picks up where it left off
- **Sharp fails on specific image**: Catch per-file, log error, continue with next. Store original as fallback
- **Disk space during migration**: Temporarily need originals + optimized copies. ~120MB total — manageable on VPS
- **DB reference update misses some references**: Non-critical — old `/images/` paths still served by Next.js

## Security Considerations
- Migration script runs locally on server — no network exposure
- No user input involved — file list is deterministic from filesystem
- Script requires DATABASE_URL env var — same as app
