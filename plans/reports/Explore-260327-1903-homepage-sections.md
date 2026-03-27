# Homepage Sections Exploration Report

**Date:** 2026-03-27  
**Scope:** All 9 homepage section components + layout + UI + theme

---

## Design System & Theme

### Colors (CSS Variables in globals.css)
- **Primary:** `#2CBCB3` (Teal)
- **Primary Dark:** `#239A93`
- **Secondary:** `#f0fdfb` (Light mint)
- **Accent:** `#E87C3E` (Orange)
- **Background:** `#ffffff` (White)
- **Foreground:** `#0a0a0a` (Nearly black text)
- **Border:** `#e5e7eb` (Light gray)
- **Destructive:** `#ef4444` (Red)

### Utilities
- Container: `.container-wide` (max-w-1400px, px-100px on lg)
- Section padding: `py-[50px]` (standard across all sections)
- Border radius: `0.75rem` via `--radius` variable
- Focus ring: `2px` solid primary color
- Dark mode: Full CSS variable re-mapping via `.dark` class

---

## Section-by-Section Summary

### 1. Hero Section ✓ PRODUCTION READY
**File:** `hero-section.tsx` (Server component)

- Full-width responsive banner with hero image
- 1600×524px Figma asset (`/images/hero-banner.png`)
- Rounded corners, responsive sizing
- SEO heading hidden with `sr-only`
- **No TODOs**

### 2. About Section ✓ PRODUCTION READY
**File:** `about-section.tsx` (Server component)

- Centered "About us" heading + quote (max-w-2xl)
- **Clothesline effect:** SVG curved teal string with hanging photos
  - 7 tilted photo placeholders (rotations: -rotate-6 to rotate-6)
  - Clothespins: w-2.5 h-2.5 circles, primary color
  - Border-2 white frames
- Team group photo + landmark placeholders (hidden on mobile)
- Cloud-like bottom edge on group photo
- **Placeholder items:** Gray rectangles for actual photos (bg-gray-300)

### 3. Experience Section ✓ PRODUCTION READY
**File:** `experience-section.tsx` (Server component, used 3× per region)

- Props: `region` (North/Mid/South), optional `description`
- **Asymmetric Figma layout:** 1 portrait card (left) + 5 grid cards (3×2, right)
- Portrait: min-h-[400px], aspect ~0.56
- Grid cards: aspect-square
- Total: 6 cards per region

**Data Structure:**
- Static mock tours: `MOCK_TOURS[]` (same for all regions)
- Regional images: `REGION_IMAGES` object with North/Mid/South arrays
- Images: `/images/exp-{region}-1.png` through `-6.png`

**Components:**
- `TourCardPortrait` (large, full height)
- `TourCardSmall` (square, grid)
- Eye icon overlays, price badges, tag pills
- Gradient overlays: `from-black/70 via-black/20`

**No TODOs**

### 4. Services Section ✓ PRODUCTION READY
**File:** `services-section.tsx` (Client component - "use client")

- **Carousel:** Horizontal scroll with arrow buttons
- 4 service cards: 338×516px (338px image + label below)
- Uses `useHorizontalScroll(354)` hook (338px + 16px gap)
- Snap scroll enabled, scrollbar hidden

**Data:** Static array `SERVICES[]` (4 items)
- Fast track, eVisa, Airport Pickup, eSim
- Images: `/images/service-{name}.png`

**Styling:**
- Cards: rounded-xl, shadow-sm → shadow-md hover
- Arrows: positioned outside (left: -left-5, right: -right-5)
- Arrow buttons: 40×40 circles with border

**No TODOs**

### 5. Tour Package Section ✓ PRODUCTION READY
**File:** `tour-package-section.tsx` (Client component - "use client")

- **Header row:** Title (left) + Duration dropdown + "View all" button (right)
- **Carousel:** 4 full-height cards (338×516px each)
- Arrows: dark semi-transparent (bg-black/50), positioned at edges
- Uses `useHorizontalScroll(354)` hook

**Components:**
- Reuses `TourCard` from ui folder
- `useHorizontalScroll` for smooth scrolling
- ChevronLeft/ChevronRight icons

**Duration Dropdown:**
- Styled select: 1D, 2D, 3D, 4+D
- Custom styling with rotated chevron icon

**No TODOs**

### 6. Reviews Section ✓ PRODUCTION READY
**File:** `reviews-section.tsx` (Client component - "use client")

