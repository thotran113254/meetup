# Codebase Summary — Meetup Travel

**Last Updated:** March 27, 2026
**Project:** Meetup Travel Landing + Admin Platform
**Stack:** Next.js 16, React 19, Tailwind CSS v4, PostgreSQL + Drizzle ORM

---

## Project Overview

Meetup Travel is a Next.js landing page and admin dashboard for a Vietnam-based travel agency. The project features a pixel-perfect homepage implementation based on Figma design, complete with:

- Multi-section responsive homepage (mobile 375px → desktop 1600px)
- Travel tour package catalog with carousel
- Service offerings (airport pickup, eVisa, eSIM, fast track)
- eTickets flight search form
- Reviews section with Tripadvisor integration
- Experience highlights (North, Mid, South Vietnam)
- YouTube channel video grid
- About section with clothesline photo gallery
- Newsletter subscription with popup feedback
- Admin dashboard for managing posts, contacts, and site settings
- RESTful API for AI agents to manage content

---

## Directory Structure

### `/src/app/` — Next.js App Router Pages

```
app/
├── page.tsx                    # Homepage (root path /)
├── layout.tsx                  # Root layout with header/footer
├── globals.css                 # Global CSS variables + utilities
├── loading.tsx                 # Fallback loading state
├── not-found.tsx              # 404 page
├── (public pages)/
│   ├── about/page.tsx          # About page
│   ├── services/page.tsx       # Services listing page
│   ├── blog/page.tsx           # Blog listing page
│   ├── blog/[slug]/page.tsx    # Blog post detail (dynamic)
│   └── contact/page.tsx        # Contact form page
├── admin/
│   ├── layout.tsx              # Admin layout (no header/footer)
│   ├── page.tsx                # Admin dashboard home
│   ├── contacts/page.tsx       # View contact submissions
│   ├── posts/page.tsx          # Manage blog posts
│   ├── posts/new/page.tsx      # Create new blog post
│   └── settings/page.tsx       # Site settings (API keys, theme)
└── api/
    ├── posts/[slug]/route.ts   # GET/PUT/DELETE individual post
    ├── posts/route.ts          # GET (list) / POST (create) posts
    ├── contacts/[id]/route.ts  # PUT (toggle read) / DELETE submission
    ├── contacts/route.ts       # GET (list) / POST (submit) contacts
    ├── settings/route.ts       # GET / PUT site settings
    └── seo/audit/route.ts      # POST SEO analysis endpoint
```

### `/src/components/` — React Components

#### Layout Components (`components/layout/`)
- **site-header.tsx** — Fixed header with logo, nav, currency switcher, wishlist icon, mobile menu toggle
- **site-footer.tsx** — Teal gradient footer with company links, contact info, social links
- **floating-social.tsx** — Fixed floating social media buttons (WhatsApp, FB, IG)
- **mobile-menu.tsx** — Mobile mega menu (nav, currency switcher, language)

#### Homepage Sections (`components/sections/homepage/`)
- **hero-section.tsx** — Full-width hero banner with background image (1400x524px desktop)
- **tour-package-section.tsx** — Carousel of tour cards (338x516px) with style/duration filters
- **reviews-section.tsx** — Tripadvisor reviews grid with star ratings
- **experience-section.tsx** — Three region cards (portrait) + 6-item grid (338x338px) each
  - North Vietnam, Mid Vietnam, South Vietnam (separate components in same file)
- **services-section.tsx** — Service carousel (airport, eVisa, eSIM, fast track)
- **etickets-section.tsx** — Flight search form with date/passenger selectors
- **youtube-section.tsx** — Video grid in staggered smiley curve layout
- **about-section.tsx** — Mission + team info + clothesline photo gallery
- **newsletter-section.tsx** — Email subscription input + submit button

#### UI Components (`components/ui/`)
- **tour-card.tsx** — Reusable card for tours (image, title, rating, price)
- **currency-switcher.tsx** — Dropdown to select currency (USD/VND/etc)
- **filter-dropdown.tsx** — Reusable filter dropdown (style, duration filters)
- **subscribe-popup.tsx** — Success/fail/unsubscribe modal dialogs
- **wishlist-drawer.tsx** — Slide-out drawer for wishlist items
- **button.tsx** — Base button component (Radix + CVA styled)
- **accordion.tsx** — Radix accordion (FAQ section)
- **magic-card.tsx** — Animated card with gradient effects
- **animated-gradient-text.tsx** — Text with gradient animation
- **particles-background.tsx** — Particle animation background
- **bento-grid.tsx** — Grid layout for cards
- **number-ticker.tsx** — Animated number counter
- **form-field.tsx** — Wrapper for form inputs + labels
- **theme-toggle.tsx** — Dark/light mode switcher

