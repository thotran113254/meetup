# CMS Admin System - Homepage Data Management Analysis

**Date:** 2026-04-03
**Project:** Meetup Travel
**Focus:** Homepage CMS, database schema, admin UI

---

## Executive Summary

The Meetup Travel website uses a **key-value JSON-based CMS system** stored in a PostgreSQL `siteSettings` table. Homepage sections are managed through an admin interface that stores structured data (tours, services, reviews, videos) as JSONB values in the database. This provides flexible, schema-free content management with server-side rendering fallbacks.

---

## 1. Database Schema

**File:** `/home/automation/meetup/src/db/schema.ts` (97 lines)

### Core Tables

#### `siteSettings` (Key-Value Store)
```typescript
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),           // Unique identifier
  value: jsonb("value").notNull(),         // Flexible JSON data
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

**Purpose:** Centralized key-value store for all dynamic site content, settings, and CMS data.

**Keys Used for Homepage:**
- `homepage_tours` - Array of TourCardProps
- `homepage_services` - Array of ServiceItem
- `homepage_reviews` - Array of ReviewItem
- `homepage_videos` - Array of VideoItem
- `homepage_experience` - Record<string, {tours, images}> (region-specific)
- `site_name`, `site_description`, `contact_email`, `contact_phone`, `address`
- `facebook_url`, `instagram_url`, `tiktok_url`, `youtube_url`, `whatsapp_url`
- `seo_default_title`, `seo_default_description`

#### Other Tables
- `posts` - Blog articles with metadata
- `contactSubmissions` - Form submissions
- `slides` - Hero banner slides
- `pages` - Dynamic CMS pages (currently unused on homepage)
- `media` - Media library (images, videos, documents)
- `navigation` - Site navigation menu items

---

## 2. Database Connection

**File:** `/home/automation/meetup/src/db/connection.ts` (20 lines)

- **ORM:** Drizzle ORM with PostgreSQL
- **Pattern:** Singleton DB connection (lazy initialization)
- **Connection Pool:** Max 10 connections
- **Schema:** All tables imported and typed

```typescript
const client = postgres(connectionString, { max: 10 });
return drizzle(client, { schema });
```

---

## 3. Settings Queries

**File:** `/home/automation/meetup/src/db/queries/settings-queries.ts` (28 lines)

Two main functions:

```typescript
async function getSetting<T>(key: string): Promise<T | null>
async function getSettings(keys: string[]): Promise<Record<string, unknown>>
```

- Used by **server components** to fetch CMS data
- Type-safe with TypeScript generics
- Returns null if key not found
- Used extensively in homepage sections for fallback logic

---

## 4. Homepage Structure

**File:** `/home/automation/meetup/src/app/(website)/page.tsx` (46 lines)

The homepage is a **server component** that renders 12 sections in sequence:

1. **HeroSection** - Dynamic slides from DB (fallback: static banner)
2. **TourPackageSection** - Featured tour packages with filter
3. **ReviewsSection** - Customer reviews carousel
4. **ExperienceSection** (×3) - Region-specific (North, Mid, South) tours
5. **ServicesSection** - Supplementary services carousel
6. **LatestPostsSection** - Latest 4 blog posts (or null if none)
7. **EticketsSection** - Flight search form
8. **YoutubeSection** - YouTube video grid with stagger
9. **AboutSection** - Team gallery with clothesline design
10. **NewsletterSection** - Email subscription form

All sections follow the pattern:
- **Server component wrapper** loads data from `siteSettings`
- **Client component child** handles rendering with animations
- **Fallback data** hardcoded for resilience when DB unavailable

---

## 5. Homepage Section Components

**Directory:** `/home/automation/meetup/src/components/sections/homepage/` (1,551 lines total)

| Component | Lines | Type | Data Source | Key Props |
|-----------|-------|------|-------------|-----------|
| `hero-section.tsx` | 16 | Server | `slides` table (DB) | Active slides |
| `hero-slideshow.tsx` | 156 | Client | Props | Slides array |
| `tour-package-section.tsx` | 59 | Server | `homepage_tours` setting | Tours + fallback |
| `tour-package-carousel.tsx` | 96 | Client | Props | Tours, filter dropdown |
| `reviews-section.tsx` | 66 | Server | `homepage_reviews` setting | Reviews + fallback |
| `reviews-carousel.tsx` | 150 | Client | Props | Reviews (Tripadvisor style) |
| `services-section.tsx` | 25 | Server | `homepage_services` setting | Services + fallback |
| `services-carousel.tsx` | 93 | Client | Props | Services: {id, name, price, image, slug} |
| `experience-section.tsx` | 175 | Server | `homepage_experience` setting | Region data (North/Mid/South) |
| `youtube-section.tsx` | 26 | Server | `homepage_videos` setting | Videos + fallback |
| `youtube-grid.tsx` | 118 | Client | Props | Videos: {id, label, image, url, stagger} |
| `latest-posts-section.tsx` | 101 | Server | `posts` table (published) | Up to 4 posts or null |
| `etickets-section.tsx` | 193 | Client | Local state | Flight search form |
| `about-section.tsx` | 150 | Server | Static assets | Team gallery, clothesline |
| `newsletter-section.tsx` | 127 | Client | Local state | Email subscription form |

### Data Types

**TourCardProps** (TourPackageCarousel)
```typescript
{
  image: string;
  title: string;
  price: number;
  duration: "1D" | "4D3N" | etc;
  spots: number;
  tags: string[];
  slug: string;
}
```

**ServiceItem** (ServicesCarousel)
```typescript
{
  id: number;
  name: string;
  price: string;        // e.g., "$30"
  image: string;
  slug?: string;
}
```

**ReviewItem** (ReviewsCarousel)
```typescript
{
  id: number;
  name: string;
  date: string;         // "2024-03-01"
  title: string;
  body: string;
  photo: string;
  avatar: string;
}
```

**VideoItem** (YoutubeGrid)
```typescript
{
  id: number;
  label: string;
  image: string;
  url?: string;
  stagger?: string;     // Tailwind: "mt-0", "mt-5", "mt-10"
  mobileStagger?: string;
}
```

---

## 6. Admin Homepage Management

**File:** `/home/automation/meetup/src/app/admin/homepage/page.tsx` (215 lines)

### Features
- **Tab-based UI** for 4 section types: Tours, Services, Reviews, Videos
- **CRUD operations:** Add, edit, delete items
- **Real-time counts** showing items per section
- **Image previews** in dialogs
- **Table view** with thumbnail, info, and action buttons
- **Confirmation dialogs** for deletions

### Admin Page Flow

1. **Load data** via `useAdminHomepage()` hook
2. **Display tabs** with item counts
3. **Show table** with paginated items
4. **Open dialogs** for add/edit (type-specific)
5. **Save to DB** via server action `upsertSetting()`

```typescript
const { data, loading, saving, addItem, editItem, removeItem } = useAdminHomepage();
```

### Admin Dialogs

**Files:** `/home/automation/meetup/src/components/admin/admin-homepage-*.tsx`

| Dialog | Lines | Fields |
|--------|-------|--------|
| `admin-homepage-tour-dialog.tsx` | 90 | title, image, price, duration, spots, slug, tags |
| `admin-homepage-service-dialog.tsx` | 67 | name, image, price, slug |
| `admin-homepage-review-dialog.tsx` | 75 | name, date, title, body, photo, avatar |
| `admin-homepage-video-dialog.tsx` | 70 | label, image, url, stagger (desktop), mobileStagger |

All use `react-hook-form` + Radix UI dialogs for validation and image previews.

---

## 7. Admin Homepage Hook

**File:** `/home/automation/meetup/src/hooks/use-admin-homepage.ts` (77 lines)

```typescript
export function useAdminHomepage() {
  // State
  const [data, setData] = useState<HomepageData>({...});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SectionKey | null>(null);

  // Load on mount
  useEffect(() => {
    fetchAdminSettings().then(rows => {...});
  }, []);

  // Generic save: add/edit/remove
  const saveSection = useCallback(async (section: SectionKey, items: unknown[]) => {
    await upsertSetting(SETTING_KEYS[section], items);
    setData(prev => ({ ...prev, [section]: items }));
  }, []);

  return { data, loading, saving, addItem, editItem, removeItem };
}
```

**Setting Keys Mapped:**
```typescript
const SETTING_KEYS = {
  tours: "homepage_tours",
  services: "homepage_services",
  reviews: "homepage_reviews",
  videos: "homepage_videos",
};
```

**Key Design:** Each section's array is stored as a complete JSON value in `siteSettings`. IDs are numeric and managed client-side.

---

## 8. Admin Settings Page

**File:** `/home/automation/meetup/src/app/admin/settings/page.tsx` (177 lines)

### Managed Settings

**Site Info Section**
- `site_name` - Website name
- `site_description` - Website description
- `contact_email` - Email address
- `contact_phone` - Phone number
- `address` - Physical address

**Social Links Section**
- `facebook_url`, `instagram_url`, `tiktok_url`, `youtube_url`, `whatsapp_url`

**SEO Defaults Section**
- `seo_default_title` - Default page title
- `seo_default_description` - Default meta description

All use `useAdminSettings()` hook to load/save individual settings.

---

## 9. Admin Settings Hook

**File:** `/home/automation/meetup/src/hooks/use-admin-settings.ts` (41 lines)

```typescript
export function useAdminSettings() {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all settings on mount
  useEffect(() => {
    fetchAdminSettings().then(data => { setSettings(data); setLoading(false); });
  }, []);

  // Get single setting with fallback
  const getValue = useCallback((key: string, fallback = "") => {
    const row = settings.find(s => s.key === key);
    return row ? String(row.value ?? fallback) : fallback;
  }, [settings]);

  // Save single setting
  const saveSetting = useCallback(async (key: string, value: unknown) => {
    const result = await upsertSetting(key, value);
    if (result.data) {
      setSettings(prev => {
        const exists = prev.some(s => s.key === key);
        return exists ? prev.map(s => s.key === key ? result.data! : s) : [...prev, result.data!];
      });
    }
    return result;
  }, []);

  return { settings, loading, getValue, saveSetting };
}
```

---

## 10. Settings Server Actions

**File:** `/home/automation/meetup/src/app/admin/_actions/settings-actions.ts` (23 lines)

```typescript
"use server";