- **Tripadvisor branding:** 4.9 rating + green badge (#34E0A1) + text
- **Carousel:** 5 review cards (270×152px), horizontally scrollable
- Uses `useHorizontalScroll(286)` hook (270px + 16px gap)
- Arrow buttons: 40×40 circles with border

**Card Structure:**
- Top: 76px image section
- Body (p-2.5):
  - Avatar + name/date
  - 5-star rating (gold #FACC15)
  - Title + truncated body text

**Data:** Static array `REVIEWS[]` (5 items)
- Review photos reuse experience images: `/images/exp-north-{1-5}.png`

**Components:**
- `StarRating` helper (5 gold stars)
- Avatar with initials fallback

**No TODOs**

### 7. YouTube Section ✓ PRODUCTION READY
**File:** `youtube-section.tsx` (Server component)

- **Centered heading** with red YouTube play icon (w-9 h-9, bg-red-600)
- **5 vertical video cards** (270×478px) with staggered offsets (wave effect)

**Wave Effect via marginTop:**
```
Card 1: mt-28px
Card 2: mt-48px
Card 3: mt-0px   ← featured, has play button
Card 4: mt-48px
Card 5: mt-28px
```

**Card Features:**
- Image: object-cover with hover:scale-105
- Gradient overlay: from-black/70
- Play button (center): w-14 h-14, bg-red-600 (only middle card)
- Dark label bar (bottom): bg-black/50

**Images:** `/images/yt-{label}.png`
- our-team, travel-guide, internet-vs-local, choice-expert, travel-essentials

**No TODOs**

### 8. Newsletter Section ✓ PRODUCTION READY (Backend pending)
**File:** `newsletter-section.tsx` (Client component - "use client")

- **Light teal card:** max-w-[928px], rounded-2xl, bg-secondary (#f0fdfb)
- **Two-column layout:** Heading/quote (left) | Form (right), responsive stacked

**Form Inputs:**
- firstName (text input)
- lastName (text input)
- email (email input)
- Subscribe button: rounded-full, primary bg

**State Management:**
- `useState` hook with form object
- `onChange` handlers for each field
- `handleSubmit` prevents default (empty)

**Styling:**
- All inputs: rounded-lg border, consistent padding/focus
- Labels: sr-only for accessibility
- Button: w-fit, rounded-full (different from section buttons)

**TODO:** "wire up real subscription endpoint" (line 20)

### 9. E-Tickets Section ✓ PRODUCTION READY (Backend pending)
**File:** `etickets-section.tsx` (Client component - "use client")

- **Two-part layout:**
  - Left: Teal gradient banner (md:w-[338px], shrink-0)
    - "e-Tickets" heading (text-white, text-4xl, extrabold)
    - Airplane emoji (text-7xl)
  - Right: White search form (flex-1)

**Gradient:** `135deg, #2CBCB3 → #239A93`

**Form Structure:**
- **Row 1 (grid-cols-4 on lg):**
  - From (city input)
  - To (city input)
  - Departure date (date input)
  - Return date (date input)
- **Row 2:**
  - Passengers field (flex-1, describes count + seat class)
  - Search button (w-44px, h-38px) with Search icon

**State Management:**
- `useState` hook with all 5 fields
- `onChange` handlers
- `handleSubmit` empty (no integration)

**Input Styling:** Shared via `inputClass` constant (DRY)
- rounded-lg border, var() colors, focus ring

**No backend integration**

---

## Layout Components

### Site Header ✓ PRODUCTION READY
**File:** `site-header.tsx` (Client component - "use client")

- **Sticky header:** z-50, h-16, container-wide
- **Three-zone layout:** Logo (left) | Nav (center) | Icons (right)

**Logo:**
- "Meetup" text: font-bold, #2CBCB3, custom font-family
- "Travel" subtext: text-[9px], uppercase, tracking-[0.3em]

**Navigation:**
- Desktop nav: gap-7, from `siteConfig.navigation.main`
- Dropdown indicators: ChevronDown on items with `hasDropdown: true`
- Mobile menu: Animated drawer (max-h-0 → max-h-96, 300ms)

**Icons (Desktop):**
- Globe (language/currency)
- Heart (favorites) with hover:text-[#E87C3E]

**No TODOs**

### Site Footer ✓ PRODUCTION READY
**File:** `site-footer.tsx` (Server component)

- **Teal gradient:** `to right, #5DD5CD → #2CBCB3`
- **4-column grid:** grid-cols-4 (responsive: cols-1 sm:cols-2 lg:cols-4)
- **Rounded top:** rounded-t-3xl

**Columns:**
1. **Brand + Socials**
   - Logo + "TRAVEL" (white, extrabold)
   - Social circles: 9×9, border-2 border-white
   - Instagram, Facebook, TikTok (custom SVG), YouTube
   - Hover: bg-white, text-primary

2. **Company & About**
   - Two-column nested grid from `siteConfig`
   - Company: Home, Tours, Hotel, Services, eTickets
   - About: About Us, Recruitment, Terms, Contact

3. **Contact**
   - WhatsApp: Grace, Sunny with phone numbers
   - Email: clickable mailto
   - Office address from config

4. **Payment Channel**
   - Static badges: Visa, Mastercard, Amex, JCB, PayPal, UnionPay
   - White bg, primary text, small rounded

**Bottom Bar:**
- Copyright + Unsubscribe link
- Border-t border-white/30

**No TODOs**

### Floating Social ✓ PRODUCTION READY
**File:** `floating-social.tsx` (Server component)

- **Fixed position:** right-4, top-1/2, -translate-y-1/2, z-50
- **Three vertical buttons** (11×11 each, rounded-xl, shadow-lg):

1. **MeetUp LIVE:** #EF4444 (red)
   - Radio icon + "LIVE" label (text-[8px])
   - Button (no handler - placeholder)

2. **WhatsApp:** #25D366 (green)
   - MessageCircle icon
   - Links to `siteConfig.socials.whatsapp`

3. **Instagram:** Gradient bg (Instagram brand colors)
   - Instagram icon
   - Links to `siteConfig.socials.instagram`

**All buttons:**
- hover:scale-110 transition
- focus-visible:ring-2

**No real TODOs** (MeetUp LIVE just needs onClick handler)

---

## Shared UI Components

### TourCard (`ui/tour-card.tsx`)
**Props:** image, title, price, duration, spots, tags, slug

- **338×516px** card, snap-start, rounded-xl
- **Full-height image** with hover:scale-105
- **Eye icon** (top-right): white, rounded-lg
- **Gradient overlay** (bottom 206px): to-[#1d1d1d]
- **Content overlay** (p-4):
  - Price badge: gradient (261deg #3BBCB7 → #B1FFFC)
  - Tag pills: white, rounded, Calendar/MapPin icons
  - Title: white, text-xs, truncate

**Link wrapper:** navigates to `/tours/{slug}`

### Button (`ui/button.tsx`)
- **CVA-based** component with variants + sizes
- **Variants:** default, outline, ghost, link
- **Sizes:** sm, default, lg
- **Features:** focus ring, disabled state, asChild prop
- Responsive styling via CSS variables

### FormField (`ui/form-field.tsx`)
- **Wrapper component** for consistent form styling
- Props: label, htmlFor, required?, error, children
- Error display: text-xs text-destructive (red)
- Exported `inputStyles` constant (reused in sections)

---

## Hooks

### useHorizontalScroll (`hooks/use-horizontal-scroll.ts`)
```typescript
export function useHorizontalScroll(amount = 300) {
  // Returns: { ref, scroll }
}
```

**Used in:**
- ServicesSection (354px = 338px card + 16px gap)
- TourPackageSection (354px)
- ReviewsSection (286px = 270px card + 16px gap)

---

## Styling Approach

### CSS Variables (globals.css)
- All colors use `var()` references
- Light mode: white background, dark text
- Dark mode: `.dark` class remaps all variables
- Central radius, ring, spacing definitions

### Tailwind CSS
- Primary styling approach
- Responsive prefixes: sm:, md:, lg:
- Arbitrary values: `w-[338px]`, `h-[478px]`, etc.
- Transitions: color, transform
- Animations: accordion, gradient-shift

### Inline Styles
- SVG dimensions/paths (About section)
- Gradient backgrounds (eTickets, TourCard)
- Canvas positioning (FloatingSocial)
- Stagger effects (YouTube wave)

### Accessibility
- `sr-only` for hidden screen reader text
- `aria-label` on buttons/icons
- `aria-hidden` on decorative elements
- Focus states: `focus-visible:ring-2`
- Semantic HTML with proper heading hierarchy
- Form labels with `htmlFor` attributes

---

## Configuration

**File:** `config/site-config.ts`

Central source for:
- Brand name, description, tagline
- Contact info, address, social links
- Navigation structure (main + footer)
- SEO defaults, theme colors

All sections reference this dynamically.

---

## Production Status

### Ready ✓
- Hero, About, Experience, Services, Tour Package, Reviews, YouTube (7 sections)
- Header, Footer, Floating Social (all layout components)
- TourCard, Button, FormField, useHorizontalScroll

### Pending Backend ⚠
- Newsletter (form UI ready, no subscription endpoint)
- eTickets (form UI ready, no flight search integration)
- MeetUp LIVE button (no click handler)

---

## Unresolved Questions

1. **Image Assets:** Verify all image paths exist (hero, experience cards, services, tour packages, reviews, youtube)
2. **Mobile Responsiveness:** Test staggered YouTube cards, clothesline wrapping on mobile
3. **Dropdown Menus:** Header nav has `hasDropdown` flag but no dropdown component found
4. **Dark Mode Toggle:** CSS variables defined, `ThemeToggle` component exists but not used in layout
5. **WCAG Testing:** Components have aria attributes but no formal accessibility audit
6. **Carousel Touch Gestures:** Snap scroll enabled but mobile touch optimization unclear

---

## Quick Reference: All Files

**Sections (9 files):**
- `/home/automation/meetup/src/components/sections/homepage/{hero,about,experience,services,tour-package,reviews,youtube,newsletter,etickets}-section.tsx`

**Layout (3 files):**
- `/home/automation/meetup/src/components/layout/{site-header,site-footer,floating-social}.tsx`

**UI (3 files):**
- `/home/automation/meetup/src/components/ui/{tour-card,button,form-field}.tsx`

**Supporting:**
- `/home/automation/meetup/src/app/globals.css` (theme)
- `/home/automation/meetup/src/config/site-config.ts` (config)
- `/home/automation/meetup/src/hooks/use-horizontal-scroll.ts` (hook)
