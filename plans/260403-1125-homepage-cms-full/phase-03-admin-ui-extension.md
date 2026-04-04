# Phase 3: Extend Admin Homepage — New Tabs + Section Config UI

## Context Links
- [Admin homepage page.tsx](../../src/app/admin/homepage/page.tsx) (215 lines, 4 tabs)
- [useAdminHomepage hook](../../src/hooks/use-admin-homepage.ts) (77 lines)
- [Admin slides page](../../src/app/admin/slides/page.tsx) (existing CRUD pattern)
- [Admin homepage tour dialog](../../src/components/admin/admin-homepage-tour-dialog.tsx) (dialog pattern)
- [Phase 1 types + defaults](./phase-01-section-registry.md)

## Overview
- **Priority**: P1
- **Status**: Pending
- **Effort**: 4h
- **Blocked by**: Phase 1 (needs types + constants)

Extend the admin homepage page from 4 tabs to 8 tabs: add "Cau hinh" (section config), "Experience", "Hero Slides" link, "About", "Newsletter", "eTickets". The section config tab provides reordering + visibility toggles.

## Key Insights

1. **Current admin homepage** is 215 lines with 4 tabs. Adding 4+ more tabs directly would exceed 200 lines. Must modularize.
2. **useAdminHomepage** hook fetches ALL settings at once. New sections mean more keys to fetch and more state to manage. Extend the hook.
3. **Hero Slides** already have a full admin page at `/admin/slides`. Don't duplicate — add a link/redirect to that page from the homepage admin. Or embed it. **Decision**: simple link, not a tab. Keeps it DRY.
4. **Experience** section stores all 3 regions under one key `homepage_experience`. Admin needs a region sub-tab or accordion.
5. **Section config** is the most complex new UI: needs ordering controls + visibility toggles + inline title editing for 12 sections.

## Architecture

### Tab Structure (new)

```
TABS (current):  tours | services | reviews | videos
TABS (new):      config | tours | services | reviews | videos | experience | about | newsletter | etickets
                 ^^^^^                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                 section ordering UI                            new content tabs
```

Plus a link to `/admin/slides` (not a tab — slides have their own CRUD page).

### Admin Page Modularization

Current `page.tsx` (215 lines) handles tab rendering + item table + dialogs. With 9 tabs this becomes unwieldy.

**Split into**:
- `page.tsx` — tab bar + router to tab content components (~80 lines)
- `admin-homepage-config-tab.tsx` — section config UI (new, ~150 lines)
- `admin-homepage-items-tab.tsx` — generic items table (extracted from current page.tsx, ~100 lines)
- Each new content section gets its own dialog component

### Hook Extension

Extend `useAdminHomepage` to:
- Fetch new keys: `homepage_experience`, `homepage_about`, `homepage_newsletter`, `homepage_etickets`, `homepage_sections_config`
- Expose `config` state + `updateConfig` method for section ordering
- Keep existing `addItem`/`editItem`/`removeItem` for array-type sections

### Section Config Data Flow

```
Admin "Cau hinh" tab
  --> user toggles visibility / reorders / edits title
  --> updateConfig(newConfig)
  --> upsertSetting("homepage_sections_config", newConfig)
  --> revalidatePath("/") [fixed in Phase 1]
  --> page.tsx re-renders with new order/visibility
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/app/admin/homepage/page.tsx` | Refactor: tab bar + delegate to tab components |
| `src/hooks/use-admin-homepage.ts` | Extend with new section keys + config state |

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/admin/admin-homepage-config-tab.tsx` | Section ordering, visibility toggles, title overrides |
| `src/components/admin/admin-homepage-items-tab.tsx` | Extracted generic items table + CRUD (reused by all array tabs) |
| `src/components/admin/admin-homepage-experience-dialog.tsx` | Dialog for experience tour item (per region) |
| `src/components/admin/admin-homepage-experience-tab.tsx` | Experience tab with region sub-tabs (North/Mid/South) |
| `src/components/admin/admin-homepage-about-dialog.tsx` | Dialog for about section (title, quote, images) |
| `src/components/admin/admin-homepage-newsletter-dialog.tsx` | Dialog for newsletter section (title, description) |
| `src/components/admin/admin-homepage-etickets-dialog.tsx` | Dialog for eTickets (title, cities[], passengers[]) |

### Files NOT changed
| File | Reason |
|------|--------|
| `src/app/admin/slides/page.tsx` | Already has full CRUD. Just link to it. |
| `src/components/admin/admin-sidebar.tsx` | No sidebar changes needed; Homepage link already exists |

## Implementation Steps

### Step 1: Extend useAdminHomepage hook (45 min)

**1a. Add new section types to hook**

```ts
// Extended SETTING_KEYS
const SETTING_KEYS = {
  tours: "homepage_tours",
  services: "homepage_services",
  reviews: "homepage_reviews",
  videos: "homepage_videos",
  experience: "homepage_experience",    // NEW
  about: "homepage_about",              // NEW
  newsletter: "homepage_newsletter",    // NEW
  etickets: "homepage_etickets",        // NEW
} as const;
```

**1b. Add config state**

```ts
const [config, setConfig] = useState<SectionConfig[]>([]);

