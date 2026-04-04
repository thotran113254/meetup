# Meetup Travel Codebase Exploration Report

## Project Overview

**Stack:**
- Next.js 16 (App Router, RSC)
- React 19 + TypeScript
- Tailwind CSS 4 with PostCSS
- Radix UI components (Dialog, Accordion, Select, Separator, Slot)
- react-hook-form + Zod validation
- Framer Motion for animations
- Drizzle ORM + PostgreSQL
- next-themes for dark mode

**Key Dependencies:**
- @hookform/resolvers, @radix-ui/*, class-variance-authority
- lucide-react (icons)
- date-fns, react-day-picker
- tailwind-merge, clsx
- framer-motion

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (/)
│   ├── layout.tsx         # Root layout with fonts, providers
│   ├── globals.css        # CSS variables, theme colors, animations
│   ├── about/page.tsx     # About page (/about)
│   ├── contact/           # Contact page (/contact)
│   │   ├── page.tsx
│   │   └── contact-form-action.ts  # Server action
│   ├── services/page.tsx  # Services listing page (/services)
│   ├── blog/              # Blog pages
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── tours/             # Tour pages
│   │   ├── page.tsx       # Tours listing
│   │   └── [slug]/page.tsx # Tour detail
│   ├── admin/             # Admin dashboard (layout + nested routes)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── contacts/page.tsx
│   │   ├── posts/
│   │   ├── settings/page.tsx
│   └── api/               # API routes
│       ├── contacts/
│       ├── posts/
│       ├── settings/route.ts
│       └── seo/audit/route.ts
│
├── components/
│   ├── ui/               # Reusable UI components (shadcn style)
│   │   ├── button.tsx    # CVA-based button with variants
│   │   ├── form-field.tsx # Label + input wrapper + error display
│   │   ├── select.tsx    # Radix-based Select
│   │   ├── accordion.tsx
│   │   ├── calendar.tsx
│   │   ├── popover.tsx
│   │   ├── tour-card.tsx # Figma-spec tour card (338x516px mobile)
│   │   ├── scroll-animations.tsx # ScrollReveal + stagger utilities
│   │   ├── filter-dropdown.tsx
│   │   ├── subscribe-popup.tsx
│   │   ├── wishlist-drawer.tsx
│   │   ├── currency-switcher.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── number-ticker.tsx
│   │   ├── magic-card.tsx
│   │   ├── bento-grid.tsx
│   │   ├── animated-gradient-text.tsx
│   │   └── particles-background.tsx
│   │
│   ├── forms/
│   │   └── contact-form.tsx # react-hook-form + Zod + server action
│   │
│   ├── sections/         # Page sections (composed into pages)
│   │   ├── homepage/
│   │   │   ├── hero-section.tsx
│   │   │   ├── about-section.tsx     # Clothesline gallery
│   │   │   ├── tour-package-section.tsx
│   │   │   ├── reviews-section.tsx
│   │   │   ├── experience-section.tsx (region prop)
│   │   │   ├── services-section.tsx
│   │   │   ├── etickets-section.tsx
│   │   │   ├── youtube-section.tsx
│   │   │   └── newsletter-section.tsx
│   │   ├── tours/
│   │   │   ├── tours-hero-section.tsx
│   │   │   ├── vietnam-intro-section.tsx (gradient text)
│   │   │   ├── most-liked-package-section.tsx
│   │   │   ├── tour-package-grid-section.tsx
│   │   │   └── tour-faq-section.tsx
│   │   ├── tour-detail/
│   │   │   ├── tour-image-gallery.tsx
│   │   │   ├── tour-detail-info.tsx  (overview stats, tags)
│   │   │   ├── tour-itinerary-section.tsx
│   │   │   ├── tour-itinerary-day-item.tsx
│   │   │   ├── tour-detail-reviews.tsx
│   │   │   ├── tour-related-packages.tsx
│   │   │   ├── tour-pricing-sidebar.tsx (sticky on desktop)
│   │   │   ├── tour-mobile-bottom-bar.tsx
│   │   │   ├── tour-budget-planner.tsx
│   │   │   ├── tour-contact-expert-popup.tsx
│   │   │   └── tour-gallery-popup.tsx
│   │   ├── cta-section.tsx
│   │   ├── faq-section.tsx
│   │   ├── features-section.tsx
│   │   ├── pricing-section.tsx
│   │   ├── stats-section.tsx
│   │   └── testimonials-section.tsx
│   │
│   ├── layout/          # Header, footer, layout components
│   │   ├── site-header.tsx (sticky, rounded bottom, logo|nav|icons)
│   │   ├── site-footer.tsx
│   │   ├── mobile-menu.tsx
│   │   └── floating-social.tsx
│   │
│   ├── admin/
│   │   └── admin-sidebar.tsx
│   │
│   ├── providers/
│   │   └── theme-provider.tsx (next-themes)
│   │
│   └── seo/
│       ├── breadcrumbs.tsx (structured data + nav)
│       └── json-ld-script.tsx
│
├── config/
│   └── site-config.ts    # Centralized config (nav, branding, SEO)
│
├── lib/
│   ├── utils.ts          # cn() helper
│   ├── seo-utils.ts      # generatePageMetadata, JSON-LD builders
│   ├── api-auth.ts
│   ├── rate-limiter.ts
│   ├── blog-data.ts
│   └── validations/
│       ├── contact-schema.ts  # Zod schema for contacts
│       └── post-schema.ts
│
├── db/
│   ├── connection.ts
│   ├── schema.ts         # Drizzle schema
│   └── queries/
│       ├── contact-queries.ts
│       └── post-queries.ts
│
└── hooks/
    └── use-horizontal-scroll.ts
```

---

## Page Structure & Organization

### Existing Pages

1. **Homepage** (`/`)
   - Sections: Hero | Tour Packages | Reviews | Experience (North/Mid/South) | Services | eTickets | YouTube | About | Newsletter
   - Pattern: Compose sections into page
   - SEO: Homepage + Organization + Website JSON-LD

2. **Tours Listing** (`/tours`)
   - Sections: Hero | Vietnam Intro | Most Liked | Grid | Reviews | FAQ | Newsletter
   - Breadcrumbs included
   - SEO: Breadcrumb JSON-LD

3. **Tour Detail** (`/tours/[slug]`)
   - Sections: Gallery | Info | Itinerary | Reviews | Related | Newsletter
   - Sidebar (sticky on desktop): Pricing
   - Mobile bottom bar for CTAs
   - 2-column layout: flex-1 + fixed width sidebar

4. **Contact** (`/contact`)
   - Hero header with gradient background
   - 2-column: Info + Form
   - Form: react-hook-form + Zod + server action

5. **About** (`/about`)
   - Hero + Values cards + Team grid
   - CTA section at bottom

6. **Services** (`/services`)
   - Hero + Service cards grid (6 services)
   - Each card has icon, title, description, link

7. **Blog**
   - Listing page + dynamic detail pages

8. **Admin** (dashboard)
   - Layout wrapper with sidebar
   - Contacts, Posts (new), Settings pages

---

## Component Patterns

### UI Components

**Form Field Wrapper** (FormField):
```typescript
interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
}
```
Provides: label + error display + required indicator. Single source of truth for styling.

**Button** (CVA-based):
- Variants: `default | destructive | outline | secondary | ghost | link`
- Sizes: `default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`
- Props: `asChild` (Slot composition)
- Fully styled with focus states, disabled states, SVG sizing

**Input Styles**:
```css
w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] 
px-4 py-2.5 text-sm placeholder:text-[var(--color-muted-foreground)] 
focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]
```

**Select** (Radix-based):
- Exports: Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectLabel
- Custom scroll buttons with chevron icons
- Full keyboard support

**Tour Card**:
- Figma spec: 338x516px (mobile 294x294px)
- Structure: Image + Eye icon (top-right) + Gradient overlay + Price badge (teal gradient) + Tags + Title
- Link wrapper to `/tours/[slug]`

### Form Pattern (react-hook-form + Zod)

**Schema Example** (contact-schema.ts):
```typescript
export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;
```

**Form Component Pattern** (contact-form.tsx):
1. Client component: "use client"
2. useForm hook with zodResolver
3. Form submission → server action
4. Display result (success/error message)
5. Auto-reset on success

**Server Action Pattern** (contact-form-action.ts):
1. "use server"
2. Schema validation (defense in depth)
3. DB operation (createContactSubmission)
4. Return { success, message }

### Section Component Pattern

**Standard Structure**:
1. Named exports: `export function SectionName() { ... }`
2. Usually client components (animations, interactivity)
3. Use CSS variables: `var(--color-primary)`, `var(--color-muted-foreground)`, etc.
4. Container utilities: `container-narrow`, `container-wide`, `section-padding`
5. Scroll animations: ScrollReveal wrapper for fade-in-up

**ScrollReveal Pattern**:
```typescript
<ScrollReveal delay={0.2} className="...">
  <h2>Content</h2>
</ScrollReveal>
```
Triggers once on viewport entry, fade-in-up animation.

---

## Styling & Theme

### CSS Variables (globals.css)

**Brand Colors**:
```css
--color-primary: #2CBCB3;        /* Teal */
--color-primary-dark: #239A93;
--color-primary-foreground: #ffffff;
--color-accent: #E87C3E;         /* Orange */
--color-accent-foreground: #ffffff;
--color-secondary: #f0fdfb;
--color-secondary-foreground: #134e4a;
```

**Semantic Colors**:
```css
--color-background: #ffffff;
--color-foreground: #0a0a0a;
--color-muted: #f1f5f9;
--color-muted-foreground: #64748b;
--color-border: #e5e7eb;
--color-ring: #2CBCB3;
--color-card: #ffffff;
--color-card-foreground: #0a0a0a;
--color-destructive: #ef4444;
--color-input: #e5e7eb;
--color-popover: #ffffff;
```

**Dark Mode Override** (`.dark`):
Different color palette for dark theme.

**Container Utilities**:
```css
.container-narrow: max-w-4xl
.container-wide: max-w-[1400px] px-[100px] on lg
.section-padding: py-5 md:py-12 lg:py-14
```

**Custom Animations**:
```css
animate-accordion-down/up   /* Radix accordion */
animate-gradient-shift      /* Gradient animation */
animate-float              /* Floating animation (airplanes) */
animate-marquee            /* Horizontal scroll */
```

**Gradient Utilities**:
```css
.text-gradient-gold       /* Gold gradient text */
.text-gradient-red        /* Red gradient text */
```

### Tailwind Config

Located in PostCSS imports. Uses Tailwind 4 with @import "tailwindcss".

---

## SEO & Metadata

### Metadata Generation

**Function**: `generatePageMetadata()`
- Inputs: title, description, path, image, noIndex, type, publishedTime, modifiedTime, authors
- Returns: Next.js Metadata object
- Sets: canonical, og:*, twitter:*, robots

### JSON-LD Structured Data

**Components**:
- `JsonLdScript`: Wrapper that renders script tag
- Builders: buildOrganizationJsonLd, buildWebsiteJsonLd, buildBreadcrumbJsonLd, buildServiceJsonLd

**Pattern**:
```typescript
export const metadata = generatePageMetadata({
  title: "...",
  description: "...",
  path: "/tours",
});

