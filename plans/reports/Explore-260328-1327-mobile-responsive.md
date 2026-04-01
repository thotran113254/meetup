# Mobile Responsive Implementation Exploration

**Date:** 2026-03-28  
**Focus:** Current mobile responsive styles across homepage components

---

## 1. SITE HEADER (`src/components/layout/site-header.tsx`)

### Current Mobile Implementation
- **Layout:** Three-zone layout (Logo | Nav | Icons)
- **Sticky positioning:** `sticky top-0 z-50 w-full`
- **Header height:** `h-16` (fixed)
- **Padding:** `px-6` (mobile) → `lg:px-[100px]` (desktop)
- **Nav visibility:** `hidden md:flex` (hidden on mobile)
- **Mobile menu:** Hamburger icon toggle with `Menu` icon from lucide-react
- **Icon buttons:** `hidden md:flex` (currency/wishlist hidden on mobile, only hamburger shown)
- **Max-width:** `1400px` centered

### Mobile Specific Issues
- Header height is fixed at `h-16` (64px) - may be cramped on very small screens
- Padding changes from `px-6` to `lg:px-[100px]` - no explicit mobile padding refinement
- No explicit mobile-specific button sizing (40px icons are desktop-focused)

---

## 2. SITE FOOTER (`src/components/layout/site-footer.tsx`)

### Current Mobile Implementation
- **Wrapper:** `w-full px-[27px] pb-[27px]`
- **Footer card:** `rounded-[20px] p-10 flex flex-col gap-5`
- **Layout:** `flex flex-col lg:flex-row lg:justify-between` (stacked on mobile, row on desktop)
- **Columns gap:** `gap-8`
- **Max-width:** `1546px` centered
- **Decorative circle:** Positioned with fixed coordinates (may overflow on mobile)

### Mobile Specific Issues
- **Fixed padding:** `px-[27px]` and `p-10` may not scale well on very small viewports
- **No responsive text sizing:** All text is fixed (16px, 14px) regardless of screen size
- **Payment icons row:** `flex flex-wrap gap-[6px] w-[210px]` - width is fixed, won't adapt to mobile
- **Social icons:** `flex items-center gap-2` - no mobile-specific sizing
- **Contact section:** `w-[362px]` with `maxWidth: "100%"` fallback - hardcoded width may not be ideal
- **Missing:** No explicit mobile column stacking optimization

---

## 3. TOUR PACKAGE SECTION (`src/components/sections/homepage/tour-package-section.tsx`)

### Current Mobile Implementation
- **Section padding:** `section-padding` (= `py-8 md:py-12 lg:py-14`)
- **Title:** `text-[32px] font-bold` (no mobile sizing adjustment)
- **Title row:** `flex items-center justify-between gap-4 flex-wrap`
- **Filter & button:** `flex items-center gap-2`
- **Filter width:** Fixed `w-[199px]` (hardcoded)
- **Button width:** Fixed `w-[103px]` (hardcoded)
- **Carousel arrows:** `left-2 lg:-left-10` and `right-2 lg:-right-10` (positioned near edge on mobile)

### Mobile Specific Issues
- **Hardcoded widths:** Filter button `w-[199px]` and "View all" button `w-[103px]` don't scale
- **Fixed card width:** Cards are `flex-none` without mobile breakpoint adjustment
- **Arrow positioning:** Fixed `top-[258px]` assumes card height (516px) - may misalign on mobile
- **Missing:** No horizontal scroll padding for mobile

---

## 4. REVIEWS SECTION (`src/components/sections/homepage/reviews-section.tsx`)

### Current Mobile Implementation
- **Section padding:** `section-padding` (= `py-8 md:py-12 lg:py-14`)
- **Score badge:** `flex items-center justify-center gap-3 mb-5`
- **Carousel padding:** `px-6 lg:px-0` (6px padding on mobile, none on desktop)
- **Card width:** Fixed `w-[241px]` (hardcoded)
- **Arrow positioning:** `left-0 lg:-left-12` and `right-0 lg:-right-12`

### Mobile Specific Issues
- **Fixed card width:** Cards don't adapt to mobile screen size
- **Review body height:** Fixed `h-[88px]` with fixed scrollbar sizes - may cause overflow
- **Badge height:** Fixed `h-[60px]` - may be large on mobile
- **No mobile text sizing:** Avatar text (`text-sm`, `text-[0.625rem]`) doesn't scale

---

## 5. EXPERIENCE SECTION (`src/components/sections/homepage/experience-section.tsx`)

### Current Mobile Implementation
- **Section padding:** `py-6 md:py-8 lg:py-10`
- **Title:** `text-[32px] font-bold` (no mobile sizing)
- **Title row:** `flex items-center justify-between mb-5` (may wrap on small screens)
- **"View all" button:** `h-10 px-6` flex items-center justify-center
- **Layout wrapper:** `flex gap-4 overflow-x-auto sm:overflow-visible`
- **Portrait card:** `w-[280px] h-[500px] sm:w-[338px] sm:h-[600px]` (responsive sizes)
- **Grid layout:** `flex sm:grid sm:grid-cols-3 gap-4 flex-none sm:flex-1 sm:min-w-0`
- **Grid cards:** `w-[280px] sm:w-auto` (responsive width)

