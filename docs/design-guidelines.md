# Design Guidelines — Meetup Travel

**Last Updated:** March 27, 2026
**Figma File:** `https://www.figma.com/design/V4UemzwwSm5FEe9FJteXDw/MEETUP-TRAVEL`
**Status:** ✅ Phase 6 Complete — 100% pixel-perfect implementation

---

## Design Philosophy

Meetup Travel's design reflects a modern, approachable travel agency brand. The visual language emphasizes:

- **Trust & Professionalism:** Clean, minimal aesthetic with purposeful spacing
- **Local Expertise:** Warm, inviting color palette (teal + orange) evokes tropical destinations
- **Mobile-First:** Responsive from 375px mobile to 1600px desktop without compromises
- **Accessibility:** Sufficient color contrast, touch-friendly controls, semantic HTML

---

## Color System

### Primary Colors

| Color | Value | Usage | CSS Variable |
|-------|-------|-------|-------------|
| **Brand Teal** | `#2CBCB3` | Primary buttons, brand accents, links | `--color-primary` |
| **Teal Dark** | `#239A93` | Hover states, secondary brand | `--color-primary-dark` |
| **Brand Orange** | `#E87C3E` | Accent highlights, CTAs | `--color-accent` |

### Semantic Colors

| Color | Value | Usage | CSS Variable |
|-------|-------|-------|-------------|
| **Background** | `#ffffff` (light) / `#0a0a0a` (dark) | Page background | `--color-background` |
| **Foreground** | `#0a0a0a` (light) / `#f8fafc` (dark) | Text color | `--color-foreground` |
| **Secondary** | `#f0fdfb` (light) / `#1e293b` (dark) | Secondary backgrounds | `--color-secondary` |
| **Muted** | `#f1f5f9` (light) / `#1e293b` (dark) | Disabled, placeholder text | `--color-muted` |
| **Border** | `#e5e7eb` (light) / `#1e293b` (dark) | Dividers, borders | `--color-border` |
| **Destructive** | `#ef4444` | Error, delete actions | `--color-destructive` |

### Dark Mode Support

All colors have light and dark variants defined in `src/app/globals.css`:

```css
:root {
  --color-primary: #2CBCB3;        /* Light mode */
  --color-background: #ffffff;
  /* ... */
}

.dark {
  --color-primary: #5DD5CD;        /* Slightly brighter for dark bg *)
  --color-background: #0a0a0a;
  /* ... */
}
```

Components automatically adapt when `.dark` class is added to `<html>` element.

---

## Typography

### Font Stack

**No custom web fonts** — uses system defaults for faster loading:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
             "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
             "Droid Sans", "Helvetica Neue", sans-serif;
```

Fallback order:
1. System fonts (native OS font rendering)
2. Helvetica Neue, Roboto
3. Generic `sans-serif`

### Heading Hierarchy

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| **h1** | 32px–48px | 700 (bold) | Page titles, hero section |
| **h2** | 24px–32px | 700 (bold) | Section titles |
| **h3** | 18px–24px | 600 (semibold) | Subsection titles |
| **h4** | 16px–18px | 600 (semibold) | Card titles |
| **p** | 14px–16px | 400 (regular) | Body text |
| **small** | 12px–14px | 400 (regular) | Captions, labels |

### Line Heights

- **Headings:** 1.2 (tight, visual impact)
- **Body:** 1.5–1.6 (readable, comfortable)
- **Labels:** 1.4 (compact but accessible)

---

## Layout & Spacing

### Container Widths

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| **Mobile** | 375px | Min width (no max) |
| **Tablet** | 768px | Mid-range devices |
| **Desktop** | 1024px | Standard desktop |
| **Wide** | 1400px | Max content width (design spec) |
| **Full** | 1600px | Full hero/footer width |

### Container Utilities (Tailwind)

```typescript
// src/app/globals.css
.container-narrow {
  @apply mx-auto max-w-4xl px-4 sm:px-6 lg:px-8;
}

.container-wide {
  @apply mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-[100px];
}