export async function fetchAdminSettings(): Promise<SettingRow[]> {
  return getDb().select().from(siteSettings);
}

export async function upsertSetting(
  key: string,
  value: unknown
): Promise<{ data?: SettingRow; error?: string }> {
  const result = await getDb()
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() }
    })
    .returning();
  return { data: result[0] };
}
```

Uses **UPSERT** pattern: insert if new, update if exists.

---

## 11. Settings API Route

**File:** `/home/automation/meetup/src/app/api/settings/route.ts` (46 lines)

### GET /api/settings
Returns all settings (requires API key auth).

```typescript
export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) return unauthorizedResponse();
  const settings = await getDb().select().from(siteSettings);
  return Response.json({ settings });
}
```

### PUT /api/settings
Upsert a single setting by key.

```typescript
export async function PUT(request: NextRequest) {
  if (!validateApiKey(request)) return unauthorizedResponse();
  const body = await request.json();
  // Validates: key (required), value (required)
  const result = await getDb()
    .insert(siteSettings)
    .values({ key: body.key, value: body.value })
    .onConflictDoUpdate({...})
    .returning();
  return Response.json({ setting: result[0] });
}
```

**Auth:** API key validation via `validateApiKey()` from `/src/lib/api-auth.ts`

---

## 12. Site Configuration

**File:** `/home/automation/meetup/src/config/site-config.ts` (92 lines)

Static configuration that serves as **defaults** and is overridden by CMS settings:

```typescript
export const siteConfig = {
  name: "Meetup Travel",
  shortName: "Meetup",
  description: "Where local experts craft a journey uniquely yours",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://meetuptravel.vn",
  email: "vn.meetup.travel@gmail.com",
  phone: "+84 97 266 49 31",
  address: { street: "...", city: "...", country: "Vietnam", zip: "100000" },
  socials: {
    instagram: "https://instagram.com/meetuptravel",
    facebook: "https://facebook.com/meetuptravel",
    tiktok: "https://tiktok.com/@meetuptravel",
    youtube: "https://youtube.com/@meetuptravel",
    whatsapp: "https://wa.me/84972664931",
  },
  seo: {
    titleTemplate: "%s | Meetup Travel",
    defaultTitle: "Meetup Travel - Where Local Experts...",
    locale: "en_US",
    alternateLocales: ["vi_VN"],
  },
  navigation: {
    main: [
      { label: "Tour", href: "/tours", hasDropdown: true },
      { label: "Services", href: "/services", hasDropdown: true },
      // ...
    ],
    footer: { company: [...], about: [...], contact: {...} },
  },
};
```

---

## 13. Data Flow Architecture

### Reading Homepage Data (Server-Side)

```
User visits /
  ↓