### Mobile Strengths ✓
- Portrait card has mobile-specific sizing (`w-[280px] h-[500px]`)
- Grid uses horizontal scroll on mobile, grid on desktop
- Grid cards adapt with `sm:w-auto`

### Mobile Issues
- **Section title:** 32px is large for mobile (could be 24px)
- **Hardcoded card heights:** Progress bars positioned at `top-[14px] left-[18px]` may not scale
- **Gap inconsistency:** `gap-4` (16px) between cards - no mobile-specific tightening

---

## 6. SERVICES SECTION (`src/components/sections/homepage/services-section.tsx`)

### Current Mobile Implementation
- **Section padding:** `section-padding`
- **Title:** `text-2xl sm:text-3xl font-bold` (responsive!)
- **Card width:** Fixed `w-[338px]` (hardcoded)
- **Card height:** Fixed `h-[338px]` (square)
- **Arrow positioning:** `left-2 lg:-left-10` and `right-2 lg:-right-10`

### Mobile Specific Issues
- **Fixed card width:** Cards don't adapt to mobile - no sm: breakpoint
- **Fixed height:** Creates square cards which may be too large on mobile
- **No mobile margin/padding adjustment**
- **Arrow positioning:** `top-[169px]` assumes fixed card height

---

## 7. YOUTUBE SECTION (`src/components/sections/homepage/youtube-section.tsx`)

### Current Mobile Implementation
- **Title:** `text-2xl sm:text-3xl font-bold` (responsive!)
- **Title padding:** `px-4` (mobile), `hidden md:grid grid-cols-5` (desktop)
- **Desktop layout:** `hidden md:grid grid-cols-5 gap-3 max-w-4xl mx-auto`
- **Mobile layout:** `flex gap-3 overflow-x-auto pb-4 md:hidden no-scrollbar`
- **Mobile card width:** `w-2/5 max-w-44` (percentage-based, responsive!)
- **Card aspect:** `aspect-[270/478]` (responsive)

### Mobile Strengths ✓
- Title is responsive (text-2xl sm:text-3xl)
- Cards use percentage width (`w-2/5`) for mobile
- Proper mobile/desktop layout switching
- Aspect ratio-based sizing (scales with viewport)

### Mobile Issues
- **Max-width cap:** `max-w-44` limits mobile card size
- **Image sizing:** `sizes="(min-width: 768px) 18vw, 60vw"` may not be optimal
- **Stagger offsets:** `mt-5`, `mt-10` are fixed pixel values

---

## 8. ETICKETS SECTION (`src/components/sections/homepage/etickets-section.tsx`)

### Current Mobile Implementation
- **Outer wrapper:** `overflow-x-clip`
- **Card layout:** `rounded-xl flex flex-col lg:flex-row`
- **Teal panel:** `w-full lg:w-[338px] h-[211px]` (full width on mobile, fixed width on desktop)
- **Form panel:** `flex-1 min-w-0 min-h-[211px] lg:h-[211px] rounded-xl lg:rounded-l-none`
- **Form structure:** `py-4 px-6` (responsive padding)
- **Form inputs row:** `flex flex-col xl:flex-row gap-2`
- **Date fields:** `w-[188px]` with `flex-1 xl:flex-none` fallback

### Mobile Strengths ✓
- Teal panel is full width on mobile
- Form layout stacks on mobile, side-by-side on desktop
- Uses `flex-1` for responsive field width
- Inputs stack vertically on mobile

### Mobile Issues
- **Fixed heights:** `h-[211px]` is hardcoded
- **Title sizing:** `text-5xl lg:text-6xl` - no mobile reduction
- **Date field width:** `xl:w-[188px]` assumes xl screens exist
- **Airplane image:** Fixed positioning `top: 60px left: 85px` may not align on mobile
- **Cloud images:** Fixed positioning with large negative offsets

---

## 9. ABOUT SECTION (`src/components/sections/homepage/about-section.tsx`)

### Current Mobile Implementation
- **Container:** `max-w-[524px] mx-auto px-4` (centered, responsive padding)
- **Heading:** `pt-8 md:pt-12 lg:pt-14`
- **Title:** `text-[32px]` (no mobile sizing)
- **Clothesline image:** `w-full h-auto` (responsive!)
- **Composite height:** `h-[280px] sm:h-[350px] md:h-[435px]` (responsive!)
- **Dragon bridge:** `left-[4%]`, `w-[29%]`, `h-[84%]` (percentage-based)
- **Team photo:** `w-[54%]`, `h-[107%]` (percentage-based)
- **Temple:** `w-[32%]`, `h-[78%]` (percentage-based)

