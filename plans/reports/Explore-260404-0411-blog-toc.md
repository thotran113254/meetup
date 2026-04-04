# Blog Post Page & Table of Contents Components - Complete Exploration

**Date**: 2026-04-04  
**Context**: Meetup project blog architecture and TOC implementation

---

## 1. Full File Contents

### File 1: Blog Post Page (Server Component)
**Path**: `/home/automation/meetup/src/app/(website)/blog/[slug]/page.tsx`

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata, buildArticleJsonLd } from "@/lib/seo-utils";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BlogDetailHeroSection } from "@/components/sections/blog/blog-detail-hero-section";
import { BlogDetailArticleSection } from "@/components/sections/blog/blog-detail-article-section";
import { MostLikedPackageSection } from "@/components/sections/tours/most-liked-package-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    authors: [post.author],
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = buildArticleJsonLd({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedAt: post.date,
    author: post.author,
  });

  return (
    <>
      <JsonLdScript data={articleSchema} />

      {/* Hero banner + breadcrumb */}
      <BlogDetailHeroSection
        postTitle={post.title}
        heroImage={post.image}
        heroAlt={post.title}
      />

      {/* Article body with sticky Table of Contents */}
      <BlogDetailArticleSection post={post} />

      {/* Most Liked Package carousel */}
      <MostLikedPackageSection />

      {/* Newsletter subscription */}
      <NewsletterSection />
    </>
  );
}
```

---

### File 2: Blog Detail Article Section (Client Component with TOC)
**Path**: `/home/automation/meetup/src/components/sections/blog/blog-detail-article-section.tsx`

```typescript
"use client";

