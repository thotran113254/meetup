# Code Standards & Best Practices — Meetup Travel

**Last Updated:** March 27, 2026
**Framework:** Next.js 16 (App Router) + React 19
**Language:** TypeScript 5.9 (strict mode)

---

## Table of Contents

1. [File Organization](#file-organization)
2. [Naming Conventions](#naming-conventions)
3. [React & Component Patterns](#react--component-patterns)
4. [TypeScript Guidelines](#typescript-guidelines)
5. [Styling with Tailwind](#styling-with-tailwind)
6. [API Route Patterns](#api-route-patterns)
7. [Database & ORM](#database--orm)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Performance](#performance)
11. [Security](#security)
12. [Documentation](#documentation)

---

## File Organization

### Project Structure (Recommended)

```
src/
├── app/                          # Next.js App Router
│   ├── (public pages)/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx             # Admin layout (no header/footer)
│   │   ├── page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   └── contacts/
│   │       └── page.tsx
│   ├── api/                       # API routes
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   └── [slug]/
│   │   │       └── route.ts
│   │   ├── contacts/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── settings/
│   │       └── route.ts
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # Global styles
│   └── loading.tsx                # Root loading state
├── components/
│   ├── admin/
│   │   └── admin-sidebar.tsx
│   ├── forms/
│   │   └── contact-form.tsx
│   ├── layout/                    # Layout components (header, footer, etc)
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   ├── floating-social.tsx
│   │   └── mobile-menu.tsx
│   ├── providers/
│   │   └── theme-provider.tsx
│   ├── sections/                  # Page sections (reusable)
│   │   ├── homepage/
│   │   │   ├── hero-section.tsx
│   │   │   ├── tour-package-section.tsx
│   │   │   ├── reviews-section.tsx
│   │   │   ├── experience-section.tsx
│   │   │   ├── services-section.tsx
│   │   │   ├── etickets-section.tsx
│   │   │   ├── youtube-section.tsx
│   │   │   ├── about-section.tsx
│   │   │   └── newsletter-section.tsx
│   │   └── faq-section.tsx        # Reusable sections
│   ├── seo/
│   │   ├── json-ld-script.tsx
│   │   └── breadcrumbs.tsx
│   └── ui/                        # Base UI components (Button, Input, etc)
│       ├── button.tsx
│       ├── form-field.tsx
│       ├── tour-card.tsx
│       ├── magic-card.tsx
│       ├── filter-dropdown.tsx
│       ├── currency-switcher.tsx
│       ├── wishlist-drawer.tsx
│       ├── subscribe-popup.tsx
│       └── ...
├── config/
│   └── site-config.ts             # Single source of truth for config
├── db/
│   ├── connection.ts              # Database connection (lazy singleton)
│   ├── schema.ts                  # Drizzle ORM table definitions
│   └── queries/                   # Reusable query functions
│       ├── posts.ts
│       ├── contacts.ts
│       └── settings.ts
├── lib/
│   ├── api-auth.ts                # API authentication + rate limiting
│   ├── rate-limiter.ts            # Rate limiter implementation
│   ├── seo-utils.ts               # SEO utilities (metadata, JSON-LD)
│   ├── utils.ts                   # General utilities (cn())
│   ├── blog-data.ts               # Static fallback blog data
│   └── validations/
│       ├── post-schema.ts
│       ├── contact-schema.ts
│       └── settings-schema.ts
└── types/                         # Shared TypeScript types (optional)
    ├── post.ts
    └── contact.ts
```

### File Size Limits

- **Component files:** Keep under 200 lines of code
- **Utility files:** Keep under 300 lines
- **API route files:** Keep under 150 lines (split logic into separate utility files)
- **Page files:** Keep under 150 lines (compose from components)

**When to Split:**
- Component > 200 LOC → Extract logic into custom hooks or sub-components
- Utility file > 300 LOC → Split by feature/domain
- API route > 150 LOC → Move business logic to `lib/` utility

---

## Naming Conventions

### Files

| Type | Format | Example |
|------|--------|---------|
| **Components** | PascalCase.tsx | `SiteHeader.tsx`, `TourCard.tsx` |
| **Pages** | lowercase (auto-routing) | `page.tsx`, `layout.tsx` |
| **API routes** | lowercase, semantic | `route.ts` (in folder with path) |
| **Utilities** | kebab-case.ts | `api-auth.ts`, `seo-utils.ts` |
| **Hooks** | camelCase, prefix `use` | `usePaginationuseFilters.ts` |
| **Styles** | .css (global or module) | `globals.css`, `button.module.css` |
| **Database queries** | kebab-case or plural | `posts.ts`, `contact-submissions.ts` |

### Variables & Functions

```typescript
// Constants
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // SCREAMING_SNAKE_CASE
const siteTitle = "Meetup Travel";       // camelCase for strings

// Functions
function calculateTourPrice(basePrice: number): number { }
const fetchPosts = async () => { };
const handleSubmit = () => { };  // Event handlers prefix with "handle"

// React components
const SiteHeader = () => { };
const BlogPostCard = () => { };  // PascalCase for components

// Boolean variables
const isLoading = false;         // "is" or "has" prefix
const hasError = false;
const shouldShow = true;

// Arrays
const posts: Post[] = [];
const users: User[] = [];

// Objects
const config = { };              // Use lowercase for object instances
const tourFilters = { };
```

### CSS Classes

Use Tailwind CSS utility classes. For custom CSS, use kebab-case:

```css
/* Utility class (global) */
.section-padding {
  @apply py-16 md:py-24 lg:py-32;
}

.container-wide {
  @apply mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-[100px];
}

/* Custom component class (rare) */
.hero-banner {
  background: linear-gradient(...);
}

.hero-banner__title {  /* BEM variant naming if needed */
  font-size: 2.5rem;
}
```

---

## React & Component Patterns

### Default Pattern: Server Components

**Always use server components by default.** Only add `"use client"` when you need:
- Event handlers (`onClick`, `onChange`)
- Hooks (`useState`, `useEffect`, `useContext`)
- Browser APIs (`localStorage`, `window`)

```typescript
// ✅ GOOD — Server component by default
export default function BlogPostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-[12px] border border-border p-6">
      <h3 className="text-lg font-semibold">{post.title}</h3>
      <p className="text-muted-foreground">{post.excerpt}</p>
    </article>
  );
}
```

```typescript
// ❌ AVOID — Client component when not needed
"use client";
export default function BlogPostCard({ post }: { post: Post }) {
  return <article>...</article>;
}
```

### Client Component Pattern

Use `"use client"` only for interactive elements:

```typescript
"use client";

import { useState } from "react";

export function WishlistDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button onClick={handleOpen}>Wishlist</button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50" onClick={handleClose}>
          {/* Drawer content */}
        </div>
      )}
    </>
  );
}
```

### Component Structure

```typescript
// 1. Imports
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// 2. Type definitions
interface CardProps {
  title: string;
  children: ReactNode;
  variant?: "default" | "highlighted";
}

// 3. Component definition
export function Card({ title, children, variant = "default" }: CardProps) {
  return (
    <div className={cn("rounded-[12px] p-6", {
      "bg-secondary": variant === "highlighted",
    })}>
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  );
}
```

### Custom Hooks Pattern

Keep hooks small and focused:

```typescript
// lib/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      setValue(JSON.parse(stored));
    }
  }, [key]);

  const setStoredValue = (val: T) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, setStoredValue] as const;
}
```

Usage:
```typescript
const [wishlist, setWishlist] = useLocalStorage<Tour[]>("wishlist", []);
```

---

## TypeScript Guidelines

### Strict Mode (Enabled)

All TypeScript files use strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### Type Definitions

**Always** type function parameters and return types:

```typescript
// ✅ GOOD — Fully typed
function calculatePrice(
  basePrice: number,
  taxRate: number
): number {
  return basePrice * (1 + taxRate);
}

// ❌ AVOID — Missing types
function calculatePrice(basePrice, taxRate) {
  return basePrice * (1 + taxRate);
}
```

### Interface vs Type

Use `interface` for object shapes, `type` for unions/functions:

```typescript
// ✅ Object shape → interface
interface Post {
  id: number;
  title: string;
  content: string;
  publishedAt?: Date;
}

// ✅ Union type → type
type PostStatus = "draft" | "published" | "archived";

// ✅ Function type → type
type PostFetcher = (id: number) => Promise<Post>;
```

### Generics

Use generics for reusable utilities:

```typescript
// Generic API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic fetch function
async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Usage
const posts: ApiResponse<Post[]> = await fetchData<Post[]>("/api/posts");
```

### Enums (Use Sparingly)

Prefer union types over enums for simpler code:

```typescript
// ✅ GOOD — Union type
type PostStatus = "draft" | "published" | "archived";

// ❌ AVOID — Enum (adds runtime overhead)
enum PostStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}
```

---

## Styling with Tailwind

### CSS Variable Integration

All colors use CSS variables defined in `globals.css`:

```typescript
// ✅ GOOD — Use CSS variables
<button className="bg-[--color-primary] text-[--color-primary-foreground]">
  Subscribe
</button>

// ❌ AVOID — Hardcoded hex values
<button className="bg-[#2CBCB3] text-white">
  Subscribe
</button>
```

### Responsive Design

Mobile-first approach: style mobile by default, enhance with breakpoints:

```typescript
// ✅ GOOD — Mobile first
<div className="w-full md:max-w-[600px] lg:max-w-[1200px]">
  {/* Full width on mobile, constrained on larger screens */}
</div>

// ❌ AVOID — Desktop first
<div className="max-w-[1200px] sm:w-full">
  {/* Confusing order */}
</div>
```

### Using `cn()` Utility

Merge Tailwind classes conditionally:

```typescript
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export function Button({ variant = "primary", isLoading }: ButtonProps) {
  return (
    <button className={cn(
      "px-6 py-3 rounded-[12px] font-semibold transition-colors",
      variant === "primary" && "bg-[--color-primary] text-white hover:bg-[--color-primary-dark]",
      variant === "secondary" && "border border-border hover:bg-muted",
      isLoading && "opacity-50 cursor-not-allowed"
    )}>
      {isLoading ? "Loading..." : "Submit"}
    </button>
  );
}
```

### Custom CSS (Rare)

Only use custom CSS when Tailwind can't express it:

```css
/* globals.css */
.shimmer-loading {
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

Usage:
```typescript
<div className="shimmer-loading">Loading...</div>
```

---

## API Route Patterns

### Standard Route Handler

```typescript
// app/api/posts/route.ts
import { checkApiAccess } from "@/lib/api-auth";
import { getPosts, createPost } from "@/db/queries/posts";
import { postSchema } from "@/lib/validations/post-schema";

// GET /api/posts
export async function GET(request: Request) {
  const { valid, error } = await checkApiAccess(request);
  if (!valid) {
    return Response.json({ error }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const published = url.searchParams.get("published") === "true";

  try {
    const posts = await getPosts({ limit, published });
    return Response.json({ success: true, data: posts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: Request) {
  const { valid, error } = await checkApiAccess(request);
  if (!valid) {
    return Response.json({ error }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = postSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 422 }
      );
    }

    const newPost = await createPost(validation.data);
    return Response.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Dynamic Route Handler

```typescript
// app/api/posts/[slug]/route.ts
import { getPost, updatePost, deletePost } from "@/db/queries/posts";
import { checkApiAccess } from "@/lib/api-auth";
import { postSchema } from "@/lib/validations/post-schema";

// GET /api/posts/[slug]
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPost(params.slug);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: post });
  } catch (error) {
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug]
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { valid, error } = await checkApiAccess(request);
  if (!valid) {
    return Response.json({ error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = postSchema.partial().safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 422 }
      );
    }

    const updated = await updatePost(params.slug, validation.data);
    if (!updated) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: updated });
  } catch (error) {
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug]
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { valid, error } = await checkApiAccess(request);
  if (!valid) {
    return Response.json({ error }, { status: 401 });
  }

  try {
    const deleted = await deletePost(params.slug);
    if (!deleted) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## Database & ORM

### Drizzle Schema Definition

```typescript
// db/schema.ts
import { pgTable, serial, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").notNull().unique(),
  title: varchar("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  author: varchar("author"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  featuredImage: varchar("featured_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

### Lazy Database Connection

```typescript
// db/connection.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!db) {
    const client = new postgres({
      url: process.env.DATABASE_URL,
    });
    db = drizzle(client);
  }
  return db;
}
```

### Query Functions

Keep queries in separate files for reusability:

```typescript
// db/queries/posts.ts
import { getDb } from "@/db/connection";
import { posts, type Post, type NewPost } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPosts(options?: { limit?: number; published?: boolean }) {
  const db = await getDb();

  let query = db.select().from(posts);

  if (options?.published) {
    query = query.where(eq(posts.published, true));
  }

  return query.limit(options?.limit || 10);
}

export async function getPost(slug: string): Promise<Post | null> {
  const db = await getDb();
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  return result[0] || null;
}

export async function createPost(data: NewPost): Promise<Post> {
  const db = await getDb();
  const result = await db.insert(posts).values(data).returning();
  return result[0];
}

export async function updatePost(
  slug: string,
  data: Partial<NewPost>
): Promise<Post | null> {
  const db = await getDb();
  const result = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.slug, slug))
    .returning();

  return result[0] || null;
}

export async function deletePost(slug: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.delete(posts).where(eq(posts.slug, slug));
  return result.rowCount > 0;
}
```

---

## Error Handling

### Try-Catch Pattern

Always handle errors in async functions:

```typescript
export async function fetchAndProcessData(id: string) {
  try {
    const data = await fetch(`/api/posts/${id}`);
    if (!data.ok) {
      throw new Error(`API error: ${data.status}`);
    }
    return await data.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // Return fallback or re-throw
    return null;
  }
}
```

### API Error Responses

Standard error response format:

```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Human-readable error message",
  "details": [...]  // Optional: validation errors
}
```

HTTP Status Codes:
- `200` — OK
- `201` — Created
- `400` — Bad request (client error)
- `401` — Unauthorized (auth required)
- `403` — Forbidden (auth exists but denied)
- `404` — Not found
- `422` — Unprocessable entity (validation error)
- `429` — Too many requests (rate limited)
- `500` — Internal server error

### Client-Side Error Boundary

```typescript
"use client";

import { ReactNode } from "react";

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <div className="rounded border border-destructive bg-destructive/10 p-4">
      {children}
    </div>
  );
}
```

---

## Testing

### Unit Test Example (Jest + React Testing Library)

```typescript
// __tests__/Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByText("Click me"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
```

### API Route Test

```typescript
// __tests__/api/posts.test.ts
import { GET, POST } from "@/app/api/posts/route";

describe("POST /api/posts", () => {
  it("returns 401 without auth", async () => {
    const request = new Request("http://localhost/api/posts", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("creates post with valid auth", async () => {
    const request = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
      },
      body: JSON.stringify({
        title: "Test Post",
        slug: "test-post",
        content: "Content",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

---

## Performance

### Image Optimization

Always use Next.js `Image` component:

```typescript
import Image from "next/image";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="rounded-[12px] overflow-hidden">
      <Image
        src={tour.imageUrl}
        alt={tour.title}
        width={338}
        height={270}
        className="object-cover"
        priority={false}  // Set true only for above-the-fold images
      />
    </div>
  );
}
```

### Code Splitting

Use dynamic imports for heavy components:

```typescript
import dynamic from "next/dynamic";

// Lazy-load component (won't load until needed)
const YouTubeSection = dynamic(
  () => import("@/components/sections/homepage/youtube-section"),
  { loading: () => <div>Loading videos...</div> }
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <YouTubeSection />  {/* Loads on demand */}
    </>
  );
}
```

### Caching Strategy

Use ISR (Incremental Static Regeneration) for dynamic content:

```typescript
// app/blog/[slug]/page.tsx
import { revalidatePath } from "next/cache";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return <article>{/* ... */}</article>;
}

// Revalidate on POST (after mutation)
export async function POST(request: Request) {
  // ... create/update post
  revalidatePath(`/blog/${slug}`);  // Invalidate specific path
  revalidatePath("/blog");           // Invalidate listing
}
```

---

## Security

### Input Validation

Always validate with Zod:

```typescript
// lib/validations/post-schema.ts
import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
  excerpt: z.string().max(500).optional(),
  published: z.boolean().default(false),
});

// Usage in API route
const validation = postSchema.safeParse(body);
if (!validation.success) {
  return Response.json(
    { error: "Invalid input", details: validation.error.errors },
    { status: 422 }
  );
}
```

### API Authentication

Use bearer token in header:

```typescript
// lib/api-auth.ts
export async function checkApiAccess(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return { valid: false, error: "Missing or invalid Authorization header" };
  }

  const token = authHeader.slice(7);

  if (token !== process.env.API_SECRET_KEY) {
    return { valid: false, error: "Invalid API key" };
  }

  // Check rate limit
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimitResult = checkRateLimit(ip);

  if (!rateLimitResult.allowed) {
    return { valid: false, error: "Rate limit exceeded" };
  }

  return { valid: true };
}
```

### Environment Variables

Never expose secrets in frontend code:

```typescript
// ✅ GOOD — Backend only (API route)
export async function POST(request: Request) {
  const apiKey = process.env.API_SECRET_KEY;  // Safe (server-only)
  // ...
}

// ❌ AVOID — Frontend exposure
// Never put API_SECRET_KEY in NEXT_PUBLIC_* variables
// NEXT_PUBLIC_GA_ID is safe (GA key is public)
```

---

## Documentation

### JSDoc Comments

Add comments for complex functions:

```typescript
/**
 * Fetches posts from database with optional filtering.
 *
 * @param options - Query options
 * @param options.limit - Max number of posts (default: 10)
 * @param options.published - Filter only published posts
 * @returns Array of posts
 *
 * @example
 * const posts = await getPosts({ limit: 5, published: true });
 */
export async function getPosts(options?: {
  limit?: number;
  published?: boolean;
}): Promise<Post[]> {
  // ...
}
```

### Component Props Documentation

```typescript
interface TourCardProps {
  /** Tour object */
  tour: Tour;
  /** Callback when add to wishlist button clicked */
  onWishlistClick?: (tourId: number) => void;
  /** Show compact layout on mobile */
  compact?: boolean;
}

export function TourCard({
  tour,
  onWishlistClick,
  compact = false,
}: TourCardProps) {
  // ...
}
```

### README Files

Document non-obvious patterns:

```markdown
# Tour Package Section

## Features
- Carousel with snap scrolling
- Filter by style and duration
- Add to wishlist (localStorage)

## Usage
\`\`\`tsx
<TourPackageSection />
\`\`\`

## Props
No props — uses hardcoded tour data (TODO: fetch from API)

## Related
- `components/ui/tour-card.tsx` — Individual tour card
- `components/ui/filter-dropdown.tsx` — Filter UI
\`\`\`
```

---

## Common Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| **Client component by default** | Increases bundle size | Server component first, add "use client" only when needed |
| **Hardcoded hex colors** | Breaks dark mode, hard to rebrand | Use CSS variables (`var(--color-primary)`) |
| **`any` types** | Loses type safety | Always type explicitly |
| **Mixing concerns** | Hard to test, maintain | Separate UI, logic, data fetching |
| **Missing error handling** | Crashes silently | Always use try-catch in async functions |
| **No input validation** | Security vulnerability | Always validate with Zod |
| **Inline styles** | Unmaintainable | Use Tailwind CSS |
| **Magic numbers** | Unclear intent | Use named constants |
| **Long components (> 200 LOC)** | Hard to understand | Extract sub-components |
| **Missing TypeScript types** | Runtime errors | Type all parameters |

---

## Code Review Checklist

When reviewing code, ensure:

- [ ] TypeScript strict mode compliance
- [ ] All functions have type annotations
- [ ] Components < 200 LOC
- [ ] Server components used by default
- [ ] CSS variables for colors (no hardcoded hex)
- [ ] Proper error handling (try-catch)
- [ ] Input validation (Zod schemas)
- [ ] No console.error in production code
- [ ] Semantic HTML used
- [ ] Images use `next/image`
- [ ] No `any` types
- [ ] Comments for complex logic
- [ ] Tests added for new features
- [ ] Responsive design verified

---

## Related Documentation

- `./design-guidelines.md` — Design tokens, styling conventions
- `./codebase-summary.md` — File structure and component inventory
- `./system-architecture.md` — Technical architecture and data flow
