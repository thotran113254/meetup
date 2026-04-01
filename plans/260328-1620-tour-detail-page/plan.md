# Tour Detail/Itinerary Page Implementation Plan

**Goal:** Implement `/tours/[slug]` page matching Figma node `13725:92879` — full itinerary page with image gallery, package info, day-by-day itinerary, pricing sidebar, reviews, and related packages.

**Figma:** `https://www.figma.com/design/V4UemzwwSm5FEe9FJteXDw/...?node-id=13725-92879`

**Status:** In Progress

---

## File Structure

```
src/
├── app/tours/[slug]/
│   └── page.tsx                                         # Dynamic route, server component
├── components/sections/tour-detail/
│   ├── tour-image-gallery.tsx                           # 1 large + 4 small images grid + breadcrumb
│   ├── tour-detail-info.tsx                             # Title, tags, overviews, places, description
│   ├── tour-itinerary-section.tsx                       # Collapsible day-by-day itinerary with timeline
│   ├── tour-pricing-sidebar.tsx                         # Sticky sidebar: prices, policies, budget planner
│   ├── tour-detail-reviews.tsx                          # Horizontal scroll review cards
│   └── tour-related-packages.tsx                        # "You Might Like" + "Most Liked" sections
```

## Layout (1600px page)

- Container: 1400px (100px padding each side)
- Two-column: main content (928px) + sidebar (456px, sticky)
- Sidebar starts at y=465 (aligned with info card top)
- Below two-column area: Reviews, Related Packages, Most Liked, Newsletter, Footer

## Phases

### Phase 1: Dev-1 — Page + Gallery + Info + Itinerary [PENDING]
- Files: page.tsx, tour-image-gallery.tsx, tour-detail-info.tsx, tour-itinerary-section.tsx

### Phase 2: Dev-2 — Sidebar + Reviews + Related [PENDING]
- Files: tour-pricing-sidebar.tsx, tour-detail-reviews.tsx, tour-related-packages.tsx

### Phase 3: Assembly + Build Verification [PENDING]
- Merge, typecheck, build, responsive check

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Card shadow | `0 0 40px rgba(0,0,0,0.06)` | Info card, sidebar cards |
| Card radius | `12px` | All cards |
| Tag bg | `#EBF8F8` | Tags (blue-50) |
| Section bg | `#F8F8F8` | Overview boxes, included/excluded lists |
| Children policy bg | `#EBF8F8` | Teal info box |
| Cancellation bg | `#FFFAED` | Yellow warning box |
| Divider | `#1D1D1D` at 5% opacity | Between sections |
| Text dark | `#1D1D1D` | Headings |
| Text gray | `#828282` | Body, descriptions |
| Text dark-gray | `#454545` | Labels (Accommodations, Meals) |
| Primary teal | `#3BBCB7` | Timeline dots, active states |
| Primary dark | `#194F4D` | Children policy title |
| Warning text | `#6B5420` | Cancellation title |
| Included check | teal circle check icon |
| Excluded x | red/orange circle x icon |
| Physical rating bars | #194F4D (filled) + #7CD2CF (unfilled) |
