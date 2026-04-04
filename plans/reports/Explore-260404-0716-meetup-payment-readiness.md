# Meetup Travel Project - Payment System Integration Readiness

**Date:** April 4, 2026  
**Scope:** Current infrastructure analysis for adding payment processing to tour booking system

---

## 1. DATABASE SCHEMA

**Location:** `/home/automation/meetup/src/db/schema.ts`

### Existing Tables
- **posts** - blog articles (id, slug, title, content, published, etc.)
- **contactSubmissions** - contact form leads (id, name, email, phone, message, read, createdAt)
- **siteSettings** - key-value configuration store (key, value as JSONB, updatedAt)
- **slides** - hero banners (id, title, image, sortOrder, active)
- **pages** - CMS dynamic pages (id, slug, title, sections as JSONB)
- **media** - upload library (id, url, type, filename, storagePath, mimeType, folder)
- **tourPackages** - **PRIMARY FOR TOURS** (see below)
- **navigation** - menu items (id, label, href, sortOrder, parentId, active)

### Tour Packages Table Structure
```typescript
tourPackages {
  id: uuid (PK)
  slug: text (unique)
  title, description, image
  price: integer (in cents or units - need to verify)
  duration, spots, flights
  tags: jsonb (string[])
  gallery: jsonb (string[])
  category, published, sortOrder
  tripType, groupSize, tourPace, physicalRating
  places: jsonb (string[])
  itinerary: jsonb (ItineraryDay[])
  pricingOptions: jsonb (PricingGroup[]) // Multiple pricing tiers
  createdAt, updatedAt timestamps
}
```

### Key Observation
- **No bookings/orders table exists** - this needs to be created for payment integration
- Price field is `integer` (likely stored in cents for USD or smallest unit)
- Pricing is complex: multiple tiers per tour via `pricingOptions` JSONB array

---

## 2. TOUR DETAIL PAGES

**Location:** `/home/automation/meetup/src/app/(website)/tours/[slug]/page.tsx`

### Page Flow
1. Fetches tour by slug → `getTourPackageBySlug()`
2. Displays:
   - Tour image gallery (cover + extra images from `gallery` field)
   - Tour details (title, duration, spots, tags, description)
   - Itinerary section (from `itinerary` JSONB)
   - Reviews section (component, data source TBD)
   - Related tours (max 4, excluding current)
   - Newsletter signup
   - Mobile bottom bar

### Pricing Components
- **TourPricingSidebar** - displays pricing options + children policy + cancellation rules
  - Has "Contact Expert" and "Book Now" buttons (not yet linked to checkout)
  - Fallback pricing if DB record lacks options
  - Shows additional services (VIP Private tour $25/guest, Book Scooter $50)

---

## 3. CHECKOUT SYSTEM

**Location:** `/home/automation/meetup/src/app/(website)/tours/checkout/`

### Existing Checkout Components

#### TourCheckoutContent (Main orchestrator)
- **State Management:**
  - Selected date (calendar picker on desktop, date input on mobile)
  - Quantities (guests: adult/child/infant with counters)
  - Additional services (VIP, Scooter, eSim)
  - Customer info (name, email, WhatsApp, promo code, message)
  
- **Calculations:**
  - `totalUsd` = sum of (quantity × price) + sum of (service × count)
  - Converts to VND using hardcoded rate: `VND_RATE = 16500`
  - End date calculated as +3 days from selected date

#### Form Components
1. **TourCheckoutInformationForm**
   - Name (required)
   - Email (required)
   - WhatsApp number (required)
   - Promotion code (optional)
   - Messenger/notes (required, min 10 chars)

2. **TourCheckoutCalendar** - custom date picker
3. **TourCheckoutQuantitySelector** - add/remove guest counts
4. **TourCheckoutConfirmSidebar** - order summary (sticky)

### Validation Schema
**Location:** `/home/automation/meetup/src/lib/validations/checkout-schema.ts`

```typescript
checkoutFormSchema {
  name: string (2-100 chars)
  email: valid email
  whatsapp: string (min 5 chars)
  promotionCode: optional
  messenger: string (min 10-max 2000 chars)
}
```

### Current Status
- **Form validation:** ✅ Complete (Zod + react-hook-form)
- **Styling:** ✅ Complete (Tailwind, Figma-designed)
- **Form submission:** ⚠️ Currently logs to console only
  - No DB persistence
  - No payment processing
  - No email confirmation

---

## 4. API ROUTES STRUCTURE

