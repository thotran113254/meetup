# Phase 5: Admin Component Integration

## Context Links
- [plan.md](plan.md) — Overview
- [phase-04-admin-upload-ui.md](phase-04-admin-upload-ui.md) — Upload UI (dependency)
- [src/components/admin/](/home/automation/meetup/src/components/admin/) — All admin components

## Overview
- **Priority**: P2
- **Status**: Pending
- **Effort**: 2h
- **Blocked by**: Phase 3, Phase 4

Replace text input "URL anh" fields across admin components with the `AdminMediaPickerDialog`. Each image field gets a thumbnail preview + "Choose from library" button instead of a raw URL text input.

## Key Insights
- 15+ admin components have image URL text inputs identified via grep for `"URL ảnh"` and `image.*inputStyles`
- Pattern is consistent: `<input className={inputStyles} placeholder="/images/..." {...register("image")} />`
- Replacement is mechanical: swap text input for a picker trigger + preview
- Keep URL input as readonly display (shows selected URL) for transparency
- Must handle both react-hook-form `register` pattern and controlled `value/onChange` pattern

## Affected Components

### Pattern A: react-hook-form `register` (Dialogs)

| Component | Field | register key |
|---|---|---|
| `admin-slide-dialog.tsx` | Slide image | `"image"` |
| `admin-homepage-tour-dialog.tsx` | Tour card image | `"image"` |
| `admin-homepage-service-dialog.tsx` | Service card image | `"image"` |
| `admin-homepage-video-dialog.tsx` | Video thumbnail | `"image"` |
| `admin-homepage-review-dialog.tsx` | Review photo | `"photo"` |
| `admin-homepage-review-dialog.tsx` | Reviewer avatar | `"avatar"` |
| `admin-post-dialog.tsx` | Cover image | `"coverImage"` |
| `admin-post-dialog.tsx` | OG image | `"ogImage"` |

### Pattern B: Controlled `value/onChange` (Tabs)

| Component | Field |
|---|---|
| `admin-tour-basic-tab.tsx` | Tour main image |
| `admin-tour-gallery-tab.tsx` | Gallery image URLs (array) |
| `admin-services-cards-tab.tsx` | Service card images (array) |
| `admin-destinations-list-tab.tsx` | Destination images (array) |
| `admin-homepage-about-tab.tsx` | About photo URLs (array) |
| `admin-tours-hero-tab.tsx` | Hero banner image |
| `admin-destinations-hero-tab.tsx` | Hero banner image |

## Architecture

### Reusable Image Field Component

Create a small wrapper that combines the picker trigger with a preview:

```typescript
// src/components/admin/admin-image-field.tsx
type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
};
```

This component renders:
1. Thumbnail preview (if value is non-empty)
2. Text input (readonly, shows current URL)
3. "Choose" button -> opens `AdminMediaPickerDialog`
4. "Clear" button -> sets value to ""

### Integration Pattern for react-hook-form

```typescript
// Before:
<input className={inputStyles} {...register("image")} />

// After:
<AdminImageField
  value={watch("image")}
  onChange={(url) => setValue("image", url)}
/>
```

### Integration Pattern for controlled components

```typescript
// Before:
<input value={item.image} onChange={(e) => update(idx, "image", e.target.value)} />

// After:
<AdminImageField
  value={item.image}
  onChange={(url) => update(idx, "image", url)}
/>
```

## Files to Create

| File | Purpose | ~Lines |
|---|---|---|
| `src/components/admin/admin-image-field.tsx` | Reusable image picker field | ~80 |

## Files to Modify

All files listed in "Affected Components" above (~15 files). Each change is small:
- Import `AdminImageField`
- Replace `<input>` with `<AdminImageField>` for image fields
- For react-hook-form: add `watch` + `setValue` calls

## Implementation Steps

1. **Create `admin-image-field.tsx`**
   - Props: `value`, `onChange`, `label?`, `placeholder?`, `className?`
   - State: `pickerOpen` boolean
   - Renders: preview thumbnail (48px square) + readonly URL input + "Chon anh" button + clear "X" button
   - Opens `AdminMediaPickerDialog` on button click
   - `onSelect` callback from picker calls `onChange(url)`

2. **Integrate into dialog components (Pattern A)** — one at a time:
   - `admin-slide-dialog.tsx`: image field
   - `admin-homepage-tour-dialog.tsx`: image field
   - `admin-homepage-service-dialog.tsx`: image field
   - `admin-homepage-video-dialog.tsx`: image field
   - `admin-homepage-review-dialog.tsx`: photo + avatar fields
   - `admin-post-dialog.tsx`: coverImage + ogImage fields

3. **Integrate into tab components (Pattern B)** — one at a time:
   - `admin-tour-basic-tab.tsx`: image field
   - `admin-tour-gallery-tab.tsx`: gallery array items
   - `admin-services-cards-tab.tsx`: card image fields
   - `admin-destinations-list-tab.tsx`: destination image fields
   - `admin-homepage-about-tab.tsx`: photo array items
   - `admin-tours-hero-tab.tsx`: hero image field
   - `admin-destinations-hero-tab.tsx`: hero image field

4. **Keep URL input as fallback** — the `AdminImageField` should still allow pasting a URL directly (editable input, not just readonly). This supports external URLs and backward compat.

## Todo List

- [ ] Create admin-image-field.tsx wrapper component
- [ ] Integrate into admin-slide-dialog.tsx
- [ ] Integrate into admin-homepage-tour-dialog.tsx
- [ ] Integrate into admin-homepage-service-dialog.tsx
- [ ] Integrate into admin-homepage-video-dialog.tsx
- [ ] Integrate into admin-homepage-review-dialog.tsx (2 fields)
- [ ] Integrate into admin-post-dialog.tsx (2 fields)
- [ ] Integrate into admin-tour-basic-tab.tsx
- [ ] Integrate into admin-tour-gallery-tab.tsx
- [ ] Integrate into admin-services-cards-tab.tsx
- [ ] Integrate into admin-destinations-list-tab.tsx
- [ ] Integrate into admin-homepage-about-tab.tsx
- [ ] Integrate into admin-tours-hero-tab.tsx
- [ ] Integrate into admin-destinations-hero-tab.tsx
- [ ] Verify all admin forms still save correctly

## Success Criteria
- Every image URL field in admin has a "Choose from library" button
- Clicking button opens media picker, selecting image populates the field
- Thumbnail preview shown next to each image field
- Direct URL paste still works (not picker-only)
- No regressions in form submission — all save actions still work
- Gallery/array fields work with multiple pickers

## Risk Assessment
- **Regression in form saving**: Low risk — we only change the input mechanism, not the data shape. Same string URL value flows to same save handlers
- **Too many files to modify at once**: Mitigate by integrating incrementally. Each component is independent. Can ship with partial integration
- **react-hook-form setValue not triggering validation**: Use `{ shouldValidate: true }` option

## Security Considerations
- No new security surface — picker returns URL strings, same as manual text input
- URLs from picker are from our own media library (trusted source)
