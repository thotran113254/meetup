# Media/Images Handling in Meetup Codebase

## 1. Image Reference Patterns

### URL-Based Image Storage
The codebase uses **URL strings** to reference images throughout. No file upload functionality exists yet — all images are referenced by external URLs.

**Key Patterns:**
- **Posts**: `coverImage` field stores image URL (string)
- **Tours**: `image` field for cover image, `gallery` array for additional images (string[])
- **Slides**: `image` field stores URL
- **Generic Media Library**: `url` field in media table
- **Homepage Sections**: Individual `heroImage`, `desktopImage`, `teamImage`, etc. fields with URLs

### Common Naming Conventions
- `image` — primary/cover image field
- `coverImage` — blog post cover images
- `ogImage` — Open Graph SEO images
- `heroImage` — hero section banner images
- `gallery` — array of image URLs for detail pages
- `photos` / `mobilePhotos` — special positioned images (rotation, offset, height)

---

## 2. Existing Upload/File Handling

### Media Library System
**Location**: `/src/app/admin/media/page.tsx`

A **dedicated media library** exists with CRUD operations:
- **Database table**: `media` table in schema.ts
- **Fields**:
  - `id` (UUID)
  - `url` (string, required)
  - `alt` (string, nullable)
  - `type` ("image" | "video" | "document")
  - `filename` (string)
  - `size` (integer, bytes, nullable)
  - `createdAt` (timestamp)

### Media API Routes
**Location**: `/src/app/api/media/`

- **GET `/api/media`** — List media with pagination & type filtering
  - Query params: `limit`, `page`, `type`
  - Returns: `{ data: MediaRow[], pagination: { total, page, limit, totalPages } }`

- **POST `/api/media`** — Create media (auth required)
  - Body: `{ url, alt?, type, filename, size? }`
  - Validates via `mediaSchema`

- **GET `/api/media/[id]`** — Fetch single media item

- **DELETE `/api/media/[id]`** — Delete media (auth required)

### Server Actions
**Location**: `/src/app/admin/_actions/media-actions.ts`

- `fetchAdminMedia(page, limit, type?)` — Server-side media list with filtering
- `createMedia(formData)` — Insert media record
- `deleteMedia(id)` — Delete media record

**Important**: NO file upload handler exists. Media must be added via external upload (upload to CDN/S3 first, then register URL in the media library).

---

## 3. Admin Panel Image Handling

### Admin Components with Image Inputs

#### 1. **AdminMediaUploadDialog** (`admin-media-upload-dialog.tsx`)
   - **Purpose**: Register new media (not upload files)
   - **Fields**:
     - Type selector: image | video | document
     - URL input (required) — user provides full URL
     - Filename (required)
     - Alt text (optional)
     - Size in bytes (optional)
   - **Preview**: Shows image preview for image type
   - **Schema**: `mediaSchema` (zod validation)

#### 2. **AdminSlideDialog** (`admin-slide-dialog.tsx`)
   - **Fields**: title, subtitle, **image URL**, link, sortOrder, active
   - **Preview**: Shows image preview when URL provided
   - **Usage**: Hero slides management

#### 3. **AdminTourBasicTab** (`admin-tour-basic-tab.tsx`)
   - **Fields**: 
     - `image` — tour cover image URL
     - No preview shown
   - **Placeholder**: `/images/tour-1.jpg`

#### 4. **AdminTourGalleryTab** (`admin-tour-gallery-tab.tsx`)
   - **Purpose**: Manage additional gallery images for tour detail page
   - **Fields**: Array of image URL strings
   - **Add/Remove buttons** for managing gallery items
   - **Placeholder**: `/images/tour-gallery-1.jpg`

#### 5. **AdminTourItenraryTab** (`admin-tour-itinerary-tab.tsx`)
   - **Purpose**: Manage per-day images in itinerary
   - **Fields**: `images` array in each ItineraryDay
   - **Add/Remove per-day image URLs**

#### 6. **AdminPostDialog** (`admin-post-dialog.tsx`)
   - **Fields**:
     - `coverImage` — Optional URL field
     - Markdown content with `![alt](url)` for inline images
   - **Placeholder**: `/images/... hoặc https://...`
   - **Markdown syntax**: Users write `![alt text](image_url)` directly in content

#### 7. **AdminHomepageAboutTab** (`admin-homepage-about-tab.tsx`)
   - **Desktop/Large Images**: `desktopImage`, `teamImage`, `dragonImage`, `templeImage`, `cloudImage`
   - **Mobile Photos Array** (with positioning): 
     - `src` (URL)
     - `alt` text
     - `deg` (rotation angle)
     - `left` (%)
     - `top` (%)
     - `stringH` (height value)
   - **Add/Remove mobile photos dynamically**