.section-padding {
  @apply py-16 md:py-24 lg:py-32;
}
```

### Side Padding

| Breakpoint | Padding |
|-----------|---------|
| **Mobile (< 768px)** | 16px left/right |
| **Tablet (768px+)** | 32px left/right |
| **Desktop (1024px+)** | 100px left/right |

### Spacing Scale

All spacing uses multiples of 4px (Tailwind default):

| Units | Pixels | Tailwind | Usage |
|-------|--------|----------|-------|
| - | 4px | `p-1` | Minimal spacing |
| - | 8px | `p-2` | Tight spacing |
| - | 12px | `p-3` | Label/input spacing |
| - | 16px | `p-4` | Card padding |
| - | 24px | `p-6` | Section spacing |
| - | 32px | `p-8` | Block spacing |
| - | 48px | `p-12` | Large spacing |
| - | 64px | `p-16` | Hero spacing |

---

## Component Specifications

### Card Components

#### Tour Card (338×516px desktop, full width mobile)

```
┌─────────────────────────┐
│    Image (338x270)      │
├─────────────────────────┤
│ Title (2 lines max)     │
│ Rating (stars + count)  │
│ Price (large, teal)     │
│ Duration, Location      │
│ Add to Wishlist (btn)   │
└─────────────────────────┘
```

**Specs:**
- Border radius: `rounded-[12px]`
- Background: `var(--color-card)`
- Image height: 270px
- Padding: 16px
- Shadow: Subtle drop shadow on hover
- Price color: `var(--color-primary)` (#2CBCB3)

#### Experience Card (338×338px desktop, full width mobile)

```
┌─────────────────────────┐
│   Image (338x338)       │
├─────────────────────────┤
│ Region Name (centered)  │
│ Explore button          │
└─────────────────────────┘
```

**Specs:**
- Border radius: `rounded-[12px]`
- Image fills entire card with aspect ratio 1:1
- Text overlay: Bottom-right aligned
- Button: White text on teal background

#### Service Card (338×338px, carousel)

```
┌─────────────────────────┐
│   Icon (large, teal)    │
├─────────────────────────┤
│ Service Name            │
│ Short description       │
│ Learn More →            │
└─────────────────────────┘
```

**Specs:**
- Border radius: `rounded-[12px]`
- Icon size: 64×64px
- Icon color: `var(--color-primary)`
- Background: Light secondary color
- Padding: 24px

### Buttons

#### Primary Button

```
.btn-primary {
  @apply px-6 py-3 rounded-[12px] bg-[--color-primary]
         text-[--color-primary-foreground] font-semibold
         hover:bg-[--color-primary-dark] transition-colors;
}
```

**States:**
- **Default:** Teal background, white text
- **Hover:** Darker teal
- **Disabled:** Muted background, disabled cursor
- **Loading:** Show spinner, disable interaction

#### Secondary Button

```
.btn-secondary {
  @apply px-6 py-3 rounded-[12px] border-2 border-[--color-primary]
         text-[--color-primary] bg-transparent
         hover:bg-[--color-secondary] transition-colors;
}
```

#### Destructive Button

```
.btn-destructive {
  @apply px-6 py-3 rounded-[12px] bg-[--color-destructive]
         text-[--color-destructive-foreground] font-semibold
         hover:opacity-90 transition-opacity;
}
```

### Form Controls

#### Text Input

```
┌──────────────────────────┐
│ Label                    │
├──────────────────────────┤
│ Placeholder text...      │ ← 44px height minimum (touch target)
├──────────────────────────┤
│ Helper text (optional)   │
└──────────────────────────┘
```

**Specs:**
- Border: 1px solid `var(--color-border)`
- Border radius: `rounded-[8px]`
- Padding: 12px 16px
- Font size: 14–16px (prevents zoom on iOS)
- Focus: Outline color = `var(--color-primary)`
- Min height: 44px (iOS touch target)

#### Select Dropdown

```
┌──────────────────────────┐
│ Selected Value ▼         │
└──────────────────────────┘
```

**Specs:**
- Uses native `<select>` on mobile (better UX)
- Custom styled on desktop with Radix UI
- Border radius: `rounded-[8px]`
- Padding: 12px 16px
- Min height: 44px

#### Checkbox & Radio

- Size: 20×20px (touch-friendly)
- Color: `var(--color-primary)` when checked
- Border: 2px solid `var(--color-border)` when unchecked
- Border radius: 4px (checkbox), 50% (radio)

---

## Responsive Design Breakpoints

Meetup uses Tailwind's standard breakpoints + custom large screens:

| Breakpoint | CSS | Min-width | Usage |
|-----------|-----|----------|-------|
| `sm` | `@media (min-width: 640px)` | 640px | Small tablets |
| `md` | `@media (min-width: 768px)` | 768px | Medium tablets |
| `lg` | `@media (min-width: 1024px)` | 1024px | Desktop |
| `xl` | `@media (min-width: 1280px)` | 1280px | Wide desktop |
| `2xl` | `@media (min-width: 1536px)` | 1536px | Extra wide |

### Mobile-First Approach

All styles start with mobile, enhanced with breakpoints:

```jsx
{/* Mobile: full width, no rounded corners */}
{/* Tablet (md:): add border radius, padding */}
{/* Desktop (lg:): set max width, side padding */}