import Image from "next/image";
import { Calendar, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { formatBlogDate, type BlogPost, type BlogSection } from "@/lib/blog-data";

/** Thin horizontal rule matching Figma Divider (opacity-5 on #1D1D1D) */
function Divider() {
  return <div className="h-px w-full bg-[#1D1D1D] opacity-5" />;
}

/** Desktop sticky Table of Contents sidebar (Figma node 13925:88202) */
function TocSidebar({ sections, activeId }: { sections: BlogSection[]; activeId: string }) {
  return (
    <aside className="bg-white rounded-xl shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] p-5 w-full">
      <p className="text-[16px] font-bold text-[#1D1D1D] tracking-[0.32px] mb-3">
        Table of contents
      </p>
      <Divider />
      {sections.map((s, i) => (
        <div key={s.id}>
          <a
            href={`#${s.id}`}
            className={`block py-3 text-[12px] font-medium leading-[1.2] transition-colors ${
              activeId === s.id ? "text-[#3BBCB7]" : "text-[#828282] hover:text-[#3BBCB7]"
            }`}
          >
            {s.subtitle}
          </a>
          {i < sections.length - 1 && <Divider />}
        </div>
      ))}
    </aside>
  );
}

/**
 * Mobile sticky bottom Table of Contents bar (Figma node 13925:87924).
 * Collapsed by default showing only the active subtitle; expand to see all.
 */
function MobileToc({ sections, activeId }: { sections: BlogSection[]; activeId: string }) {
  const [open, setOpen] = useState(false);
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)]">
      {/* Toggle button above panel */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="absolute -top-8 left-4 w-8 h-8 bg-white rounded-tl-lg rounded-tr-lg shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] flex items-center justify-center"
          aria-label="Collapse table of contents"
        >
          <ChevronUp className="w-4 h-4 text-[#1D1D1D]" />
        </button>
      )}

      {/* Header row — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 pt-3 pb-2 flex items-center justify-between cursor-pointer"
      >
        <p className="text-[16px] font-bold text-[#1D1D1D] tracking-[0.32px]">
          Table of contents
        </p>
        <ChevronUp
          className={`w-4 h-4 text-[#1D1D1D] transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>
      <Divider />

      {/* Expanded section list */}
      {open ? (
        <div className="px-4 pb-4">
          {sections.map((s, i) => (
            <div key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`block py-2 text-[14px] font-bold leading-[1.3] tracking-[0.14px] transition-colors ${
                  activeId === s.id ? "text-[#3BBCB7]" : "text-[#828282]"
                }`}
              >
                {s.subtitle}
              </a>
              {i < sections.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      ) : (
        <p className="px-4 pb-3 text-[14px] font-bold text-[#3BBCB7] tracking-[0.14px]">
          {active?.subtitle}
        </p>
      )}
    </div>
  );
}

interface Props {
  post: BlogPost;
}

/**
 * BlogDetailArticleSection — Two-column desktop layout (928px article + 456px sticky sidebar).
 * Mobile: single column with sticky bottom TOC bar.
 * Matches Figma nodes 13925:85942 (desktop) and 13925:86020 (mobile).
 */
export function BlogDetailArticleSection({ post }: Props) {
  const { sections } = post;
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  // Track which section is scrolled into view for TOC highlighting
  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <section className="w-full bg-white py-6 md:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[100px]">
          <div className="flex gap-4 items-start">
            {/* Article body */}
            <article className="flex-1 min-w-0 max-w-[928px] bg-white rounded-xl shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] p-5">
              {/* Date badge */}
              <div className="flex items-center gap-[3px] bg-[#F3F3F3] rounded-[8px] px-2 py-1 h-6 w-fit mb-4">
                <Calendar className="w-3 h-3 text-[#1D1D1D] shrink-0" />
                <span className="text-[10px] font-medium leading-[1.2] text-[#1D1D1D] overflow-hidden text-ellipsis">
                  {formatBlogDate(post.date)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-[24px] md:text-[32px] font-bold text-[#1D1D1D] leading-[1.2] tracking-[0.08px] mb-4">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-[14px] text-[#828282] leading-[1.5] tracking-[0.035px] mb-4">
                {post.excerpt}
              </p>

              <Divider />

              {/* Article sections */}
              {sections.map((section, i) => (
                <div key={section.id} id={section.id} className="mt-4 flex flex-col gap-4 scroll-mt-20">
                  <h2 className="text-[16px] md:text-[20px] font-bold text-[#1D1D1D] leading-[1.2] tracking-[0.05px]">
                    {section.subtitle}
                  </h2>
                  <div className="relative w-full h-[195px] md:h-[505px] rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={section.image}
                      alt={section.subtitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 888px"
                    />
                  </div>
                  {section.paragraphs.map((para, j) => (
                    <p key={j} className="text-[14px] text-[#828282] leading-[1.5] tracking-[0.035px]">
                      {para}
                    </p>
                  ))}
                  {i < sections.length - 1 && <Divider />}
                </div>
              ))}
            </article>

            {/* Desktop sticky sidebar — hidden on mobile */}
            {sections.length > 0 && (
              <div className="hidden lg:block w-[456px] shrink-0">
                <div className="sticky top-[90px]">
                  <TocSidebar sections={sections} activeId={activeId} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile sticky bottom TOC */}
      {sections.length > 0 && (
        <MobileToc sections={sections} activeId={activeId} />
      )}
    </>
  );
}
```

---

### File 3: Blog Detail Hero Section
**Path**: `/home/automation/meetup/src/components/sections/blog/blog-detail-hero-section.tsx`

```typescript
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  /** Post title shown as last breadcrumb item */
  postTitle: string;
  /** Hero banner image src */
  heroImage: string;
  /** Alt text for hero image */
  heroAlt: string;
}

/**
 * BlogDetailHeroSection — full-width hero banner with rounded corners + breadcrumb row.
 * Matches Figma node 13925:85935 (desktop) and 13925:86013 (mobile).
 * Desktop: 1546×487px image inside a 1600px container with 27px horizontal padding.
 * Mobile: 343×257px image with 16px padding.
 */
export function BlogDetailHeroSection({ postTitle, heroImage, heroAlt }: Props) {
  return (
    <section className="w-full bg-white">
      {/* Hero image — rounded xl, 487px desktop / 257px mobile */}
      <div className="px-4 sm:px-[27px] pt-4 sm:pt-[37px]">
        <div className="relative w-full max-w-[1546px] mx-auto overflow-hidden rounded-xl h-[257px] md:h-[487px]">
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1546px"
          />
        </div>
      </div>

      {/* Breadcrumb — Homepage > Blog > Post title */}
      <nav
        className="max-w-[1400px] mx-auto mt-3 lg:mt-4 px-4 sm:px-6 lg:px-[100px]"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[10px] md:text-[12px] font-medium leading-[1.2]">
          <li>
            <Link
              href="/"
              className="text-[#BDBDBD] hover:text-[#828282] transition-colors whitespace-nowrap"
            >
              Homepage
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-[#BDBDBD]" />
          </li>
          <li>
            <Link
              href="/blog"
              className="text-[#BDBDBD] hover:text-[#828282] transition-colors"
            >
              Blog
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-[#BDBDBD]" />
          </li>
          <li className="text-[#1D1D1D] line-clamp-1">{postTitle}</li>
        </ol>
      </nav>
    </section>
  );
}
```

---

### File 4: Blog Data Structure
**Path**: `/home/automation/meetup/src/lib/blog-data.ts` (excerpt)

```typescript
export type BlogSection = {
  id: string;
  subtitle: string;
  image: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  sections: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "workshop-lach-cach-flower-shop",
    title: "Wreath making and flower arrangement workshop - Lach Cach Flower Shop",
    excerpt: "Khám phá trải nghiệm làm vòng hoa...",
    date: "2025-06-12",
    author: "Grace Nguyen",
    category: "Trải nghiệm",
    readTime: "8 phút đọc",
    image: "/images/destinations/halong.jpg",
    sections: [
      {
        id: "gioi-thieu-workshop",
        subtitle: "Giới thiệu về workshop",
        image: "/images/exp-mid-1.jpg",
        paragraphs: [
          "Workshop làm vòng hoa tại Lach Cach Flower Shop...",
          "Buổi workshop kéo dài khoảng 2 tiếng...",
        ],
      },
      // ... more sections
    ],
  },
  // ... more posts
];
```

---

## 2. TOC Rendering Details

### **Desktop TOC (TocSidebar)**

**Rendering Method**: Server-side rendering via client component  
**Component Type**: Client component (`"use client"`)

```tsx
<div className="hidden lg:block w-[456px] shrink-0">
  <div className="sticky top-[90px]">
    <TocSidebar sections={sections} activeId={activeId} />
  </div>
</div>
```

**Key CSS Properties**:
- `sticky` positioning with `top-[90px]` (accounts for header height)
- Fixed width: 456px
- Hidden on screens < 1024px (`hidden lg:block`)
- `shrink-0` prevents flex container collapse

**Content Structure**:
- Header: "Table of contents" title
- Section links: `<a href="#${s.id}">`
- Dividers between items
- Active styling: text-[#3BBCB7]

---

### **Mobile TOC (MobileToc)**

**Rendering Method**: Client-side with state management  
**Component Type**: Stateful functional component

```tsx
<div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white 
               shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)]">
```

**Key CSS Properties**:
- `fixed` positioning at `bottom-0`
- Full width: `left-0 right-0`
- Z-index: `z-40` (above content)
- Hidden on screens >= 1024px (`lg:hidden`)

**Interaction States**:
1. **Collapsed** (default): Shows only active section title
2. **Expanded**: Shows full list of sections with dividers
3. Toggle via header button with animated ChevronUp icon

**Mobile-specific styling**:
- Font size: 14px (vs 12px desktop)
- Font weight: Bold (vs Medium desktop)
- Larger tap targets for touch

---

## 3. Current CSS/Positioning Approach

### Desktop Strategy: Sticky Sidebar
| Property | Value | Purpose |
|----------|-------|---------|
| `position` | `sticky` | Stays visible in viewport |
| `top` | `90px` | Offset from top (header height) |
| `width` | `456px` | Fixed width sidebar |
| `gap` | `4` (16px) | Space between article and sidebar |
| `shrink-0` | Applied | Prevents flex compression |

### Mobile Strategy: Fixed Bottom Drawer
| Property | Value | Purpose |
|----------|-------|---------|
| `position` | `fixed` | Overlays content |
| `bottom` | `0` | Anchored to bottom |
| `z-index` | `40` | Above main content |
| `left/right` | `0` | Full width |
| `max-height` | None (dynamic) | Expands based on content |

---

## 4. Mobile Handling

### Responsive Breakpoints
- **Mobile**: screens < 1024px (`lg:hidden`)
  - Single column article
  - Fixed bottom TOC drawer
  - Collapsible UI with toggle button
  
- **Desktop**: screens >= 1024px (`lg:block`)
  - Two-column layout
  - Sticky sidebar TOC
  - Always visible

### Touch Optimizations
- Button hit targets: 32px minimum (`w-8 h-8`)
- Toggle button positioned absolutely above drawer when open
- Click-to-close on section selection
- Full-width tap area for header toggle

### Scroll Behavior
```typescript
// Section scroll-margin for anchor navigation
className="scroll-mt-20" // Prevents sidebar overlap on mobile
```

---

## 5. Heading Extraction Method

### Current Approach: Pre-defined Sections
**NOT dynamic extraction** — TOC is built from structured data, not DOM parsing.

**Data Structure**:
```typescript
sections: BlogSection[] = [
  {
    id: "unique-id",           // Used as anchor (#unique-id)
    subtitle: "Section Title", // Displayed in TOC
    image: "...",
    paragraphs: ["...", "..."]
  }
]
```

**Anchor Generation**:
- Section divs receive `id={section.id}` attribute
- TOC links use `href={`#${s.id}`}`
- No h1/h2/h3 parsing from rendered content

**Active State Detection**:
```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((e) => e.isIntersecting);
      if (visible) setActiveId(visible.target.id);
    },
    { rootMargin: "-15% 0px -70% 0px" } // Triggers at 15% from top
  );
  sections.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
}, [sections]);
```

**Why This Approach?**
- Ensures TOC consistency with design requirements
- No parsing of HTML content structure
- Supports pre-defined hierarchy (not nested)
- Better SEO control (explicit meta)

---

## 6. Architecture Diagram

```
                    BlogPostPage [Server]
                            |
                    generateStaticParams()
                    generateMetadata()
                            |
        ┌───────────────────┼───────────────────┐
        |                   |                   |
    JsonLdScript      BlogDetailHero      BlogDetailArticle
                                                |
                                        [Client Component]
                                                |
                    ┌──────────────────────────┼────────────────┐
                    |                          |                |
                    |                    useEffect Hook         |
                    |                 (IntersectionObserver)     |
                    |                          |                |
            Article + Sections        Track activeId    TocSidebar/MobileToc
            (with id attributes)      (state update)    (activeId prop)