**Location:** `/home/automation/meetup/src/app/api/`

### Existing Routes
```
api/
  admin/
    login/               [POST] - auth
    logout/              [POST] - auth
  contacts/
    route.ts             [GET] - list submissions with pagination
    [id]/route.ts        [GET/PUT/DELETE]
  media/
    route.ts             [GET/POST] - list/upload
    [id]/route.ts        [GET/DELETE]
    upload/route.ts      [POST] - file upload handler
  navigation/
    route.ts             [GET/POST]
    [id]/route.ts        [GET/PUT/DELETE]
  pages/
    route.ts             [GET/POST]
    [slug]/route.ts      [GET/PUT/DELETE]
  posts/
    route.ts             [GET/POST]
    [slug]/route.ts      [GET/PUT/DELETE]
  settings/
    route.ts             [GET/PUT]
  slides/
    route.ts             [GET/POST]
    [id]/route.ts        [GET/PUT/DELETE]
  seo/
    audit/route.ts       [POST]
```

### Pattern Observed
- All routes require API key validation: `validateApiKey(request)` from `@/lib/api-auth`
- Standard pagination: `limit`, `page`, `offset`
- Standard error handling with 401/500 responses
- Query parameters for filtering (e.g., `?read=true`)

### Missing for Payments
- ❌ `/api/bookings/` - order creation/retrieval
- ❌ `/api/payments/` - payment processing (Stripe, SePay, etc.)
- ❌ `/api/orders/` - order status/history

---

## 5. FORM PATTERNS & VALIDATION

### Contact Form Pattern (Proven)
**Location:** `/home/automation/meetup/src/components/forms/contact-form.tsx`

```typescript
// Pattern:
1. Form schema (Zod) → lib/validations/
2. Server action (with "use server") → app/*/form-action.ts
3. Client component (react-hook-form + zodResolver)
4. State: null | { success, message }
5. DB persistence via query function
6. Post-submit: optional reset()
```

### Contact Form Action
**Location:** `/home/automation/meetup/src/app/(website)/contact/contact-form-action.ts`

```typescript
"use server"
// Validates data with Zod
// Saves to DB: createContactSubmission()
// Returns { success: boolean, message: string }
```

### Checkout Form (Incomplete)
- Schema: ✅ Exists (`checkoutFormSchema`)
- Server action: ❌ Missing - currently just logs to console
- Validation: ✅ Client-side only
- DB save: ❌ Not implemented

---

## 6. SITE CONFIGURATION

**Location:** `/home/automation/meetup/src/config/site-config.ts`

```typescript
siteConfig {
  name: "Meetup Travel"
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://meetuptravel.vn"
  email: "vn.meetup.travel@gmail.com"
  phone: "+84 97 266 49 31"
  address: { street, city, country, zip }
  socials: { instagram, facebook, tiktok, youtube, whatsapp }
  seo: { titleTemplate, defaultTitle, locale, alternateLocales }
  theme: { primary: #2CBCB3 (teal), background, foreground }
  navigation: {
    main: [Tour, Services, eTickets, Destination, Blog, About Meetup]
    footer: [company links, about links, contact: whatsapp contacts + email]
  }
}
```

---

## 7. ENVIRONMENT VARIABLES

**Location:** `/home/automation/meetup/.env.example`

```bash
NEXT_PUBLIC_SITE_URL=https://yourbrand.com
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_SECRET_KEY=your-secret-api-key-here
ALLOWED_ORIGINS=https://yourbrand.com
PORT=3001
STORAGE_TYPE=local      # local | r2 | s3 | gcs
UPLOAD_DIR=data/uploads
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Missing for Payment Integration
- Payment provider API keys (Stripe, SePay, Paddle, etc.)
- Webhook signing secrets
- Environment-specific configuration (dev/staging/production)

---

## 8. TYPES & SCHEMAS

### Tour Types
**Location:** `/home/automation/meetup/src/lib/types/tours-cms-types.ts`

```typescript
TourPackage {
  id: string
  slug: string (unique)
  title: string
  price: number              // in cents
  duration: string           // e.g. "3 Days 2 Nights"
  spots: number              // available spots
  tags: string[]
  flights: number
  description: string
  category: string
  published: boolean
  sortOrder: number
  gallery: string[]
  groupSize: string          // e.g. "Min 2 - Max 24"
  tripType: string           // e.g. "Group Tours"
  rangeLabel: string         // e.g. "Signature Journeys"
  tourPace: string           // e.g. "Medium"
  physicalRating: 1-5
  places: string[]
  itinerary: ItineraryDay[]
  pricingOptions: PricingGroup[]
  createdAt, updatedAt
}