<div className="w-full rounded-none md:rounded-[12px] lg:max-w-[338px] lg:px-4">
  {/* ... */}
</div>
```

### Common Responsive Patterns

#### Full-Width Cards on Mobile, Grid on Desktop

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Each child is full width on mobile, then 2-col, then 3-col */}
</div>
```

#### Hidden/Visible by Breakpoint

```jsx
<nav className="hidden md:flex">Desktop Nav</nav>
<button className="md:hidden">Mobile Menu</button>
```

#### Responsive Font Sizes

```jsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>
```

---

## Interactive Components

### Modals & Popups

#### Subscribe Success/Fail Popup

```
┌────────────────────────────────┐
│  × (close button, top-right)   │
├────────────────────────────────┤
│                                │
│  ✓ Success Icon                │
│  Subscription Confirmed!       │
│  Thank you for subscribing.    │
│                                │
│         [Close] [OK]           │
│                                │
└────────────────────────────────┘
```

**Specs:**
- Width: 400px (desktop), 90vw (mobile)
- Border radius: `rounded-[16px]`
- Overlay: Black, 60% opacity
- Animation: Fade in 300ms, scale from 0.9
- Close on: Button click, overlay click (except success, requires dismiss)

#### Wishlist Drawer

```
drawer from right ──→
┌──────────────────────┐
│ ← Wishlist  (close)  │
├──────────────────────┤
│ 3 Saved Tours:       │
│ ☐ Mekong Delta      │
│ ☐ Ha Long Bay       │
│ ☐ Hoi An...         │
├──────────────────────┤
│  [View All] [Book]   │
└──────────────────────┘
```

**Specs:**
- Width: 100% (mobile), 400px (desktop)
- Slide from right over 300ms
- Overlay: Click to close
- Scrollable content if > 4 items
- LocalStorage persistence

#### Currency Switcher Dropdown

```
Current: USD ▼
┌─────────────────┐
│ USD (United $)  │ ← default
│ VND (Vietnam ₫) │
│ GBP (UK £)      │
│ EUR (Euro €)    │
└─────────────────┘
```

**Specs:**
- Opens on click (toggle)
- Updates all prices on page instantly
- Stored in `localStorage['currency']`
- Accessible from header + mobile menu
- Radio buttons or custom styled

#### Tour Filter Dropdowns (Style & Duration)

```
Style Filter          Duration Filter
┌─────────────────┐  ┌──────────────────┐
│ All ▼           │  │ All Durations ▼  │
└─────────────────┘  └──────────────────┘
    ↓                      ↓
┌─────────────────┐  ┌──────────────────┐
│ ☐ Budget        │  │ ☐ 1-3 Days       │
│ ☐ Adventure     │  │ ☐ 4-7 Days       │
│ ☐ Luxury        │  │ ☐ 7+ Days        │
│ ☐ Family        │  │ ☐ Custom         │
└─────────────────┘  └──────────────────┘
```

**Specs:**
- Multi-select checkboxes
- Apply button or instant filter on check
- Chips show active filters above carousel
- Mobile: stacked dropdowns or collapse/expand

### Mobile Menu (Mega Menu)

```
Mobile View (375px):
┌─────────────────────────┐
│ Menu ×  Logo            │  ← Header remains visible
├─────────────────────────┤
│ Tour              ▶     │
│ Services          ▶     │
│ eTickets              │
│ Destination       ▶     │
│ Blog                  │
│ About Meetup      ▶     │
├─────────────────────────┤
│ Currency: USD ▼         │
│ Language: EN ▼          │
├─────────────────────────┤
│ [Contact] [Login]       │
└─────────────────────────┘
```

**Specs:**
- Full-screen overlay on mobile
- Dark semi-transparent backdrop
- Slides in from left over 300ms
- Icon: hamburger → × on open
- Close on: Click ×, overlay click, link click
- Includes currency + language switches

---

## Section-Specific Styles

### Hero Banner Section

```
┌─────────────────────────────────────────┐
│                                         │
│      [Background Image - Full Width]    │  1600×524px
│                                         │
│  "Welcome to Meetup"  (heading)         │
│  "Where local experts craft..."         │
│  [Explore Tours] [Learn More]           │
│                                         │
└─────────────────────────────────────────┘
```