```

---

## 7. Key Implementation Points

### State Management
- **Single `activeId` state** in `BlogDetailArticleSection`
- Initialized to first section ID: `useState(sections[0]?.id ?? "")`
- Updated via Intersection Observer callback

### Event Handlers
```typescript
// Anchor links (no event handler — native navigation)
<a href={`#${s.id}`} ...>

// Mobile drawer toggle
<button onClick={() => setOpen((v) => !v)} ...>

// Section selection (closes mobile drawer)
<a href={`#${s.id}`} onClick={() => setOpen(false)} ...>
```

### Performance Considerations
- Intersection Observer with 200-entry batch capacity
- No debouncing (handles rapid scrolling)
- Cleanup on unmount: `observer.disconnect()`
- CSS classes use tailwind (compiled, not runtime)

---

## 8. Current Limitations

1. **Non-dynamic TOC**: Requires pre-defined sections array
2. **One-level nesting**: No sub-sections or nested hierarchy
3. **Fixed Desktop Width**: 456px sidebar not responsive
4. **Mobile Content Overlap**: Fixed positioning overlaps article (scroll-mt-20 helps)
5. **No Scroll-to-Top**: Only navigation within TOC
6. **IntersectionObserver Sensitivity**: Root margin of `-15% 0px -70% 0px` may feel imprecise
7. **No Analytics**: No tracking of TOC interactions

---

## 9. File Reference Summary

| File | Type | Role |
|------|------|------|
| `src/app/(website)/blog/[slug]/page.tsx` | Server | Route handler, metadata, params generation |
| `src/components/sections/blog/blog-detail-article-section.tsx` | Client | Article layout, TOC logic, state management |
| `src/components/sections/blog/blog-detail-hero-section.tsx` | Server | Hero image, breadcrumb navigation |
| `src/lib/blog-data.ts` | Data | BlogPost/BlogSection types, sample data |

