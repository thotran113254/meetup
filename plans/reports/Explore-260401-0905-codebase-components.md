# Codebase Exploration Report: Meetup Travel Components

**Report Date:** 2026-04-01  
**Scope:** Component analysis of `/home/automation/meetup`

---

## 1. Destination Section Components

### Location: `/src/components/sections/destinations/`

#### **destination-hero-section.tsx** (85 lines)
- **Purpose:** Full-width hero banner with teal gradient overlay and marquee text
- **Features:**
  - Infinite-scrolling "DESTINATION" marquee with DT Phudu font
  - Teal gradient overlay on bottom (transparent to #3BBCB7)
  - Breadcrumb navigation with homepage link
  - Motion animations (fade-in + scale on mount)
  - Responsive: aspect-[343/257] mobile → md:aspect-[1546/487] desktop
  - Figma references: desktop 13842:14164, mobile 13856:60406

#### **destination-grid-section.tsx** (133 lines)
- **Purpose:** Grid of destination cards with pagination
- **Key Components:**
  - DestinationCard (internal) - image card with dark gradient overlay
  - 4 destination data (Hanoi, Danang, Halong, Ho Chi Minh)
  - Grid layout: 1 col mobile → md:2 cols → lg:4 cols
  - 12 items per page with 6 pages total pagination
  - Pagination buttons (teal active state)
  - Hover effect: image scale-105 on group-hover
  - Image dimensions with gradient overlay at bottom 55%
  - Figma: desktop 13842:14337, mobile 13856:60413

#### **destination-intro-section.tsx** (71 lines)
- **Purpose:** Spotlight section "Introduce about [City]" with city name and map
- **Layout:**
  - Left: title ("Introduce" + "about" in gold gradient Phudu font)
  - City name in red gradient script font (Dancing Script)
  - Description text overlay
  - Right: map placeholder (692x453px responsive)
- **Text Styling:**
  - Gold gradient for "Introduce about"
  - Red gradient for city name
- **Responsive:** flex-col mobile → lg:flex-row desktop

#### **destination-features-section.tsx** (77 lines)
- **Purpose:** 4 feature cards in gradient cards layout
- **Features:**
  - 4 features (Customized Itineraries, Customer Experience, Tech Enhanced, Language Barriers)
  - Each card: icon (SVG), title, description
  - Gradient background (light teal to white)
  - Grid: 2 cols mobile → lg:4 cols
  - ScrollReveal animation component
  - Figma: desktop 13854:15354, mobile 13856:60455

---

## 2. Tour Section Components

### Location: `/src/components/sections/tours/`

#### **tours-hero-section.tsx** (85 lines)
- **Purpose:** Full-width hero for tours page (identical structure to destination-hero-section)
- **Differences from destination hero:**
  - Marquee text: "TOUR PACKAGES" instead of "DESTINATION"
  - Image: `/images/tours-hero-banner.jpg`
  - Breadcrumb: "Tour Packages" instead of "Destination"
- **Features:** Motion animations, teal gradient, marquee text, breadcrumb

#### **vietnam-intro-section.tsx** (175 lines)
- **Purpose:** "Introduce About Vietnam" spotlight section on tours page
- **Complex Layout (Mobile vs Desktop):**
  - **Mobile:** title → stats-left + map-right (side by side) → video full-width → description
  - **Desktop:** overlapping layout with absolute positioning
    - Left z-10: title + stats below Vietnam name
    - Center: map (35% width, full height)
    - Right: video (33% width) + description
- **Stats:** 3 values (20 Million arrivals, #1 Growth, 9 Consecutive Years)
- **Media:**
  - Video thumbnail with play icon (YouTube SVG)
  - Vietnam map image (ban-do-viet-nam.png)
- **Typography:**
  - Gold gradient "Introduce about" (Phudu font)
  - Red gradient "Vietnam" (Dancing Script)
  - Stats in bold 14px/16px desktop
- **Figma:** desktop 13561:7611, mobile 13802:10561

#### **tour-package-grid-section.tsx** (130 lines)
- **Purpose:** Grid of tour packages with dual filters and pagination
- **Components:**
  - 12 tour cards in responsive grid
  - Two dropdown filters (Style, Duration)
  - FilterDropdown UI component
  - Pagination (6 pages, teal active)
- **Filters:**
  - Style: All, Cuisine, Motorbike, Car, Jeep car
  - Duration: All, < 5 Days, 5-7 Days, > 7 Days
  - Both dropdowns: full-width mobile → fixed 199px desktop
- **Grid Layout:** 1 col mobile → sm:2 cols → lg:4 cols
- **Card Size:** aspect-square mobile → sm:h-[516px] desktop

#### **most-liked-package-section.tsx** (205 lines)
- **Purpose:** Horizontal carousel of featured tour cards with "Overall Plan" popup
- **FeaturedCard Component (internal):**
  - Large card with image overlay and gradient
  - Eye icon (36x36 white rounded square) top-right
  - Price badge with teal gradient (linear-gradient 260.5deg)
  - Tags: duration, spots, custom tags (white pills with icons)
  - "Overall Plan" popup overlay with flights info
  - Mobile: 294x294px → Desktop: flex-1 + 516px height
- **Featured Tours Data:** 2 tours with flights count and description
- **Carousel:** snap-x snap-mandatory, horizontal scroll with nav arrows
- **Navigation:** Left/right ChevronLeft/Right buttons (black/50% hover)
- **Mobile Behavior:** snap-start + scrollbar-hide

#### **tour-faq-section.tsx** (155 lines)
- **Purpose:** Custom FAQ accordion with 8 items in 2-column layout
- **FaqAccordionItem Component (internal):**
  - **Custom implementation** (not using Radix Accordion)
  - State: isOpen boolean with toggle callback
  - Header button: numbered question, ChevronDown icon
  - Styling:
    - Closed: bg-[#F3F3F3] text-[#1D1D1D]
    - Open: bg-[#3BBCB7] text-white, icon rotate-180
  - Collapsible content: text-[#828282] on light bg
  - Rounded-xl styling
- **Layout:** flex flex-col md:flex-row
  - Mobile: single column
  - Desktop: 2 equal-width columns (left items 1-4, right items 5-8)
- **Default State:** First item in each column open (items 0 & 4)
- **Data:** 8 FAQ items with question/answer pairs

---

## 3. Tour Card Component

### Location: `/src/components/ui/tour-card.tsx` (96 lines)

#### **TourCard Component**
- **Type Definition:** `TourCardProps`
  - `image: string`
  - `title: string`
  - `price: number`
  - `duration: string` (e.g., "4D3N")
  - `spots: number`
  - `tags: string[]`
  - `slug: string`
  - `className?: string` (optional override)
- **Styling:**
  - Default size: 294x294px mobile → 338x516px desktop
  - snap-start for carousel context
  - rounded-[12px] overflow-hidden
  - Link-based component
- **Structure:**
  - Full-height background image
  - Eye icon: 36x36 white rounded-[8px] top-right
  - Gradient overlay: transparent → #1B5654 (h-[206px])
  - Bottom content (p-[16px]) with gap-[10px]:
    - Price badge (teal gradient linear-gradient(260.5deg, #3BBCB7 20%, #B1FFFC 71%))
    - Tag pills (white bg, rounded-[4px], h-[20px], Calendar/MapPin icons)
    - Title (text-[12px] bold white, truncate)
- **Hover Effect:** image scale-105 on group-hover
- **Responsive Sizes:** `sizes="338px"`

---

## 4. Homepage Section Components

### Location: `/src/components/sections/homepage/`

#### **hero-section.tsx** (35 lines)
- Simple fade-in + scale animation on mount
- Full-width responsive hero banner
- aspect-[343/257] mobile → md:aspect-[1546/487]
- Image: `/images/hero-banner.png`

#### **tour-package-section.tsx** (131 lines)
- **Purpose:** Horizontal scrollable carousel of tour packages
- **Features:**
  - 4 tour packages in cards
  - Duration filter dropdown (full-width mobile → 199px desktop)
  - "View all" teal button
  - Custom horizontal scroll hook: `useHorizontalScroll(354)`
  - Left/right nav arrows (black/50% hover) at card midpoint (258px)
  - snap-x snap-mandatory, scroll-smooth
- **Layout:** Title + "View all" button in header row
- **Carousel Navigation:** 
  - Hidden on mobile
  - Positioned absolutely at left/right with centering

#### **reviews-section.tsx** (267 lines)
- **Purpose:** Tripadvisor-branded review carousel
- **Review Type:**
  - id, name, date, title, body, photo, avatar
- **Components:**
  - ReviewCard (flex-none w-[241px], snap-start)
  - ReviewBody (custom scrollbar with thumb tracking)
  - StarRating (5 stars, gold color #FACC15)
  - TripadvisorBadge (verified badge overlay on avatar)
- **Features:**
  - Score badge "4.9 on" image (50px mobile → 62px desktop)
  - Tripadvisor logo in white card shadow-[0_0_40px_rgba(0,0,0,0.06)]
  - Custom scrollbar implementation (transform-based thumb movement)
  - Review photo (top 136px), avatar with badge, star rating, custom scrollbar content area
- **Carousel:** 
  - useHorizontalScroll(253) for 241px + 12px gap
  - Left/right nav arrows (hidden mobile)
  - Horizontal scroll with snap-x

#### **about-section.tsx** (151 lines)
- **Purpose:** Clothesline gallery + team composite section
- **Mobile (md:hidden):**
  - Curved wire SVG (teal #3bbcb7)
  - 4 individual photos hanging from wire with pins and strings
  - Each photo rotated as a unit (transform-origin: top center)
  - Teal border-2 rounded-xl frames
  - Different sizes: 22vw, 26vw (wide variant)
- **Desktop (hidden md:block):**
  - Pre-rendered composite image (about-us.png)
- **Bottom Composite Section:**
  - Dragon bridge (left, scaleX(-1))
  - Team photo center (centered, 140% mobile → 54% desktop)
  - Temple right side (32% width)
  - Cloud mist layers (2 layers for depth, one flipped)
  - White gradient fade at bottom (linear-gradient to top)
  - Overlapping z-index stacking

#### **services-section.tsx, experience-section.tsx, etickets-section.tsx, youtube-section.tsx, newsletter-section.tsx**
- Not detailed in this report (9 total homepage sections)

---

## 5. UI Components

### Location: `/src/components/ui/`

#### **accordion.tsx** (75 lines)
- **Primitive:** Radix UI (`@radix-ui/react-accordion`)
- **Exports:**
  - `Accordion` (Root wrapper)
  - `AccordionItem` (value prop, border-b border)
  - `AccordionTrigger` (flex, ChevronDown icon, rotate-180 on open)
  - `AccordionContent` (animation-based, pb-4 pt-0)
- **Styling:**
  - data-state=open/closed for animations
  - animate-accordion-up / animate-accordion-down CSS animations
- **Color:** Muted foreground text, border-border

#### **button.tsx** (65 lines)
- **CVA (Class Variance Authority)** based component
- **Variants:**
  - Sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg
  - Styles: default, destructive, outline, secondary, ghost, link
- **Features:**
  - Slot support (asChild prop)
  - Focus ring styling
  - Disabled state handling
  - SVG icon support with size control
  - Dark mode support
- **Default:** bg-primary text-primary-foreground

#### **tour-card.tsx**
- Documented above (Section 3)

#### **filter-dropdown.tsx** (93 lines)
- **Purpose:** Custom popup dropdown for filter selections
- **Props:**
  - open: boolean
  - onClose: callback
  - options: FilterOption[] (value, label)
  - selected: string
  - onSelect: callback
- **Styling:**
  - White bg, border #BDBDBD, rounded-xl
  - p-3 gap-3 flex flex-col
  - Dividers between items (h-px bg-#1D1D1D/5)
  - Selected: teal text + Check icon
  - Unselected: dark text
- **Behavior:**
  - Click outside closes dropdown (useEffect + event listener)
  - Exported options:
    - STYLE_OPTIONS: All, Cuisine, Motorbike, Car, Jeep car
    - DURATION_OPTIONS: All, < 5 Days, 5-7 Days, > 7 Days

#### **Other UI Components Found:**
- scroll-animations.tsx (ScrollReveal component)
- theme-toggle.tsx
- bento-grid.tsx
- form-field.tsx
- magic-card.tsx
- wishlist-drawer.tsx
- animated-gradient-text.tsx
- number-ticker.tsx
- particles-background.tsx
- subscribe-popup.tsx
- calendar.tsx
- select.tsx
- popover.tsx
- currency-switcher.tsx

---

## 6. Page Structures

### **tours/page.tsx** (45 lines)
- **Sections in Order:**
  1. ToursHeroSection
  2. VietnamIntroSection
  3. MostLikedPackageSection
  4. TourPackageGridSection
  5. ReviewsSection
  6. TourFaqSection
  7. NewsletterSection
- **Metadata:** Auto-generated with SEO utils
- **JsonLD:** Organization + Breadcrumb schema

### **destinations/page.tsx** (41 lines)
- **Sections in Order:**
  1. DestinationHeroSection
  2. DestinationIntroSection
  3. DestinationGridSection
  4. DestinationFeaturesSection
  5. NewsletterSection
- **Metadata:** Auto-generated with SEO utils
- **JsonLD:** Organization + Breadcrumb schema

---

## 7. Key Design Patterns & Styling

### **Color Palette (CSS Variables)**
- Primary: `--color-primary` (#3BBCB7 teal)
- Background: `--color-background`
- Foreground: `--color-foreground` (#1D1D1D)
- Muted: `--color-muted-foreground` (#828282, #BDBDBD)
- Secondary: `--color-secondary`

### **Typography**
- **Special Fonts:**
  - DT Phudu: Marquee text, "Introduce about" titles
  - Dancing Script: City names in red gradient
  - Inter: Default body text
- **Gradients:**
  - Gold gradient: "Introduce about" text
  - Red gradient: City/Vietnam names
  - Teal gradient: Price badges (linear-gradient(260.5deg, #3BBCB7 20%, #B1FFFC 71%))

### **Layout Utilities**
- `section-padding`: Standard section vertical padding
- `container-wide`: Max-width container with padding
- Breakpoints: sm, md, lg (Tailwind defaults)
- Grid systems: responsive cols (1 → 2 → 4)

### **Animation Patterns**
- ScrollReveal component with optional delay prop
- Framer Motion: fade-in + scale animations on mount
- Icon animations: ChevronDown rotate-180 on open
- Image hover: scale-105 with duration-300

### **Card/Component Sizes**
- Tour Card: 338x516px (desktop), 294x294px (mobile)
- Review Card: 241px width, snap-start
- Featured Card: flex-1 (desktop), 294x294px (mobile)

### **Gradient Overlays**
- **Teal gradient overlay:** `linear-gradient(to bottom, rgba(59,188,183,0) 0%, #3BBCB7 100%)`
- **Dark gradient overlay:** `linear-gradient(to bottom, rgba(29,29,29,0) 0%, #1D1D1D 100%)`
- **Light gradient (features):** `linear-gradient(to bottom, #EBF8F8 0%, white 100%)`

---

## 8. Key Hooks & Utilities Found

- `useHorizontalScroll(scrollAmount)`: Carousel scroll control
- `ScrollReveal`: Animation component for section reveals
- `cn()`: Classname utility (from @/lib/utils)

---

## 9. Important Notes

1. **Custom FAQ Implementation:** The tour-faq-section uses a custom accordion (not Radix), with manual state management and custom styling.

2. **Two Layout Patterns:**
   - Simpler destinations page (4 sections)
   - More complex tours page (7 sections) with carousel + featured spotlight

3. **Responsive Design:** All components follow mobile-first approach with progressive enhancement to desktop

4. **Image Handling:** Extensive use of Next.js `Image` component with proper sizing

5. **Accessibility:** Semantic HTML, aria-labels on buttons, sr-only for screen readers

6. **State Management:** React hooks (useState) for filters, pagination, accordion toggling

---

## File Inventory Summary

**Destination Sections (4):**
- destination-hero-section.tsx
- destination-grid-section.tsx
- destination-intro-section.tsx
- destination-features-section.tsx

**Tour Sections (5):**
- tour-faq-section.tsx
- vietnam-intro-section.tsx
- tours-hero-section.tsx
- tour-package-grid-section.tsx
- most-liked-package-section.tsx

**Homepage Sections (9):**
- hero-section.tsx
- tour-package-section.tsx
- reviews-section.tsx
- about-section.tsx
- newsletter-section.tsx
- services-section.tsx
- experience-section.tsx
- etickets-section.tsx
- youtube-section.tsx

**Core UI Components (18+):**
- tour-card.tsx (primary card component)
- accordion.tsx (Radix-based)
- button.tsx (CVA-based)
- filter-dropdown.tsx
- scroll-animations.tsx
- Plus 13 others

**Pages (2 detailed):**
- tours/page.tsx (7 sections)
- destinations/page.tsx (5 sections)