**Specs:**
- Full viewport width (no max-width constraint)
- Height: 524px (desktop), ~300px (mobile)
- Image: Cover fill, no-repeat
- Overlay: Dark gradient 0–60% opacity (text readability)
- Text: White, centered, shadow for legibility
- CTA buttons: Prominent, rounded-[12px]

### Tour Package Carousel

```
Previous                Next
  ◄  ┌──────────────────────────────────┐  ►
     │ [Tour Card] [Tour Card] [Tour Card]│
     │     (visible 3 cards desktop)      │
     └──────────────────────────────────┘
     [Style Filter] [Duration Filter]
```

**Specs:**
- Card size: 338×516px
- Gap between cards: 24px
- Snap to cards (scroll-snap-type: x mandatory)
- Mobile: Show 1–1.5 cards, scroll horizontally
- Filters above carousel, apply via query string or state

### Experience Grid (3 Regions)

Each region:
```
Region Portrait (lg breakpoint):
┌──────────────┐
│   Region     │  330×330px portrait image
│   (North)    │
│              │
└──────────────┘
[Explore North]

Grid Below:
┌──┬──┬──┐
│ 1│ 2│ 3│
├──┼──┼──┤
│ 4│ 5│ 6│
└──┴──┴──┘
(6 cards, 338×338px each)
```

**Specs:**
- Portrait card: 330×330px on desktop, full width on mobile
- Grid: 3 columns (desktop), 2 columns (md), 1 column (mobile)
- Card gap: 24px
- Border radius: `rounded-[12px]`

### Services Carousel

```
Services (3-4 visible):
┌────────────┬────────────┬────────────┐
│ Airport    │ eSIM       │ eVisa      │
│ Pickup     │ Card       │ Processing │
│ Icon: 🚗   │ Icon: 📡   │ Icon: 📋   │
│ [Learn]    │ [Learn]    │ [Learn]    │
└────────────┴────────────┴────────────┘
```

**Specs:**
- Card size: 338×338px
- Carousel: Snap-enabled, prev/next buttons
- Icon: Large (64px), teal color
- Text: Centered, white on teal background
- Mobile: 1 card visible, scroll

### Newsletter Subscription

```
┌────────────────────────────────┐
│ "Never Miss An Update"         │
│ "Get the latest deals..."      │
├────────────────────────────────┤
│ [Email Input] [Subscribe →]    │
│                                │
│ By subscribing you agree to... │
└────────────────────────────────┘
```

**Specs:**
- Background: Subtle gradient or solid secondary color
- Form: Horizontal (desktop), stacked (mobile)
- Input: 100% width on mobile, fixed on desktop
- Button: Always visible, no disappear on hover
- Success/error feedback via popup modal

### YouTube Section (Staggered Smiley Curve)

```
Smiley curve layout (5 videos):
           [Video 3]
      [Video 2] [Video 4]
   [Video 1]         [Video 5]

Grid on mobile: 2 columns
```

**Specs:**
- Layout: CSS Grid with staggered positioning
- Video card: Image + play icon overlay
- Image: 100% width, aspect ratio 16:9
- Click: Opens video URL (YouTube link)
- Mobile: 2-column grid (responsive)

### About Section

```
┌─────────────────────────┐
│ "About Meetup Travel"   │
│ Mission statement text  │
│ 3-4 paragraphs max      │
├─────────────────────────┤
│ [Clothesline Gallery]   │
│ Photos on clothesline   │
│ Pin-style cards         │
│ Rotated angles          │
└─────────────────────────┘
```

**Specs:**
- Text section: 70-char line length (readable)
- Gallery: Inline (clothesline style) or grid
- Photo cards: 150–200px, rotated ±5°, drop shadow
- Gap: 16–24px between pins
- Mobile: Stack vertically, straighten rotations

### Footer

```
┌──────────────────────────────────────┐
│ Teal gradient background             │
│                                      │
│ [Company] [About] [Contact] [Social] │
│ Four columns (responsive)            │
│                                      │
│ Copyright © 2026 Meetup Travel       │
│                                      │
└──────────────────────────────────────┘
```

**Specs:**
- Background: Gradient from `#2CBCB3` to `#239A93` (or darker)
- Text: White on dark background
- Link color: White with underline on hover
- Icon size: 24px
- Layout: 4 columns (lg), 2 columns (md), 1 column (mobile)
- Social icons: 40×40px, clickable regions

---

## Accessibility Standards

### Color Contrast

- **Text on background:** Minimum 4.5:1 (WCAG AA)
- **Large text:** Minimum 3:1
- **Example:** `#2CBCB3` (teal) on `#ffffff` (white) = 5.2:1 ✅