### Mobile Strengths ✓
- Composite section has responsive height
- Uses percentages for positioning (scales with viewport)
- Clothesline image is fully responsive
- Cloud layers scale appropriately

### Mobile Issues
- **Title size:** 32px is large for mobile
- **Top padding:** `pt-8 md:pt-12 lg:pt-14` - could be smaller on mobile
- **Fixed image positioning:** `top: "-130%"`, `left: 0` etc. use fixed percentages

---

## 10. NEWSLETTER SECTION (`src/components/sections/homepage/newsletter-section.tsx`)

### Current Mobile Implementation
- **Section padding:** `section-padding`
- **Card:** `max-w-[928px] mx-auto rounded-xl px-4 py-8 sm:p-[60px]`
- **Card layout:** `flex flex-col md:flex-row gap-5 items-start`
- **Left section:** `flex-1 min-w-0 flex flex-col gap-3`
- **Title:** `text-[32px] font-bold` (no mobile sizing)
- **Form:** `flex-1 w-full flex flex-col gap-3`
- **Input styling:** `w-full bg-white h-10 rounded-xl px-3 py-2 text-xs`

### Mobile Specific Issues
- **Fixed title:** 32px is too large on mobile
- **Card padding:** Shifts from `px-4 py-8` (mobile) to `p-[60px]` (desktop) - could be more granular
- **Form inputs:** `text-xs` might be small on mobile
- **Airplane icon:** Fixed `w-[46px] h-[40px]` with rotation may overflow on mobile
- **No mobile column gap optimization**

---

## 11. GLOBAL STYLES (`src/app/globals.css`)

### Current Implementation
```css
/* Section spacing utility */
.section-padding {
  @apply py-8 md:py-12 lg:py-14;
}

/* Container utility */
.container-narrow {
  @apply mx-auto max-w-4xl px-4 sm:px-6 lg:px-8;
}

.container-wide {
  @apply mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-[100px];
}
```

### Mobile Responsive Strategy
- **Breakpoints used:** `sm:` (640px), `md:` (768px), `lg:` (1024px)
- **Padding strategy:** `px-4` (mobile), `sm:px-6`, `lg:px-8` or `lg:px-[100px]`
- **No custom media queries:** All responsive styling via Tailwind

### Issues
- **Missing `xs` breakpoint:** No ultra-small screen handling (< 640px)
- **No mobile-first text sizing:** Many components use fixed sizes
- **No aspect ratio utilities:** Hardcoded aspect ratios in components
- **No gap scalability:** Many sections use fixed `gap-4` without mobile variants

---

## 12. MAIN HOMEPAGE (`src/app/page.tsx`)

### Structure
1. Hero Section
2. Tour Package Section
3. Reviews Section
4. Experience Section (3 regions: North, Mid, South)
5. Services Section
6. eTickets Section
7. YouTube Section
8. About Section
9. Newsletter Section

### Mobile Flow Issues
- **No explicit mobile-optimized sections**
- **Sequential rendering** - all sections stack vertically
- **No lazy loading** for sections below fold
- **No responsive container** wrapping

---

## SUMMARY OF MOBILE RESPONSIVE ISSUES

### Critical Issues
1. **Fixed text sizes:** Many titles are `text-[32px]` without mobile reduction
2. **Hardcoded widths:** Carousel cards (`w-[338px]`, `w-[241px]`) don't adapt to mobile
3. **Fixed heights:** Section heights assume desktop dimensions
4. **Arrow positioning:** Carousel arrows positioned with fixed pixel values
5. **Hardcoded spacing:** Many paddings and margins are fixed values

### Moderate Issues
6. Container padding shifts too dramatically (`px-6 lg:px-[100px]`)
7. No responsive text sizing for body copy
8. Fixed element positioning in composite sections may misalign
9. Button widths are hardcoded instead of responsive

### Minor Issues
10. No xs breakpoint for ultra-small screens
11. Stagger offsets use fixed values instead of responsive classes
12. Some image aspect ratios hardcoded instead of using responsive sizing
13. Mobile-specific icon sizing not optimized

---

## RECOMMENDATIONS FOR MOBILE ALIGNMENT WITH FIGMA DESIGN

1. **Add mobile title sizing** - Create `sm:text-2xl` or `sm:text-xl` variants
2. **Responsive card widths** - Use `sm:w-full` or percentage-based widths
3. **Flexible padding** - Adjust section padding for mobile (`py-4 sm:py-6 md:py-8`)
4. **Text scaling** - Reduce font sizes on mobile (e.g., `sm:text-sm` for body)
5. **Responsive arrows** - Use screen height-based positioning instead of fixed pixels
6. **Container refinement** - Reduce padding variance between mobile and desktop
7. **Aspect ratio consistency** - Use CSS aspect-ratio instead of hardcoded heights
8. **Gap scalability** - Implement mobile-specific gap sizes for carousels