// In useEffect fetch:
const rawConfig = map.homepage_sections_config;
setConfig(Array.isArray(rawConfig) ? rawConfig : DEFAULT_SECTIONS_CONFIG);
```

**1c. Add updateConfig method**

```ts
const updateConfig = useCallback(async (newConfig: SectionConfig[]) => {
  setSaving("config" as SectionKey);
  await upsertSetting("homepage_sections_config", newConfig);
  setConfig(newConfig);
  setSaving(null);
}, []);
```

**1d. Expand HomepageData type**

Add `experience`, `about`, `newsletter`, `etickets` fields. About/newsletter/etickets are single objects (not arrays), so the generic `addItem`/`editItem` pattern doesn't apply. Add a `saveSingleItem` method for these:

```ts
const saveSingleItem = useCallback(async (section: SingleSectionKey, data: unknown) => {
  setSaving(section);
  await upsertSetting(SETTING_KEYS[section], data);
  setData((prev) => ({ ...prev, [section]: data }));
  setSaving(null);
}, []);
```

**1e. File size check**: Hook is 77 lines currently. With additions ~120 lines. Under 200.

### Step 2: Extract items table component (30 min)

Create `src/components/admin/admin-homepage-items-tab.tsx`:
- Extract `ItemRow`, `getLabel`, `getSubLabel` from current page.tsx
- Accept props: `tab`, `items`, `loading`, `saving`, `onAdd`, `onEdit`, `onDelete`
- Render the table + "Them moi" button
- This component is reused by tours, services, reviews, videos tabs

### Step 3: Refactor admin homepage page.tsx (30 min)

Slim down to:
- Tab bar with all 9 tabs (+ link to /admin/slides)
- Switch statement rendering the active tab component
- Each tab component handles its own dialogs

```tsx
const TABS = [
  { key: "config", label: "Cau hinh" },
  { key: "tours", label: "Tour Packages" },
  { key: "services", label: "Dich vu" },
  { key: "reviews", label: "Danh gia" },
  { key: "videos", label: "YouTube" },
  { key: "experience", label: "Experience" },
  { key: "about", label: "About" },
  { key: "newsletter", label: "Newsletter" },
  { key: "etickets", label: "eTickets" },
];
```

Below the tabs, add a small link: `Hero Slides -> /admin/slides`

### Step 4: Build section config tab (60 min)

Create `src/components/admin/admin-homepage-config-tab.tsx`:

**UI Layout**:
```
+----------------------------------------------------+
| Section            | Visible | Order | Title        |
|----------------------------------------------------|
| [^] [v] Hero Slides       [toggle]  "Hero Slides"  |
| [^] [v] Tour Packages     [toggle]  "Tour Pack..." |
| [^] [v] Reviews           [toggle]  "Danh gia"     |
| ...                                                 |
+----------------------------------------------------+
| [Save Changes]                                      |
+----------------------------------------------------+
```

**Features**:
- List of 12 sections sorted by current order
- Up/down arrow buttons to reorder (swap with adjacent item)
- Toggle switch for visibility (shadcn Switch component)
- Inline text input for custom title (optional, placeholder = default label)
- "Save" button calls `updateConfig(config)`
- Visual indicator for hidden sections (greyed out row)

**State management**: local state copy of config array. User makes changes locally, then saves. This avoids partial saves on every click.

**Components needed**: `Switch` from shadcn (already installed? check). If not: `pnpm dlx shadcn@latest add switch`.

### Step 5: Build experience tab (45 min)

Create `src/components/admin/admin-homepage-experience-tab.tsx`:

- Sub-tabs for 3 regions: North, Mid, South
- Each region shows a list of tours + images (similar to the items table)
- Uses the existing `homepage_experience` CMS key which stores `Record<string, RegionData>`
- CRUD for tours within each region
- Image URL list editor (simple text inputs, one per image)

Create `src/components/admin/admin-homepage-experience-dialog.tsx`:
- Form for a single experience tour: title, price, tags
- Similar to tour dialog but simpler (fewer fields)

### Step 6: Build simple content dialogs (30 min)

**About dialog** (`admin-homepage-about-dialog.tsx`):
- Single form (not a list — about is one object, not an array)
- Fields: title (text), quote (textarea), desktopImage (url), teamImage (url), dragonImage (url), templeImage (url), cloudImage (url)
- Mobile photos: dynamic list of {src, alt, deg, left, top, stringH} — add/remove rows
- "Save" calls `saveSingleItem("about", formData)`

**Newsletter dialog** (`admin-homepage-newsletter-dialog.tsx`):
- Simplest dialog: title (text) + description (textarea)
- "Save" calls `saveSingleItem("newsletter", formData)`

**eTickets dialog** (`admin-homepage-etickets-dialog.tsx`):
- title (text)
- Cities: dynamic list of {value, label} pairs — add/remove rows
- Passengers: dynamic list of {value, label} pairs — add/remove rows
- "Save" calls `saveSingleItem("etickets", formData)`

**Note on single-item vs array**: About, Newsletter, eTickets are NOT arrays of items. They are single config objects. The admin UI shows a single "Edit" button that opens the dialog pre-filled with current data. No add/delete — just edit.

### Step 7: Verify (15 min)

- `pnpm typecheck`
- Manual test: open each new tab, verify data loads
- Manual test: edit section config, save, verify homepage reflects changes
- Check all existing tabs (tours, services, reviews, videos) still work

## Todo List

- [ ] Extend `useAdminHomepage` hook with new keys, config state, saveSingleItem
- [ ] Create `admin-homepage-items-tab.tsx` (extracted from page.tsx)
- [ ] Refactor `page.tsx` to tab bar + tab component router
- [ ] Create `admin-homepage-config-tab.tsx` (section ordering/visibility/titles)
- [ ] Create `admin-homepage-experience-tab.tsx` + dialog
- [ ] Create `admin-homepage-about-dialog.tsx`
- [ ] Create `admin-homepage-newsletter-dialog.tsx`
- [ ] Create `admin-homepage-etickets-dialog.tsx`
- [ ] Wire up single-item tabs (about, newsletter, etickets) in page.tsx
- [ ] Add "/admin/slides" link near tab bar
- [ ] `pnpm typecheck` passes
- [ ] Manual test all tabs

## Success Criteria

- Admin homepage has 9 working tabs + slides link
- Section config tab can reorder, toggle visibility, and set custom titles
- Experience tab manages all 3 regions with tour CRUD
- About/Newsletter/eTickets tabs edit their respective single-object configs
- All existing tabs (tours, services, reviews, videos) unchanged in behavior
- All files under 200 lines
- `pnpm typecheck` passes

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Admin page.tsx refactor breaks existing tabs | Medium | High | Extract items table first, verify existing tabs work before adding new ones |
| Too many tabs clutters the UI | Medium | Low | Group related tabs or use collapsible sections if needed post-launch |
| Switch component not installed | Low | Low | `pnpm dlx shadcn@latest add switch` |
| Hook becomes too large (>200 lines) | Medium | Medium | Split into `use-admin-homepage.ts` (array CRUD) + `use-admin-homepage-config.ts` (config) if needed |

## File Ownership (parallel safety)

This phase touches admin files only. Phase 2 touches section component files only. No file overlap — safe to run in parallel.

| This Phase Owns | Phase 2 Owns |
|----------------|--------------|
| `src/app/admin/homepage/*` | `src/components/sections/homepage/about-*` |
| `src/hooks/use-admin-homepage.ts` | `src/components/sections/homepage/newsletter-*` |
| `src/components/admin/admin-homepage-*` | `src/components/sections/homepage/etickets-*` |

## Security Considerations

- Admin pages are behind `/admin` route (no public access)
- All mutations go through `upsertSetting` server action
- No new API routes exposed
- TODO (future): admin auth middleware — currently no auth on admin pages