### Touch Targets

- **Minimum size:** 44×44px (iOS), 48×48px (Android)
- **Spacing:** 8px gap minimum between touch targets
- **Buttons:** Always >= 44px height
- **Icons:** Wrapped in 44px+ interactive region

### Semantic HTML

- Use `<button>` for actions, not `<div onclick>`
- Use `<a>` for navigation, not `<span>`
- Use `<nav>`, `<header>`, `<footer>`, `<main>`, `<section>`
- Form inputs have associated `<label>` elements
- Images have `alt` attributes

### Screen Reader Support

- ARIA labels on interactive elements
- Skip navigation link at top of page
- Heading hierarchy: h1 → h2 → h3 (no gaps)
- Lists use semantic `<ul>` / `<ol>`

### Motion & Animation

- Reduce animations on `prefers-reduced-motion: reduce`
- Max animation duration: 300ms
- No flashing (> 3 per second)
- Autoplay videos disabled

---

## Icons

All icons from **Lucide React** (MIT license, 500+ icons):

```tsx
import { ShoppingCart, Heart, Menu, X, ChevronRight } from 'lucide-react';

<ShoppingCart size={24} color="var(--color-primary)" />
```

### Icon Sizing Convention

| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 16px | Inline text icons, badges |
| `sm` | 20px | Button icons |
| `md` | 24px | Header icons, toolbar |
| `lg` | 32px | Large feature icons |
| `xl` | 48px | Hero/section icons |
| `2xl` | 64px | Service cards |

### Icon Colors

- **Default:** `currentColor` (inherits text color)
- **Interactive:** `var(--color-primary)` for primary actions
- **Secondary:** `var(--color-muted-foreground)` for secondary
- **Destructive:** `var(--color-destructive)` for delete/danger

---

## Animation Principles

### Transitions

- **Hover states:** 200–300ms ease-in-out
- **Modals:** 300ms fade-in, scale 0.9 → 1
- **Drawers:** 300ms slide from edge
- **Colors:** 200ms smooth transition

### Keyframe Animations

Examples in `src/app/globals.css`:

```css
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Performance Notes

- Use CSS transforms (translate, scale, rotate) over position changes
- Prefer `will-change` sparingly (only on heavy animations)
- Keep animations < 300ms for UI feedback
- Avoid animating layout properties (width, height, padding)

---

## Dark Mode Implementation

All components support automatic dark mode via CSS variables.

### How It Works

1. `ThemeProvider` (Next Themes) detects system preference or user toggle
2. Adds/removes `.dark` class on `<html>` element
3. CSS variables update via `:root` and `.dark` selectors
4. Components automatically adapt — no component changes needed

### Testing Dark Mode

```bash
# In browser DevTools console:
document.documentElement.classList.add('dark');    # Enable dark
document.documentElement.classList.remove('dark');  # Disable dark
```

### Component Example

```tsx
{/* No conditional rendering needed! */}
<div className="bg-[--color-background] text-[--color-foreground]">
  This automatically works in light and dark modes
</div>
```

---

## Design System Status

| Component | Status | Notes |
|-----------|--------|-------|
| Header | ✅ Complete | Responsive, all dropdowns functional |
| Hero | ✅ Complete | Full-width, responsive image |
| Tour Carousel | ✅ Complete | Filters, wishlist, fully responsive |
| Reviews | ✅ Complete | Tripadvisor-style grid |
| Experience Grids | ✅ Complete | 3 regions, portrait + grid layout |
| Services Carousel | ✅ Complete | 4 service cards, responsive |
| eTickets Form | ✅ Complete | Date/passenger selectors |
| YouTube Grid | ✅ Complete | Staggered smiley curve layout |
| About Section | ✅ Complete | Clothesline gallery |
| Newsletter | ✅ Complete | Subscription form + popups |
| Footer | ✅ Complete | Gradient background, all links |
| Mobile Menu | ✅ Complete | Mega menu, currency switcher |
| Wishlist Drawer | ✅ Complete | Persistent storage, LocalStorage |
| Currency Switcher | ✅ Complete | Dropdown, instant updates |
| Subscribe Popups | ✅ Complete | Success/fail/unsubscribe states |
| Filter Dropdowns | ✅ Complete | Multi-select for tours |

---

## Related Documentation

- `./codebase-summary.md` — Component file locations and structure
- `./code-standards.md` — Component code patterns and conventions
- `./system-architecture.md` — Data flow and technical design