#### Other Components
- **components/admin/admin-sidebar.tsx** — Admin dashboard navigation sidebar
- **components/forms/contact-form.tsx** — Contact page form (name, email, message)
- **components/providers/theme-provider.tsx** — Dark mode provider wrapper
- **components/seo/** — JSON-LD schema generators + breadcrumb trails

### `/src/config/` — Configuration

- **site-config.ts** — Single source of truth for:
  - Site name, description, tagline
  - Contact info (email, phone, address)
  - Social links (Instagram, Facebook, TikTok, YouTube, WhatsApp)
  - Navigation menu structure (main + footer)
  - SEO defaults (title template, locale, OG image)
  - Theme colors (primary teal #2CBCB3, accents)

### `/src/db/` — Database Layer

- **schema.ts** — Drizzle ORM table definitions:
  - `posts` (blog articles)
  - `contactSubmissions` (contact form submissions)
  - `siteSettings` (key-value configuration store)
- **connection.ts** — Lazy singleton DB connection (`getDb()`)
- **queries/** — Reusable query functions for CRUD operations

### `/src/lib/` — Utilities

- **api-auth.ts** — `checkApiAccess()` function: combines rate limiting + Bearer token auth
- **rate-limiter.ts** — In-memory IP-based rate limiter (configurable limits)
- **seo-utils.ts** — `generatePageMetadata()` for per-page metadata + JSON-LD schema builders
- **utils.ts** — `cn()` utility for Tailwind class merging
- **blog-data.ts** — Static fallback blog data (when DB unavailable)
- **validations/** — Zod schemas (shared client ↔ server validation)

### `/public/` — Static Assets

```
public/images/
├── hero-banner.png, hero-full.png, hero-collage.png, hero-team-burst.png, hero-landmarks.png
├── tour-*.png (4 tour images)
├── exp-north-*.png, exp-mid-*.png, exp-south-*.png (6 each region)
├── service-*.png (airport-pickup, esim, evisa, fast-track)
├── yt-*.png (5 YouTube video thumbnails)
└── og-default.png (Open Graph default image)
```

---

## New Components Created (Phase 6)

### 1. Mobile Menu — `src/components/layout/mobile-menu.tsx`
- Responsive mobile navigation mega menu
- Shows/hides on mobile menu button click
- Includes currency switcher inside mobile context
- Closes on link click or overlay click

### 2. Subscribe Popup — `src/components/ui/subscribe-popup.tsx`
- Dialog modal for newsletter subscription feedback
- States: success, failure, unsubscribe
- Animated entrance/exit transitions
- Close button + optional redirect

### 3. Wishlist Drawer — `src/components/ui/wishlist-drawer.tsx`
- Slide-out drawer from header wishlist icon
- Shows saved tour packages
- Add/remove items with visual feedback
- Persists to localStorage (browser storage)

### 4. Currency Switcher — `src/components/ui/currency-switcher.tsx`
- Dropdown selector for currency (USD, VND, etc)
- Updates prices across page
- Stored in localStorage for persistence
- Accessible from header + mobile menu

### 5. Filter Dropdown — `src/components/ui/filter-dropdown.tsx`
- Reusable dropdown for tour filters (style, duration)
- Checkbox multi-select UI
- Applies filters to tour carousel
- Mobile-responsive dropdown positioning

---

## Design Tokens & Theme System

### Color Palette
```css
/* Primary color (brand teal) */
--color-primary: #2CBCB3          /* Light mode */
--color-primary-dark: #239A93     /* Darker variant */
--color-accent: #E87C3E           /* Orange accent */

/* Semantic colors */
--color-background: #ffffff       /* Page background */
--color-foreground: #0a0a0a       /* Text color */
--color-secondary: #f0fdfb        /* Light secondary */
--color-muted: #f1f5f9            /* Disabled/placeholder text *)
--color-border: #e5e7eb           /* Border color *)
```

### Layout Specs
| Property | Desktop | Mobile |
|----------|---------|--------|
| Max width | 1400px | Full width |
| Side padding | 100px | 16px |
| Hero height | 524px | ~300px |
| Card size (tour) | 338×516px | Full width |
| Card size (experience) | 338×338px | Full width |
| Border radius | 12–16px | 12–16px |

### Spacing & Typography
- **Section padding:** `py-16 md:py-24 lg:py-32` (via `.section-padding` utility)
- **Container utilities:** `.container-narrow` (max-w-4xl), `.container-wide` (max-w-7xl)
- **Font:** System stack (no custom fonts) — Inter/Segoe UI
- **Footer:** Gradient teal background (#2CBCB3 to #239A93)

---

## API Endpoints (for AI Agents)

All mutation endpoints require `Authorization: Bearer <API_SECRET_KEY>` header.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| **GET** | `/api/posts?published=true&limit=10` | Yes | List blog posts (paginated) |
| **POST** | `/api/posts` | Yes | Create new blog post |
| **GET** | `/api/posts/[slug]` | No | Get single post by slug |
| **PUT** | `/api/posts/[slug]` | Yes | Update post (partial merge) |
| **DELETE** | `/api/posts/[slug]` | Yes | Delete post |
| **GET** | `/api/contacts?read=false` | Yes | List contact submissions (unread only) |
| **PUT** | `/api/contacts/[id]` | Yes | Toggle read status |
| **DELETE** | `/api/contacts/[id]` | Yes | Delete submission |
| **GET** | `/api/settings` | Yes | Get all site settings |
| **PUT** | `/api/settings` | Yes | Upsert setting by key |
| **POST** | `/api/seo/audit` | Yes | Run SEO analysis, return score |

### Authentication Pattern
```typescript
import { checkApiAccess } from '@/lib/api-auth';