#### 8. **AdminHomepageExperienceTab** (`admin-homepage-experience-tab.tsx`)
   - **Region sub-tabs**: North, Mid, South
   - **Tours**: List of experience tour items
   - **Images Array**: Image URLs per region
   - **Add/Remove images** for each region

#### 9. **AdminDestinationsHeroTab** (`admin-destinations-hero-tab.tsx`)
   - **Fields**: `heroImage` URL, marquee text, breadcrumb label
   - **Placeholder**: `/images/destinations/hero-banner.png`

#### 10. **AdminToursHeroTab** (`admin-tours-hero-tab.tsx`)
   - **Fields**: `heroImage` URL, marquee text, breadcrumb label
   - **Placeholder**: `/images/tours-hero-banner.jpg`

#### 11. **AdminServicesCardsTab**, **AdminServicesFeatures**, etc.
   - Similar patterns: image URLs in card/feature items
   - No dedicated upload, just URL fields

### Pattern: All URL-based, Manual Entry
**Key Insight**: Admin panels only accept **external image URLs**. There is **no file upload handler** (no multipart/form-data processing, no AWS S3 integration).

---

## 4. Public Directory Structure

### `/public/images/`
**Total size**: ~51.8 MB across 80+ static assets

**Categories:**
- **Hero images**: `hero-banner.png`, `hero-collage.png`, `hero-full.png`, `hero-landmarks.png`, `hero-team-burst.png`
- **About section**: `about-clothesline-*.png` (7 files), `about-cloud.png`, `about-dragon.png`, `about-temple.png`, `about-team-photo.png`, `about-us.png`
- **Tour images**: `tour-1-floating-market.png`, `tour-2-hoi-an.png`, `tour-3-mekong.png`, `tour-4-palm-trees.png`, `tours-hero-banner.jpg`
- **Experience images**: `exp-north-*.jpg`, `exp-mid-*.jpg`, `exp-south-*.jpg` (21 regional images)
- **Service images**: `service-airport-pickup.png`, `service-customize-tour.jpg`, `service-esim.png`, `service-evisa.png`, `service-fast-track.png`, `service-hero-banner.jpg`
- **Feature SVGs**: `feature-*.svg` (4 icons)
- **Logos**: `meetup-logo-blue.svg`, `meetup-logo-white.svg`, `footer-logo-*.svg`
- **Payment icons**: `payment-*.svg` (5 payment methods)
- **Other**: `newsletter-airplane.png`, `review-avatar.jpg`, `review-photo.jpg`, `vietnam-map.png`, `tripadvisor-logo.png`, `youtube-logo.svg`, `yt-*.jpg` (5 YouTube thumbnails)
- **Subdirectory `/destinations/`**: Additional destination images

### `/public/icons/`
- `icon-192.png`, `icon-512.png` — PWA manifest icons
- `heart-filled.svg`
- `exchange.svg`

**All static assets are served directly via relative paths** like `/images/hero-banner.png`.

---

## 5. Next.js Image Configuration

**File**: `next.config.ts`

```typescript
images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    // Currently empty — no external CDN domains configured
  ],
}
```

**Current State**:
- ✅ Format optimization enabled (AVIF, WebP)
- ❌ No remote pattern domains configured
- ❌ All images are local in `/public/images/` or provided as external URLs

**Implications**:
- To use external image domains (e.g., CDN, S3), entries must be added to `remotePatterns`
- Format `{ protocol: "https", hostname: "..." }`

---

## 6. Database Schemas for Media

### `/src/db/schema.ts`

#### Posts Table
```typescript
posts {
  coverImage: text("cover_image"),     // nullable
  ogImage: text("og_image"),           // nullable
}
```

#### Slides Table
```typescript
slides {
  image: text("image").notNull(),      // required
}
```

#### Tour Packages Table
```typescript
tourPackages {
  image: text("image").notNull().default(""),
  gallery: jsonb("gallery").notNull().default([]),  // string[]
}
```

#### Media Table
```typescript
media {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  alt: text("alt"),
  type: text("type").notNull().default("image"),   // image | video | document
  filename: text("filename").notNull(),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}
```

#### Site Settings Table
```typescript
siteSettings {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),      // Generic JSON — can store image URLs
}
```

**Pattern**: `jsonb` fields (`gallery` in tour packages, `sections` in pages) store image URLs as strings or arrays.

