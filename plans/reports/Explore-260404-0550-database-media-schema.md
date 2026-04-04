# Database Schema & Settings System Exploration Report

**Date:** 2026-04-04  
**Scope:** Media data storage, database schema, admin image management, settings system

---

## Summary

The Meetup Travel platform stores media data across multiple tables with a hybrid approach:

1. **Direct text fields** storing image URLs in `posts`, `slides`, `tourPackages`
2. **Dedicated `media` library table** for centralized media management
3. **JSON columns** in `siteSettings` and `tourPackages` for flexible, nested image data
4. **Admin text input forms** (no file upload) — all images are URLs, not uploaded files

---

## Database Schema Analysis

### Tables with Image/Media Fields

#### 1. **posts** (Blog posts/articles)
- `coverImage` (text) — blog post cover image URL
- `ogImage` (text) — open graph image for SEO
- **Storage:** Raw text field, stores full URL strings
- **Admin Input:** Text input field in post form

#### 2. **slides** (Hero slides/banners)
- `image` (text, required) — slide background image URL
- **Storage:** Raw text field
- **Admin Input:** Text input field, preview shown when URL entered
- **Location:** `/admin/slides` page

#### 3. **tourPackages** (Tour listings & detail pages)
- `image` (text, required) — main listing/cover image
- `gallery` (jsonb, array of strings) — extra gallery images for detail page slideshow
- **Storage:** 
  - Main image: simple text field
  - Gallery: array of URL strings in JSON
- **Admin Input:** 
  - Main image: text input in basic tab
  - Gallery: dynamic list with add/remove buttons (text input per image)
- **Related:** `itinerary.images` (nested in JSON itinerary data)

#### 4. **media** (Centralized media library)
```
{
  id: uuid (primary key)
  url: text (required) — full URL to the media
  alt: text — alt text/description
  type: text — "image" | "video" | "document"
  filename: text (required) — human-readable file name
  size: integer — file size in bytes
  createdAt: timestamp
}
```
- **Purpose:** Centralized library for browsing/managing all media
- **Admin Interface:** `/admin/media` page with grid view, filtering by type, delete capability
- **Input Method:** Form dialog with fields: type, URL, filename, alt, size
- **No File Upload:** All media is referenced by URL (not uploaded)

#### 5. **siteSettings** (Key-value configuration store)
```
{
  key: text (primary key) — setting identifier
  value: jsonb (required) — flexible typed value (strings, arrays, objects)
  updatedAt: timestamp
}
```
- **Current Settings Keys (observed):**
  - `site_name` → string
  - `site_description` → string
  - `contact_email` → string
  - `contact_phone` → string
  - `address` → string
  - `facebook_url` → string
  - `instagram_url` → string
  - `tiktok_url` → string
  - `youtube_url` → string
  - `whatsapp_url` → string
  - `seo_default_title` → string
  - `seo_default_description` → string
  - `tours_hero` → ToursHeroContent object with `heroImage` (URL string)
  - `most_liked` → MostLikedContent object
  - `experience-north/mid/south` → ExperienceRegionData with `images: string[]`
  - `homepage_about` → AboutData with multiple image fields
  - `homepage_hero` → hero section config
  - etc.

- **Image Fields in siteSettings:**
  - `tours_hero.heroImage` (string URL)
  - `homepage_about.desktopImage` (string URL)
  - `homepage_about.teamImage` (string URL)
  - `homepage_about.dragonImage` (string URL)
  - `homepage_about.templeImage` (string URL)
  - `homepage_about.cloudImage` (string URL)
  - `homepage_about.mobilePhotos[]` — array of objects with `src: string`
  - `experience-[region].images[]` — array of URL strings per region

#### 6. **pages** (Dynamic CMS pages)
- `sections` (jsonb, array) — page sections (may contain images in structured data)
- **Not fully explored for image patterns** in this analysis

---

## Admin Image Management Patterns

### How Images Are Currently Set

#### Pattern 1: Direct Text Input (Most Common)
- **Usage:** Posts, Slides, Tour packages, Homepage sections
- **Input Type:** `<input type="text">` field
- **Validation:** URL format, not empty
- **Example:** Slides page text input for image URL
- **No Preview:** Usually show preview once URL is entered (via img tag with onError)