ItineraryDay {
  title: string
  details: string[]
  images: string[]
  accommodation: string
  meals: string
  included: string[]
  excluded: string[]
}

PricingGroup {
  title: string             // e.g. "Group tour:" | "Private tour:"
  rows: { label, price }[]  // e.g. [{label: "4-Star", price: "From $1800"}]
}
```

### Checkout Types
```typescript
CheckoutFormData {
  name: string
  email: string
  whatsapp: string
  promotionCode?: string
  messenger: string
}

QuantityItem {
  label: string     // "Adult", "Child", "Infant"
  price: number
  count: number
}

ServiceItem {
  label: string
  price: number
  count: number
  description: string
}
```

### Type Files List
- `homepage-cms-types.ts` - Hero, About, Featured sections
- `about-cms-types.ts` - About page CMS fields
- `services-cms-types.ts` - Services page config
- `contact-cms-types.ts` - Contact page layout
- `recruitment-cms-types.ts` - Recruitment page
- `destinations-cms-types.ts` - Destination cards
- `tours-cms-types.ts` - Tour packages + itinerary/pricing

---

## 9. CONSTANTS & HELPERS

**Location:** `/home/automation/meetup/src/lib/constants/`

- `homepage-section-defaults.ts` - Default section configs

**Location:** `/home/automation/meetup/src/lib/helpers/`
- Various utility functions (TBD - explore if needed)

---

## 10. VALIDATION SCHEMAS

**Location:** `/home/automation/meetup/src/lib/validations/`

- ✅ `contact-schema.ts` - Contact form validation
- ✅ `checkout-schema.ts` - Checkout form validation (partial)
- `slide-schema.ts` - Slide management
- `media-schema.ts` - Media upload
- `navigation-schema.ts` - Navigation items
- `page-schema.ts` - CMS pages
- `post-schema.ts` - Blog posts

---

## 11. DEPENDENCIES & TECH STACK

**Location:** `/home/automation/meetup/package.json`

### Core
- **Next.js** 16.1.6 (App Router)
- **React** 19.1.0
- **TypeScript** 5.9.0

### Database & ORM
- **Drizzle ORM** 0.45.1 (PostgreSQL)
- **postgres** 3.4.8 (native driver)
- **drizzle-kit** 0.31.9 (migrations)

### Forms & Validation
- **react-hook-form** 7.71.2
- **zod** 4.3.6
- **@hookform/resolvers** 5.2.2

### UI & Components
- **Radix UI** 1.4.3 + individual packages
- **Tailwind CSS** 4.2.0
- **Tailwind Merge** 3.5.0
- **Class Variance Authority** 0.7.1
- **Framer Motion** 12.35.0 (animations)
- **Lucide React** 0.577.0 (icons)

### Utilities
- **date-fns** 4.1.0
- **react-markdown** 10.1.0
- **sharp** 0.34.5 (image optimization)
- **clsx** 2.1.1
- **next-themes** 0.4.6

### Missing for Payments
- No Stripe, SePay, Paddle, or payment SDK
- No email/notification service (Resend, SendGrid, etc.)
- No webhook handling (will need custom setup)

---

## 12. DATABASE QUERIES

**Location:** `/home/automation/meetup/src/db/queries/`

### Implemented Queries
- `contact-queries.ts` - Create/read contact submissions
- `media-queries.ts` - Media CRUD operations
- `navigation-queries.ts` - Navigation CRUD
- `page-queries.ts` - Pages CRUD
- `post-queries.ts` - Blog posts CRUD
- `settings-queries.ts` - Site settings get/set
- `slide-queries.ts` - Slides CRUD
- `tour-packages-queries.ts` - **Tours CRUD** (getAllTourPackages, getPublishedTourPackages, getTourPackageBySlug, getTourPackagesBySlugs, create, update, delete)

### Missing Query Functions
- ❌ Booking/Order CRUD operations
- ❌ Payment record queries
- ❌ Promotion code validation

---

## 13. INFRASTRUCTURE & UTILITIES

### Authentication Pattern
**Location:** `/home/automation/meetup/src/lib/api-auth.ts`

```typescript
validateApiKey(request)     // Checks Authorization: Bearer header
checkApiAccess(request)     // Auth + rate limit combined
unauthorizedResponse()      // 401 JSON
```

### Rate Limiting
**Location:** `/home/automation/meetup/src/lib/rate-limiter.ts`
- Per-IP rate limiting (TBD - implementation detail)

### Database Connection
**Location:** `/home/automation/meetup/src/db/connection.ts`

```typescript
// Lazy initialization pattern - prevents connection during build
function getDb(): Drizzle instance
// Singleton - reused across requests
```

### Media/Storage
**Location:** `/home/automation/meetup/src/lib/media/` & `/home/automation/meetup/src/lib/storage/`
- Upload handling system (supports local, R2, S3, GCS)
- Image optimization via Sharp

### SEO Utils
**Location:** `/home/automation/meetup/src/lib/seo-utils.ts`
- `generatePageMetadata()` - Standard metadata
- `buildOrganizationJsonLd()` - Schema markup
- `buildBreadcrumbJsonLd()` - Breadcrumb schema

---

## KEY FINDINGS FOR PAYMENT INTEGRATION

### ✅ What's Already in Place
1. **Solid foundation:** Drizzle ORM, Zod validation, react-hook-form
2. **Proven patterns:** Contact form → server action → DB (reusable)
3. **Existing checkout UI:** Fully styled, date/quantity selection complete
4. **API infrastructure:** Auth validation, rate limiting, standardized routes
5. **Form validation:** Checkout schema defined
6. **Tour data structure:** Prices, options, tiers in place
7. **Type safety:** Full TypeScript with strict types

### ❌ What's Missing
1. **Bookings table:** No DB schema for storing orders
2. **Payment provider:** No Stripe/SePay/etc integration
3. **Checkout server action:** Form doesn't persist or process payments
4. **Order confirmation:** No email/SMS workflow
5. **Payment webhooks:** No webhook handler infrastructure
6. **Promotion codes:** Schema defined but no validation logic
7. **Payment status tracking:** No DB fields for transaction status
8. **Refund/cancellation:** No business logic for refunds

### 🎯 Recommended Next Steps
1. **Create bookings table** with fields: id, tourId, customerId, quantity, price, status, paymentIntentId, createdAt
2. **Implement checkout server action** that saves booking + calls payment provider
3. **Add payment provider** (Stripe suggested for scalability, SePay for Vietnam-specific)
4. **Create booking queries** (create, getById, updateStatus, listByCustomer)
5. **Add API routes**: `/api/bookings/`, `/api/payments/`, `/api/webhooks/payment`
6. **Implement email confirmation** via Resend or similar
7. **Add promotion code validation** (create table + query function)

---

## PROJECT STRUCTURE SUMMARY

```
src/
├── app/
│   ├── (website)/              # Public pages
│   │   ├── tours/
│   │   │   ├── [slug]/page.tsx # Tour detail
│   │   │   └── checkout/page.tsx # Checkout (needs payment link)
│   │   ├── contact/            # Contact form
│   │   └── ...
│   ├── admin/                  # CMS admin
│   ├── api/                    # REST API routes
│   └── media/                  # Media server
├── components/
│   ├── forms/                  # Reusable form components
│   ├── sections/
│   │   ├── tour-checkout/      # Checkout components (needs action)
│   │   └── ...
│   └── ui/                     # Radix + Tailwind primitives
├── db/
│   ├── schema.ts               # Drizzle ORM schema
│   ├── connection.ts           # DB instance
│   └── queries/                # Query functions
├── lib/
│   ├── types/                  # TypeScript interfaces
│   ├── validations/            # Zod schemas
│   ├── constants/              # Config constants
│   └── helpers/                # Utility functions
└── config/
    └── site-config.ts          # Global configuration
```

---

## ENVIRONMENT & DEPLOYMENT

- **Dev:** `npm run dev --turbopack --port 1458`
- **Build:** `npm run build`
- **Database:** PostgreSQL via Drizzle
- **ORM Commands:** `npm run db:push`, `npm run db:generate`, `npm run db:studio`

---

## FINAL NOTES

This is a **well-structured Next.js project** with:
- ✅ Professional folder organization
- ✅ Type-safe architecture (TypeScript + Zod)
- ✅ Proven form/validation patterns
- ✅ Database layer ready for extension
- ✅ API infrastructure scalable for payments
- ⚠️ **Checkout system built but not connected to payment processing**

The **checkout page is 90% complete** — it just needs:
1. A server action to save bookings
2. A payment provider integration
3. Order confirmation workflow

**Estimated effort:** 2-3 days to add Stripe + basic webhook handling, following the existing patterns.

