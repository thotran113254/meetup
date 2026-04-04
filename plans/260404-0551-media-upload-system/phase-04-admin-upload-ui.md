# Phase 4: Admin Upload UI Components

## Context Links
- [plan.md](plan.md) — Overview
- [phase-02-upload-api.md](phase-02-upload-api.md) — Upload API (dependency)
- [phase-03-media-proxy.md](phase-03-media-proxy.md) — Serve endpoint (dependency)
- [src/components/admin/admin-media-upload-dialog.tsx](/home/automation/meetup/src/components/admin/admin-media-upload-dialog.tsx) — Current URL-only dialog
- [src/app/admin/media/page.tsx](/home/automation/meetup/src/app/admin/media/page.tsx) — Media library page
- [src/hooks/use-admin-media.ts](/home/automation/meetup/src/hooks/use-admin-media.ts) — Media hook

## Overview
- **Priority**: P1
- **Status**: Pending
- **Effort**: 3h
- **Blocked by**: Phase 2, Phase 3

Replace the URL text input upload dialog with a real file upload component featuring drag-and-drop, preview, and progress. Add a media picker dialog that lets admin components browse and select from the media library.

## Key Insights
- Current `AdminMediaUploadDialog` takes a URL string — needs full replacement
- 47 admin component files exist; many have "URL anh" text inputs that should eventually use the picker
- UI should be Vietnamese (matching existing admin labels: "Thêm media", "Hình ảnh", etc.)
- shadcn/ui Dialog pattern already used extensively — reuse it
- Server action `uploadMediaFile(FormData)` from Phase 2 is the upload handler

## Architecture

### New Components

```
src/components/admin/
  admin-file-upload-zone.tsx     — Drag-and-drop area with preview (reusable)
  admin-media-upload-dialog.tsx  — REPLACE existing: now uses file upload zone
  admin-media-picker-dialog.tsx  — Browse media library + select for insertion
```

### Component Hierarchy

```
AdminMediaUploadDialog (for adding new uploads)
  └── AdminFileUploadZone (drag-drop + file input + preview)

AdminMediaPickerDialog (for selecting existing media in other admin forms)
  ├── Media grid (thumbnail previews from library)
  ├── Upload new button -> inline upload
  └── Select callback -> returns media URL to parent
```

### Data Flow

```
Upload Dialog:
  User drops file -> AdminFileUploadZone sets File state
  User clicks "Upload" -> calls uploadMediaFile(FormData)
  On success -> closes dialog, refreshes media list

Picker Dialog:
  Parent opens dialog (e.g., slide editor needs image)
  Picker shows media grid from useAdminMedia hook
  User clicks thumbnail -> onSelect(url) callback fired
  Parent receives URL string, sets in form field
  Optional: "Upload new" tab within picker
```

## Files to Create

| File | Purpose | ~Lines |
|---|---|---|
| `src/components/admin/admin-file-upload-zone.tsx` | Drag-drop + file input + preview | ~120 |
| `src/components/admin/admin-media-picker-dialog.tsx` | Browse + select from library | ~130 |

## Files to Modify

| File | Change |
|---|---|
| `src/components/admin/admin-media-upload-dialog.tsx` | Replace URL form with file upload zone |
| `src/hooks/use-admin-media.ts` | Add `uploadFile(formData)` method alongside existing `addMedia` |
| `src/app/admin/_actions/media-actions.ts` | Add `uploadMediaFile` server action |
| `src/app/admin/media/page.tsx` | Wire new upload dialog |

## Implementation Steps

### Step 1: Create `admin-file-upload-zone.tsx`

Reusable drag-and-drop file input with image preview.

```typescript
type Props = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;        // default: "image/*"
  maxSizeMB?: number;     // default: 10
  error?: string;
};
```

Features:
- Drag-and-drop area with dashed border
- Click to open file picker
- Image preview after selection (using `URL.createObjectURL`)
- File size validation with error display
- Remove button to clear selection
- Accept filter for file types
- Shows filename and size info

UI elements:
- Dashed border box with upload icon (lucide `Upload`)
- Text: "Keo tha file vao day hoac bam de chon" (Drag file here or click to select)
- Size hint: "Toi da 10MB. Dinh dang: JPG, PNG, WebP, SVG"
- On file selected: show preview thumbnail, filename, size
- Error state: red border + error message

### Step 2: Rewrite `admin-media-upload-dialog.tsx`

Replace form fields (URL, filename, size) with:
- `AdminFileUploadZone` for file selection
- Alt text input (keep)
- Type selector (keep, default to "image")
- Submit sends `FormData` with file + alt to server action

```typescript
const handleUpload = async () => {
  if (!file) return;
  setSaving(true);
  const fd = new FormData();
  fd.append("file", file);
  if (alt) fd.append("alt", alt);
  const result = await uploadMediaFile(fd);
  setSaving(false);
  if (!result.error) { onOpenChange(false); onUploaded?.(); }
};
```

### Step 3: Create `admin-media-picker-dialog.tsx`

Dialog for browsing and selecting media in other admin components.

```typescript
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string, alt?: string) => void;
  type?: "image" | "video" | "document";  // filter
};
```

Features:
- Grid of media thumbnails (reuse existing grid layout from media page)
- Click thumbnail to select -> fires `onSelect(url)`
- Pagination for large libraries
- Type filter tabs
- "Upload new" button that opens inline upload flow
- Search/filter by filename (future enhancement, skip for now)

### Step 4: Add upload server action

In `src/app/admin/_actions/media-actions.ts`, add:

```typescript
export async function uploadMediaFile(formData: FormData): Promise<{ data?: MediaRow; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file) return { error: "Khong co file" };
  // validate type, size
  // optimize with sharp
  // store via adapter
  // insert DB
  // return row
}
```

### Step 5: Update `use-admin-media.ts` hook

Add `uploadFile` method:
```typescript
const uploadFile = async (formData: FormData) => {
  const result = await uploadMediaFile(formData);
  if (result.data) {
    setItems((prev) => [result.data!, ...prev]);
    setPagination((p) => ({ ...p, total: p.total + 1 }));
  }
  return result;
};
```

### Step 6: Update media library page

Wire new upload dialog to use file upload instead of URL input.

## Todo List

- [ ] Create admin-file-upload-zone.tsx (drag-drop component)
- [ ] Rewrite admin-media-upload-dialog.tsx (file upload instead of URL)
- [ ] Create admin-media-picker-dialog.tsx (browse + select)
- [ ] Add uploadMediaFile server action to media-actions.ts
- [ ] Update use-admin-media.ts with uploadFile method
- [ ] Update admin media page to use new dialog
- [ ] Test drag-and-drop upload flow in browser
- [ ] Test media picker selection flow

## Success Criteria
- Drag-and-drop file onto upload zone shows preview
- Click upload zone opens file picker
- Upload sends file, shows loading, refreshes library on success
- Media picker dialog shows grid of existing uploads
- Clicking thumbnail in picker fires onSelect with media URL
- Upload validation shows error for files >10MB or wrong type
- All labels in Vietnamese consistent with existing admin UI

## Risk Assessment
- **File too large for FormData**: 10MB cap; browsers handle this fine
- **Preview memory leak**: `URL.revokeObjectURL` in cleanup effect
- **Slow upload on bad connection**: Show progress indicator; consider chunked upload for future but YAGNI for now

## Security Considerations
- File validation happens both client-side (UX) and server-side (security)
- No arbitrary file execution — images only
- Server action runs server-side — no API key exposure to browser
