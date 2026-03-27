# Project Structure Exploration Report

## Existing Section Components

Located in `/src/components/sections/`:

1. **hero-section.tsx** - Landing page hero with CTA
2. **features-section.tsx** - Feature showcase section
3. **cta-section.tsx** - Call-to-action section
4. **pricing-section.tsx** - Pricing table/cards
5. **stats-section.tsx** - Statistics/metrics display
6. **testimonials-section.tsx** - Customer testimonials carousel
7. **faq-section.tsx** - Frequently asked questions accordion

**Structure**: Each component is self-contained, following pattern of reusable, composable sections.

---

## Pages/Routes

Located in `/src/app/`:

- **Home**: `page.tsx` (root)
- **About**: `about/page.tsx`
- **Blog**: 
  - `blog/page.tsx` (listing)
  - `blog/[slug]/page.tsx` (detail view)
- **Services**: `services/page.tsx`
- **Contact**: `contact/page.tsx` + `contact/contact-form-action.ts`
- **Admin Dashboard**: 
  - `admin/page.tsx` (dashboard home)
  - `admin/contacts/page.tsx` (contact submissions)
  - `admin/posts/page.tsx` (blog posts management)
  - `admin/posts/new/page.tsx` (create new post)
  - `admin/settings/page.tsx` (settings)
  - `admin/layout.tsx` (admin wrapper)
- **API Routes**:
  - `/api/posts` (GET, POST)
  - `/api/posts/[slug]` (GET, PUT, DELETE)
  - `/api/contacts` (GET, POST)
  - `/api/contacts/[id]` (GET, PUT, DELETE)
  - `/api/settings` (GET, POST)
  - `/api/seo/audit` (GET - SEO analysis)
- **Utilities**:
  - `llms.txt/route.ts` - LLM-friendly content
  - `llms-full.txt/route.ts` - Full LLM export
  - `robots.ts`
  - `sitemap.ts`
  - `manifest.ts`
  - `not-found.tsx`
  - `loading.tsx`

---

## Header/Footer Layout

### Site Header (`site-header.tsx`)
- **Fixed Navigation**: Sticky header with z-50, backdrop blur effect
- **Logo**: Brand name with shortName highlighted in primary color
- **Desktop Nav**: Links from `siteConfig.navigation.main` (hidden < md)
- **Mobile Menu**: Hamburger toggle with sliding drawer (max-h-80 animation)
- **CTA Button**: "Lien he" (Contact) link
- **Theme Toggle**: Dark/light mode switcher
- **Responsive**: Desktop nav hidden on mobile, drawer on mobile < md breakpoint

### Site Footer (`site-footer.tsx`)
- **4-Column Grid**: Brand, Company, Services, Contact info
- **Brand Column**:
  - Logo with colored shortName
  - Site description
  - Social icons (Twitter, Facebook, LinkedIn, GitHub, YouTube)
- **Navigation Columns**:
  - Company links (from `siteConfig.navigation.footer.company`)
  - Services links (from `siteConfig.navigation.footer.services`)
  - Contact info (email, phone, address)
- **Bottom Bar**: Copyright + legal links (from `siteConfig.navigation.footer.legal`)
- **Responsive**: 1 col (mobile) → 2 cols (sm) → 4 cols (lg)

---

## Theme Colors (CSS Variables)

**Light Mode** (`:root`):
- **Primary**: `#6366f1` (Indigo-500) - brand color
- **Primary Foreground**: `#ffffff` (white)
- **Secondary**: `#f1f5f9` (Slate-100)
- **Secondary Foreground**: `#0f172a` (Slate-900)
- **Accent**: `#e0e7ff` (Indigo-100)
- **Accent Foreground**: `#3730a3` (Indigo-900)
- **Background**: `#ffffff` (white)
- **Foreground**: `#0a0a0a` (black)
- **Muted**: `#f1f5f9` (Slate-100)
- **Muted Foreground**: `#64748b` (Slate-500)
- **Border**: `#e2e8f0` (Slate-200)
- **Ring**: `#6366f1` (Indigo-500)
- **Card**: `#ffffff`
- **Card Foreground**: `#0a0a0a`
- **Destructive**: `#ef4444` (red-500)
- **Destructive Foreground**: `#ffffff`
- **Radius**: `0.625rem` (10px)

**Dark Mode** (`.dark`):
- **Primary**: `#818cf8` (Indigo-400)
- **Background**: `#0a0a0a` (black)
- **Card**: `#111111` (darker)
- All other colors inverted for dark theme

---

## Available UI Components

Located in `/src/components/ui/`:

1. **button.tsx** - Button primitive
2. **form-field.tsx** - Form field wrapper
3. **accordion.tsx** - Radix UI accordion
4. **theme-toggle.tsx** - Dark/light mode toggle
5. **animated-gradient-text.tsx** - Gradient animation effect
6. **magic-card.tsx** - Enhanced card with effects
7. **bento-grid.tsx** - Grid layout component
8. **number-ticker.tsx** - Animated number counter
9. **particles-background.tsx** - Particle effect background

**Patterns**:
- Use Tailwind CSS utility classes
- Leverage CSS custom properties from `globals.css`
- Radix UI primitives for accessibility
- Lucide React for icons

---

## Additional Components

- **forms/contact-form.tsx** - Contact form with validation
- **admin/admin-sidebar.tsx** - Admin navigation sidebar
- **providers/theme-provider.tsx** - Dark mode provider
- **seo/json-ld-script.tsx** - Structured data
- **seo/breadcrumbs.tsx** - Breadcrumb navigation

---

## Key Utilities & Config

- `/src/config/site-config.ts` - Centralized site config (nav, socials, contact info)
- `/src/lib/utils.ts` - Utility functions (likely includes `cn()` for classname merging)
- Tailwind CSS + custom CSS variables for theming
- Next.js App Router with Server & Client components
- TypeScript enabled

---

## Summary

**Architecture**: Modular Next.js site with:
- Reusable section components for landing pages
- Full admin dashboard for content management
- Responsive header/footer with mobile drawer
- Indigo-based color scheme with light/dark theme
- Accessible Radix UI components + Tailwind styling
- API routes for CRUD operations (posts, contacts)
- SEO optimizations (sitemaps, robots, JSON-LD)

**Design Pattern**: Configuration-driven (siteConfig) for easy customization without code changes.