return (
  <>
    <JsonLdScript data={[buildOrganizationJsonLd(), buildBreadcrumbJsonLd(...)]} />
    ...
  </>
);
```

### Breadcrumbs

Component: `Breadcrumbs` - renders nav + automatically adds home as first item
- Includes JSON-LD breadcrumb structured data
- Current page is not a link

---

## Form Validation

**Pattern**: Zod schemas in `src/lib/validations/`

**Example** (contact-schema.ts):
```typescript
export const contactFormSchema = z.object({
  name: z.string().min(2, "Ten phai co it nhat 2 ky tu").max(100),
  email: z.string().email("Email khong hop le"),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;
```

**In Forms**:
```typescript
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... }
});
```

---

## Database Layer

**ORM**: Drizzle ORM
**DB**: PostgreSQL

**Structure**:
- `src/db/schema.ts`: Table definitions
- `src/db/queries/`: Query functions (contact-queries, post-queries)
- `src/db/connection.ts`: Connection setup

**Pattern**:
```typescript
// In server action
const result = await createContactSubmission({
  name, email, phone, message
});
```

---

## Site Configuration

**File**: `src/config/site-config.ts`

**Contents**:
- name, shortName, description, tagline
- url (from env), ogImage
- email, phone, address (street, city, country, zip)
- socials (instagram, facebook, tiktok, youtube, whatsapp)
- seo (titleTemplate, defaultTitle, locale, alternateLocales, type, twitterHandle)
- theme (primary, background, foreground colors)
- navigation:
  - main: array of {label, href, hasDropdown}
  - footer: company, about, contact sections
- contact details (whatsapp contacts, email, office)

---

## Existing Tour-Related Pages & Components

### Tour Pages
1. **Tours Listing** (`/tours/page.tsx`)
   - Hero, Vietnam Intro, Most Liked, Grid, Reviews, FAQ, Newsletter sections

2. **Tour Detail** (`/tours/[slug]/page.tsx`)
   - Gallery, Info, Itinerary, Reviews, Related, Newsletter
   - Sticky sidebar (pricing on desktop, bottom bar on mobile)

### Tour-Related Components

**UI Components**:
- `tour-card.tsx`: Figma-spec card (338x516px) with gradient overlay, price badge, tags

**Sections**:
- `tour-image-gallery.tsx`: Full-screen gallery
- `tour-detail-info.tsx`: Title, tags, overview stats (group size, trip type, pace, etc.)
- `tour-itinerary-section.tsx`: Day-by-day breakdown
- `tour-itinerary-day-item.tsx`: Individual day item
- `tour-detail-reviews.tsx`: Testimonials
- `tour-pricing-sidebar.tsx`: Price, dates, call-to-action (sticky desktop)
- `tour-mobile-bottom-bar.tsx`: Mobile sticky CTA bar
- `tour-budget-planner.tsx`: Budget breakdown
- `tour-contact-expert-popup.tsx`: Contact popup/modal
- `tour-gallery-popup.tsx`: Full-screen gallery modal
- `tour-related-packages.tsx`: Related tours carousel

**Data in tour-detail-info.tsx**:
- Overview stats (icon, label, value)
- Physical rating bars (5-level)
- Places: array of location names

---

## Fonts & Typography

**Fonts Loaded** (layout.tsx):
1. **Inter** (body, default)
   - Variable: `--font-inter`
   - Subsets: latin, vietnamese
   - Display: swap

2. **Dancing Script** (decorative)
   - Variable: `--font-script`
   - Subsets: latin, vietnamese
   - Display: swap

3. **Phudu** (decorative)
   - Variable: `--font-phudu`
   - Subsets: latin, vietnamese
   - Display: swap

### Common Text Styles

Observed across components:
- Headings: font-bold, tracked
- Body: text-sm / text-base
- Links: hover:text-[var(--color-primary)] transition-colors
- Placeholders: text-[var(--color-muted-foreground)]

---

## Responsive Design

**Breakpoints** (Tailwind defaults):
- Mobile: default (no prefix)
- Tablet/Small: `sm:` (640px)
- Desktop: `md:` (768px), `lg:` (1024px)
- Large: `xl:` (1280px), `2xl:` (1536px)

**Patterns**:
- Hidden on mobile: `hidden md:block`
- Different layout: `flex-col lg:flex-row`
- Different sizing: `h-8 md:h-10 lg:h-12`
- Padding: `px-4 sm:px-6 lg:px-8` or `lg:px-[100px]`

---

## Key Utilities & Helpers

**`lib/utils.ts`**:
- `cn()`: Merge Tailwind classes (clsx + tailwind-merge)
- `formatDate()`: Format date to locale (vi-VN by default)

**`lib/seo-utils.ts`**:
- `generatePageMetadata()`: Create metadata objects
- JSON-LD builders: Organization, Website, Breadcrumb, Service
- All reusable across pages

---

## Header & Navigation

**SiteHeader**:
- Sticky, rounded bottom corners, shadow
- 3-zone layout: Logo | Desktop Nav | Icons + Mobile Toggle
- Logo: SVG image link to home
- Desktop nav: siteConfig.navigation.main with chevron dropdowns
- Right icons: Currency switcher, Wishlist, Mobile menu toggle

**Navigation Config** (site-config.ts):
```typescript
navigation: {
  main: [
    { label: "Tour", href: "/tours", hasDropdown: true },
    { label: "Services", href: "/services", hasDropdown: true },
    { label: "eTickets", href: "#", hasDropdown: false },
    { label: "Destination", href: "#", hasDropdown: false },
    { label: "Blog", href: "/blog", hasDropdown: false },
    { label: "About Meetup", href: "/about", hasDropdown: true },
  ],
  footer: { ... }
}
```

---

## Layout Conventions

### Section-Based Architecture

Every page is built by composing sections:
1. Hero/Header section (usually with gradient background)
2. Content sections (cards, grids, galleries, etc.)
3. Related/Related content sections
4. Newsletter section
5. Optional CTA section at bottom

### Container Widths

- **Narrow**: `max-w-4xl` (500-700px content)
  - Used in page headers, hero sections
- **Wide**: `max-w-[1400px]` (full content area)
  - Default for content grids
  - Padding: `px-4 sm:px-6 lg:px-8` or `lg:px-[100px]`

### Common Section Patterns

1. **Hero Header**:
   ```tsx
   <section className="section-padding bg-gradient-to-b from-[var(--color-accent)]/30 to-transparent">
     <div className="container-narrow text-center">
       <h1>Title</h1>
       <p>Description</p>
     </div>
   </section>
   ```

2. **Content Grid**:
   ```tsx
   <section className="section-padding bg-[var(--color-background)]">
     <div className="container-wide">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {items.map(item => <Card key={} />)}
       </div>
     </div>
   </section>
   ```

3. **Two-Column**:
   ```tsx
   <div className="grid gap-12 lg:grid-cols-2">
     <div>{leftContent}</div>
     <div>{rightContent}</div>
   </div>
   ```

---

## Language & Localization

**Default**: Vietnamese (Vi)
- All text content: Vietnamese
- Currency: USD (with switcher component)
- Date formatting: vi-VN locale

---

## Client vs Server

### Client Components ("use client")
- Forms with interactivity (ContactForm)
- Animations (HeroSection, ScrollReveal)
- Interactive UI (SiteHeader, MobileMenu, Popovers)
- State management (wishlist, currency, etc.)

### Server Components
- Page components
- Static sections (most sections are interactive/animated, so "use client")
- API routes
- Server actions

---

## Next Steps for Implementation

When building a new page or feature:

1. **Check site-config.ts**: Update navigation if needed
2. **Create page file**: `src/app/path/page.tsx`
3. **Setup metadata**: Use `generatePageMetadata()` + JSON-LD builders
4. **Add breadcrumbs**: Use `<Breadcrumbs>` component
5. **Create sections**: Each logical content block as separate component
6. **Use container utilities**: `container-wide`, `section-padding`
7. **Apply CSS variables**: `var(--color-primary)`, `var(--color-muted-foreground)`, etc.
8. **Add animations**: Wrap in `<ScrollReveal>` for fade-in-up
9. **Ensure responsive**: Mobile-first approach with `md:` and `lg:` prefixes
10. **Test SEO**: Metadata, JSON-LD, breadcrumbs, og:image