#### Pattern 2: Dynamic List of URLs
- **Usage:** Tour gallery images, Experience section images
- **Input Type:** Array of text inputs with add/remove buttons
- **Example:** 
  - Tour package gallery tab: multiple image URL inputs
  - Itinerary images: array of URL strings per day

#### Pattern 3: Media Library + Text Reference
- **Usage:** Media table itself
- **Input Type:** Form dialog collecting URL, filename, alt, type, size
- **Storage:** No actual file upload; fields populated manually
- **Admin Interface:** Grid view at `/admin/media` page

---

## API Endpoints

### Settings API
**Route:** `GET/PUT /api/settings`
- **GET:** Returns all settings as array
- **PUT:** Upsert a single setting (key + value)
- **Value Type:** JSONB — can be string, array, object
- **Validation:** Key required, Value required
- **Authentication:** API key validation required

---

## Image URL Storage Patterns

### Text Fields (Direct URLs)
- `posts.coverImage` → `"https://..."`
- `posts.ogImage` → `"https://..."`
- `slides.image` → `"https://..."`
- `tourPackages.image` → `"https://..."`

### JSON Arrays (Multiple URLs)
- `tourPackages.gallery` → `["https://...", "https://...", ...]`
- `siteSettings["experience-north"].images` → `["https://...", "https://...", ...]`
- `tourPackages.itinerary[].images` → `["https://...", ...]`

### JSON Objects with Image Fields
- `siteSettings["tours_hero"]` → `{ heroImage: "https://..." }`
- `siteSettings["homepage_about"]` → `{ desktopImage: "https://...", teamImage: "https://...", ... }`
- `siteSettings["homepage_about"].mobilePhotos[]` → `[{ src: "https://...", alt: "...", deg: 0, left: "0", top: "0" }, ...]`

---

## Admin Pages for Image Management

### 1. `/admin/settings` (Settings Page)
- **Component:** `src/app/admin/settings/page.tsx`
- **Current Fields:** Text inputs for contact info, social links, SEO
- **Image-Related:** No direct image settings UI currently visible
- **Method:** Uses `useAdminSettings()` hook + `upsertSetting()` action

### 2. `/admin/media` (Media Library)
- **Component:** `src/app/admin/media/page.tsx`
- **Features:**
  - Grid view of media items
  - Type filter (image, video, document)
  - Add media via dialog form
  - Delete media
  - Shows filename, size, type icon
  - Image preview in grid
- **Dialog:** `AdminMediaUploadDialog` component
- **Fields:** type, URL, filename, alt, size
- **Actions:** `fetchAdminMedia()`, `createMedia()`, `deleteMedia()`

### 3. `/admin/slides` (Slide Management)
- **Component:** `src/app/admin/slides/page.tsx`
- **Features:**
  - List view of slides
  - Thumbnail preview
  - Edit/Delete actions
  - Reorder (drag handle UI visible but not fully implemented)
- **Dialog:** `AdminSlideDialog` component
- **Image Field:** Text input for URL, preview shown
- **Actions:** `createSlide()`, `updateSlide()`, `deleteSlide()`

### 4. `/admin/posts` (Blog Post Management)
- **Component:** Not fully reviewed, but posts have coverImage field
- **Image Field:** In post form, cover image text input

### 5. `/admin/tours-list` (Tour Package Management)
- **Component:** `AdminTourEditPage` wrapper with tabs
- **Tabs Include:**
  - **Basic Tab** (`AdminTourBasicTab`) — main image field
  - **Gallery Tab** (`AdminTourGalleryTab`) — multiple image URLs
  - **Detail Tab** — other fields
  - **Itinerary Tab** (`AdminTourItineraryTab`) — per-day images

### 6. `/admin/homepage` (Homepage Sections)
- **Components:**
  - `AdminHomepageHeroTab` — hero section (image URL)
  - `AdminToursHeroTab` — tours section hero (heroImage URL)
  - `AdminDestinationsHeroTab` — destinations hero (image URL)
  - Various dialog components for services, experiences, videos, tours, etc.
- **Pattern:** Each section has image fields stored in siteSettings

---

## Key Findings: Image/Media Field Summary

### All Image/Media Storage Fields in Database