export async function PUT(request: Request) {
  const { valid, error } = await checkApiAccess(request);
  if (!valid) return Response.json({ error }, { status: 401 });
  // ... handle request
}
```

---

## Key Implementation Patterns

### 1. Server Components by Default
- All components are server components unless they have interactivity (`"use client"`)
- Reduces client bundle size, improves performance
- Safe for database queries directly in components

### 2. CSS Variables for Theming
- All colors reference `var(--color-*)` variables
- Never hardcode hex colors in components
- Dark mode variants in `:root` and `.dark` selector
- Easy to rebrand by updating `globals.css`

### 3. Lazy Database Connection
```typescript
// db/connection.ts
let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!db) {
    db = drizzle(new Client({ connectionString: process.env.DATABASE_URL }));
  }
  return db;
}
```
- Only connects when needed (safe during build)
- Singleton pattern prevents connection pool exhaustion

### 4. Shared Zod Schemas
- Same validation on client forms and server API
- Reduces duplication and ensures consistency
- Located in `lib/validations/`

### 5. ISR for Dynamic Content
- `revalidatePath()` called after API mutations
- Instant cache invalidation + static regeneration
- Balances dynamic + performance

### 6. Floating Social Links
- Fixed position on page
- WhatsApp, Facebook, Instagram buttons
- Hidden on mobile (too much clutter) or visible via menu

---

## Homepage Sections Assembly

The homepage (`src/app/page.tsx`) assembles sections in this order:

1. **Hero Section** — Full-width banner with background image
2. **Tour Package Section** — Carousel with filter dropdowns
3. **Reviews Section** — Tripadvisor integration
4. **Experience Sections** — North, Mid, South regions (portrait + grid)
5. **Services Section** — Carousel (airport, eVisa, eSIM, fast track)
6. **eTickets Section** — Flight search form
7. **YouTube Section** — Video grid in staggered layout
8. **About Section** — Mission statement + photo gallery
9. **Newsletter Section** — Email subscription
10. **Footer** — Teal gradient background + links

---

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://meetuptravel.vn    # SEO canonical URLs
DATABASE_URL=postgresql://user:pass@host/db     # PostgreSQL connection
API_SECRET_KEY=your-secret-key-here             # Bearer token for API auth
ALLOWED_ORIGINS=https://meetuptravel.vn         # CORS origins (comma-separated)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX                  # Google Analytics (optional)
```

---

## Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server on port 1458 with Turbopack |
| `pnpm build` | Production build (Next.js static optimization) |
| `pnpm start` | Run production server |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm db:push` | Sync Drizzle schema to PostgreSQL |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:studio` | Open Drizzle Studio GUI |

---

## Testing Coverage

- Build verification: `pnpm build` passes with no errors
- Mobile responsiveness: Tested from 375px (mobile) to 1600px (desktop)
- All popups (subscribe, wishlist, currency, filters) functional
- All sections responsive and match Figma design pixel-perfectly

---

## Known Limitations & Todos

- Admin dashboard has no authentication yet (TODO)
- Blog system uses static fallback data when DB unavailable
- Rate limiting is in-memory (resets on server restart)
- No email validation/sending for newsletter (frontend only)
- YouTube video grid uses static thumbnail images (not embedded)

---

## File Organization Summary

| Category | Count | Location |
|----------|-------|----------|
| Layout components | 4 | `src/components/layout/` |
| Homepage sections | 9 | `src/components/sections/homepage/` |
| UI components | 18 | `src/components/ui/` |
| API routes | 6 | `src/app/api/` |
| Public pages | 5 | `src/app/` |
| Admin pages | 4 | `src/app/admin/` |
| DB schema + queries | 2 | `src/db/` |
| Utilities | 5 | `src/lib/` |
| Config | 1 | `src/config/` |

Total: **54 component/utility files** + **10 page files** + **6 API routes**

---

## Related Documentation

- `./project-overview-pdr.md` — Project requirements and scope
- `./design-guidelines.md` — Figma design tokens and component specs
- `./system-architecture.md` — Technical architecture and data flow
- `./code-standards.md` — Coding conventions and best practices