HomePage (Server Component)
  ↓
Each Section Server Component (e.g., TourPackageSection)
  ↓
getSetting<T>("homepage_tours")
  ↓
DB Query: SELECT value FROM siteSettings WHERE key = 'homepage_tours'
  ↓
Return data OR fallback data
  ↓
Pass as Props to Client Component (TourPackageCarousel)
  ↓
Client renders carousel with animations/interactivity
```

### Writing Homepage Data (Admin)

```
Admin visits /admin/homepage
  ↓
AdminHomepagePage loads useAdminHomepage()
  ↓
useAdminHomepage fetches ALL settings
  ↓
Server Action: fetchAdminSettings()
  ↓
DB Query: SELECT * FROM siteSettings
  ↓
Map results to HomepageData object { tours: [...], services: [...], etc }
  ↓
Display in table UI
  ↓
Admin clicks "Add" → Dialog opens
  ↓
Admin submits form
  ↓
useAdminHomepage.addItem(section, formData)
  ↓
Server Action: upsertSetting("homepage_tours", [...newArray])
  ↓
DB: INSERT/UPDATE siteSettings SET value = [...], updatedAt = now
  ↓
Hook updates local state
  ↓
UI re-renders with new data
```

---

## 14. Key Design Patterns

### 1. Server Components + Client Components
- **Servers** handle DB queries, fallback logic, data loading
- **Clients** handle interactive UI, animations, form state
- **Props** pass data from server to client (one-way flow)

### 2. JSON-Based Flexibility
- No rigid schema for CMS content
- Easy to add/modify fields without migrations
- Trade-off: less type safety in DB, but mitigated by TypeScript interfaces

### 3. Fallback-First Pattern
```typescript
let data = FALLBACK_DATA;
try {
  const fromDb = await getSetting("key");
  if (fromDb && validate(fromDb)) data = fromDb;
} catch {
  // DB error: use fallback
}
return <Component data={data} />;
```

### 4. Server Actions for Admin
- Direct DB mutations from client via `"use server"` functions
- Type-safe, no API layer overhead
- Handles upsert logic elegantly

### 5. React Hook Form + Dialogs
- All admin forms use `useForm()` from react-hook-form
- Dialogs for CRUD operations (not separate pages)
- Image preview in-form for immediate feedback

---

## 15. File Organization Summary

```
/src/
├── app/
│   ├── (website)/
│   │   └── page.tsx                    # Main homepage
│   ├── admin/
│   │   ├── homepage/
│   │   │   └── page.tsx               # Homepage CMS UI
│   │   ├── settings/
│   │   │   └── page.tsx               # Global settings UI
│   │   ├── _actions/
│   │   │   └── settings-actions.ts    # Server actions
│   │   └── layout.tsx
│   ├── api/
│   │   └── settings/
│   │       └── route.ts               # REST API for settings
│   └── layout.tsx
├── components/
│   ├── admin/
│   │   ├── admin-homepage-*-dialog.tsx    # 4 CRUD dialogs
│   │   └── admin-sidebar.tsx
│   └── sections/
│       └── homepage/
│           ├── *-section.tsx              # 11 server components
│           └── *-carousel.tsx             # Client carousels
├── db/
│   ├── schema.ts                      # All table definitions
│   ├── connection.ts                  # Singleton DB connection
│   └── queries/
│       └── settings-queries.ts        # getSetting, getSettings
├── hooks/
│   ├── use-admin-homepage.ts          # Homepage CMS hook
│   └── use-admin-settings.ts          # Settings hook
└── config/
    └── site-config.ts                 # Static defaults