---

## 7. API Routes for Media

### Existing Media API
- **GET `/api/media`** — List with pagination/filtering
- **POST `/api/media`** — Create media record
- **GET `/api/media/[id]`** — Fetch by ID
- **DELETE `/api/media/[id]`** — Delete record

**Note**: These are CRUD for the media library database table, not file uploads.

### Other API Routes
- **`/api/admin/`** — Admin-specific endpoints (slides, pages, posts, etc.)
- **`/api/contacts/`** — Contact form submissions
- **`/api/navigation/`** — Navigation structure
- **`/api/posts/`** — Blog posts
- **`/api/settings/`** — Site settings
- **`/api/seo/`** — SEO metadata

**No file upload API** exists in the current codebase.

---

## 8. Next.js Image Component Usage

### Import Pattern
```typescript
import Image from "next/image";
```

### Components Using `Image` Component
1. **Tour-related**:
   - `tour-image-gallery.tsx` — Gallery with `fill`, `priority`, `sizes`
   - `tour-card.tsx` — Card images with `fill`, hover scale effect
   - `tour-detail-reviews.tsx`

2. **Homepage sections**:
   - `hero-slideshow.tsx` — Hero slides with fade animation
   - `services-carousel.tsx`, `services-features-section.tsx`
   - `reviews-carousel.tsx`
   - `about-section.tsx`, `experience-section.tsx`

3. **Blog**:
   - `blog-hero-section.tsx`
   - `blog-posts-grid-section.tsx`
   - `blog-detail-article-section.tsx`

4. **Destinations**:
   - `destination-hero-section.tsx`
   - `destination-grid-section.tsx`, `destination-intro-section.tsx`

5. **UI Components**:
   - `wishlist-drawer.tsx` — Item preview images

### Patterns
- **`fill` + `object-cover`** — Full-container images (background-like)
- **`sizes` property** — Responsive image optimization
  - Example: `sizes="(max-width: 1280px) 100vw, 1280px"`
- **`priority` prop** — For above-fold images (hero, first card)
- **Placeholders** — Some use FALLBACK_IMAGES array

### Important Note
**No HTML `<img>` tags in image-heavy components** — all use Next.js `Image` component for optimization, except:
- Admin preview images (plain `<img>` with error handling)
- Media library preview (plain `<img>`)

---

## 9. Key Validation Schemas

### Media Schema
**File**: `/src/lib/validations/media-schema.ts`
```typescript
{
  url: string (required)
  alt: string (optional)
  type: "image" | "video" | "document" (default: "image")
  filename: string (required)
  size: number (optional, >= 0)
}
```

### Post Schema
**File**: `/src/lib/validations/post-schema.ts`
```typescript
{
  coverImage: string.url() (optional, must be valid URL)
  // ...other fields
}
```

### Slide Schema
**File**: `/src/lib/validations/slide-schema.ts`
```typescript
{
  image: string (required, URL)
  // ...other fields
}
```

---

## 10. Image URL Patterns Across Admin

### Recommended URL Patterns in Admin Fields
- `/images/...` — Local static image (relative path)
- `https://...` — External CDN/URL
- `s3://...` — Future S3 integration (not yet configured)

### Where Placeholders Show Expected Patterns
- Tour: `/images/tour-1.jpg`
- Blog: `/images/... hoặc https://...`
- Destinations: `/images/destinations/hero-banner.png`
- Tours page: `/images/tours-hero-banner.jpg`
- About: `/images/...`
- Experience: `/images/experience/...`

---

## Summary: Current State vs. Future Upload

### Current ✅
- **URL-based references** throughout
- **Media library database** with CRUD API
- **Admin UI** for registering/managing media metadata
- **Next.js Image optimization** for performance
- **Static assets** in `/public/images/`
- **No remote CDN** configured yet

### Missing ❌
- **File upload handler** (multipart/form-data endpoint)
- **Cloud storage integration** (S3, Cloudinary, etc.)
- **File processing** (validation, compression, resizing)
- **Upload progress tracking**
- **Direct file association** with DB records
- **Image serving from uploads** (separate URL scheme needed)

### To Add Upload Functionality
1. Choose cloud storage (S3, Cloudinary, DigitalOcean Spaces, etc.)
2. Create `/api/upload` route with multipart handler
3. Validate file type/size
4. Upload to storage provider
5. Get back URL
6. Create media library record with returned URL
7. Configure `remotePatterns` in next.config.ts for new CDN domain

---

**Report Generated**: 2026-04-04