| Table | Field | Type | Example Value | Admin Page |
|-------|-------|------|----------------|-----------|
| posts | coverImage | text | "https://...jpg" | /admin/posts |
| posts | ogImage | text | "https://...png" | /admin/posts |
| slides | image | text | "https://...jpg" | /admin/slides |
| tourPackages | image | text | "https://...jpg" | /admin/tours-list |
| tourPackages | gallery | jsonb array | ["https://...", ...] | /admin/tours-list (gallery tab) |
| tourPackages | itinerary[].images | jsonb nested | ["https://...", ...] | /admin/tours-list (itinerary tab) |
| media | url | text | "https://...jpg" | /admin/media |
| media | alt | text | "Alt text description" | /admin/media |
| siteSettings | value (various keys) | jsonb | Varies by key | Various tabs in /admin/* |

---

## Admin Input Methods

### Current (No File Upload)
1. **Text Input** — paste/type full URL
   - Validation: URL format check
   - Preview: Optional image preview after entering URL
   - Examples: Slides, Posts, Tour images

2. **Text Array** — multiple text inputs with add/remove UI
   - Examples: Tour gallery, Experience images

3. **Form Dialog** — structured form with multiple fields
   - Examples: Media library add form
   - Fields: type, URL, filename, alt, size

### File Upload Not Implemented
- All current admin UI uses URL text input
- No actual file upload to server
- Media library stores references, not files

---

## Validation Schemas

### Media Schema
**File:** `src/lib/validations/media-schema.ts`
```
{
  url: string (required, min 1 char)
  alt: string (optional)
  type: "image" | "video" | "document" (default: "image")
  filename: string (required, min 1 char)
  size: number (optional, int, min 0)
}
```

### Slide Schema
**File:** `src/lib/validations/slide-schema.ts`
```
{
  title: string (required, min 1)
  subtitle: string (optional)
  image: string (required, min 1) — URL
  link: string (optional)
  sortOrder: number (optional, int, min 0, default: 0)
  active: boolean (optional, default: true)
}
```

### Post Schema
**File:** `src/lib/validations/post-schema.ts`
```
{
  coverImage: string (optional, must be valid URL if provided)
  ... (other fields)
}
```

---

## Type Definitions for Complex Image Data

### Tour-Related Types
**File:** `src/lib/types/tours-cms-types.ts`

**ItineraryDay** (per-day itinerary in tour):
- `images: string[]` — array of image URLs for that day

**TourPackage** (tour listing + detail data):
- `image: string` — main cover image
- `gallery: string[]` — additional gallery images
- `itinerary: ItineraryDay[]` — includes images per day

### Homepage-Related Types
**File:** `src/lib/types/homepage-cms-types.ts`

**AboutData**:
```
{
  mobilePhotos: Array<{
    src: string         // image URL
    alt: string
    deg: number         // rotation
    left: string        // CSS positioning
    top: string         // CSS positioning
    stringH?: number
    wide?: boolean
  }>
  desktopImage: string  // image URL
  teamImage: string     // image URL
  dragonImage: string   // image URL
  templeImage: string   // image URL
  cloudImage: string    // image URL
}
```

**ExperienceRegionData**:
```
{
  tours: ExperienceTourItem[]
  images: string[]      // array of image URLs
}
```

---

## Server Actions (How Admin Updates are Processed)

### Settings Actions
**File:** `src/app/admin/_actions/settings-actions.ts`

```typescript
fetchAdminSettings() → SettingRow[]
  - Gets all settings from DB
  
upsertSetting(key: string, value: unknown) → { data?: SettingRow; error?: string }
  - Insert or update a single setting
  - Revalidates all pages ("/", "layout")
```

### Media Actions
**File:** `src/app/admin/_actions/media-actions.ts`

```typescript
fetchAdminMedia(page, limit, type?) → { data: MediaRow[], pagination }
  - Fetches paginated media list, optionally filtered by type
  
createMedia(formData) → { data?: MediaRow; error?: string }
  - Validates against mediaSchema
  - Inserts into media table
  
deleteMedia(id) → { error?: string }
  - Soft delete or hard delete (removes row)
```

### Slide Actions
**File:** `src/app/admin/_actions/slides-actions.ts`

```typescript
fetchAdminSlides() → SlideRow[]
createSlide(formData) → { data?: SlideRow; error?: string }
updateSlide(id, formData) → { data?: SlideRow; error?: string }
deleteSlide(id) → { error?: string }
```

---

## Hooks (Client-side Data Management)

### `useAdminSettings()`
**File:** `src/hooks/use-admin-settings.ts`
- Fetches all settings on mount
- `getValue(key, fallback)` — retrieve setting value with fallback
- `saveSetting(key, value)` — upsert and update local state
- Returns: `{ settings, loading, getValue, saveSetting }`

### `useAdminMedia(initialPage, limit)`
**File:** `src/hooks/use-admin-media.ts`
- Manages media library pagination and filtering
- `filterByType(type?)` — filter by "image" | "video" | "document"
- `addMedia(data)` — create media entry
- `removeMedia(id)` — delete media entry
- Returns: `{ items, pagination, loading, typeFilter, setPage, filterByType, addMedia, removeMedia }`

---

## Configuration Files

### Site Config (Hardcoded Defaults)
**File:** `src/config/site-config.ts`
- Contains:
  - `siteConfig.url` — site URL (uses env var)
  - `siteConfig.ogImage` — default OG image → `"/images/og-default.png"` (hardcoded path)
  - Social links (URLs, not images)
  - Theme colors (not images)
  - Navigation structure (no images)
- **Note:** `ogImage` is a hardcoded asset path, not a dynamic setting

---

## Design Implications

### Current Strengths
1. **Flexible JSON storage** in siteSettings allows adding image fields without schema changes
2. **Centralized media library** table for browsing/managing assets
3. **Multiple image storage options** (text fields, arrays, nested objects)
4. **Clean separation** between content tables and configuration

### Current Limitations
1. **No file upload** — admin must manage URLs externally (CDN, static hosting)
2. **No image optimization** — stored as-is, no resizing/conversion
3. **No validation** that URLs are actually accessible
4. **Manual URL entry** — error-prone, no automatic size/dimension detection
5. **No image metadata** beyond alt text (no dimensions, format detection)
6. **No relationships** between media table and content using them (orphaned media possible)

---

## Recommendations for File Upload Implementation

If adding file upload capability:

1. **Keep URL-based storage** — import/sync uploaded files to CDN, store URLs in existing fields
2. **Extend media schema** — add `uploadedBy`, `path`, `mimeType`, `dimensions` fields if tracking uploads
3. **Add pre-signed URL endpoint** — for server-side uploads to S3/cloud storage
4. **Client validation** — check file type/size before upload
5. **Link media to content** — add foreign key relationships to prevent orphaned media
6. **Image optimization** — add service to generate thumbnails/responsive variants
7. **Settings image picker** — replace text input with media library picker dialog

---

## File Locations Reference

| Task | File Path |
|------|-----------|
| Database Schema | `/home/automation/meetup/src/db/schema.ts` |
| Settings Queries | `/home/automation/meetup/src/db/queries/settings-queries.ts` |
| Media Queries | `/home/automation/meetup/src/db/queries/media-queries.ts` |
| Slide Queries | `/home/automation/meetup/src/db/queries/slide-queries.ts` |
| Settings Admin Page | `/home/automation/meetup/src/app/admin/settings/page.tsx` |
| Media Admin Page | `/home/automation/meetup/src/app/admin/media/page.tsx` |
| Slides Admin Page | `/home/automation/meetup/src/app/admin/slides/page.tsx` |
| Media Upload Dialog | `/home/automation/meetup/src/components/admin/admin-media-upload-dialog.tsx` |
| Slide Dialog | `/home/automation/meetup/src/components/admin/admin-slide-dialog.tsx` |
| Settings Hook | `/home/automation/meetup/src/hooks/use-admin-settings.ts` |
| Media Hook | `/home/automation/meetup/src/hooks/use-admin-media.ts` |
| Media Validation | `/home/automation/meetup/src/lib/validations/media-schema.ts` |
| Slide Validation | `/home/automation/meetup/src/lib/validations/slide-schema.ts` |
| Post Validation | `/home/automation/meetup/src/lib/validations/post-schema.ts` |
| Tours Types | `/home/automation/meetup/src/lib/types/tours-cms-types.ts` |
| Homepage Types | `/home/automation/meetup/src/lib/types/homepage-cms-types.ts` |
| Site Config | `/home/automation/meetup/src/config/site-config.ts` |
| Settings Actions | `/home/automation/meetup/src/app/admin/_actions/settings-actions.ts` |
| Media Actions | `/home/automation/meetup/src/app/admin/_actions/media-actions.ts` |
| Slide Actions | `/home/automation/meetup/src/app/admin/_actions/slides-actions.ts` |
| Settings API | `/home/automation/meetup/src/app/api/settings/route.ts` |

---

**Report Complete**