```

---

## 16. Key Structures & Types

### Setting Row (from DB)
```typescript
type SettingRow = {
  key: string;
  value: unknown;  // JSONB from DB
  updatedAt: Date;
};
```

### Homepage Data (in-memory)
```typescript
type HomepageData = {
  tours: TourCardProps[];
  services: ServiceItem[];
  reviews: ReviewItem[];
  videos: VideoItem[];
};
```

### Section Keys
```typescript
type SectionKey = "tours" | "services" | "reviews" | "videos";
```

---

## 17. Resilience & Error Handling

1. **DB unavailable during server render?**
   - Try/catch in each section → fall back to hardcoded data
   - Section renders anyway, user sees cached/default content

2. **API key missing on settings endpoint?**
   - `validateApiKey()` checks Authorization header
   - Returns 401 unauthorized if invalid

3. **Form validation in admin dialogs?**
   - `react-hook-form` validates required fields
   - Custom error messages in Vietnamese
   - Dialog disables submit while saving

4. **Concurrent edits?**
   - Upsert on client-side array (replace by ID)
   - Server upserts entire array atomically
   - Last edit wins

---

## 18. Summary Table

| Component | Purpose | Type | Location |
|-----------|---------|------|----------|
| `siteSettings` table | Key-value CMS store | DB table | schema.ts |
| `getSetting()` | Read single setting | Query | settings-queries.ts |
| `TourPackageSection` | Load tour data | Server | homepage/tour-package-section.tsx |
| `TourPackageCarousel` | Render carousel | Client | homepage/tour-package-carousel.tsx |
| `AdminHomepagePage` | CMS UI (4 tabs) | Client | /admin/homepage/page.tsx |
| `useAdminHomepage()` | Hook for CMS data | Hook | use-admin-homepage.ts |
| `upsertSetting()` | Save setting to DB | Server action | _actions/settings-actions.ts |
| `/api/settings` | REST API (GET/PUT) | API route | app/api/settings/route.ts |
| `AdminSettingsPage` | Global settings UI | Client | /admin/settings/page.tsx |
| `useAdminSettings()` | Hook for global settings | Hook | use-admin-settings.ts |
| `siteConfig` | Hardcoded defaults | Config | site-config.ts |

---

## 19. Unresolved Questions

1. **Media uploads:** Are images uploaded via `/admin/media` or external service? (MediaUploadDialog exists but not fully explored)
2. **Publishing workflow:** Are there draft/published states for homepage items? (Currently all items in array are live)
3. **Version history:** Are previous setting values stored, or only latest?
4. **Internationalization:** Does CMS support Vietnamese/English variants per setting?
5. **Experience section:** How are North/Mid/South region images stored? Is it a nested object in homepage_experience?
6. **Performance:** Are settings cached server-side or fetched per-request?
7. **Admin authentication:** How is admin login enforced? (Login route exists but mechanism not shown)
8. **SEO settings:** Are per-page SEO overrides stored in `pages` table or just global defaults in siteSettings?

---

## 20. Recommendations

1. **Add TypeScript validation schemas** for siteSettings values (runtime checks)
2. **Implement audit logging** for who changed what and when
3. **Add draft/publish states** for staging changes before going live
4. **Cache siteSettings in-memory** with TTL to reduce DB hits
5. **Create export/import tools** for backing up CMS data as JSON
6. **Add bulk operations** in admin (e.g., "Delete all tours and re-import")
7. **Separate concerns:** Move AdminHomepage component into smaller pieces (ItemTable, ItemRow, etc.)
8. **Document API** for third-party integrations (e.g., external tour feed)

---

**End of Report**
