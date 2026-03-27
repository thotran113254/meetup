# System Architecture — Meetup Travel

**Last Updated:** March 27, 2026
**Stack:** Next.js 16 + React 19 + PostgreSQL + Drizzle ORM
**Status:** MVP Production-Ready

---

## Architecture Overview

Meetup Travel follows a **full-stack JavaScript/TypeScript architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  (React 19 + Tailwind CSS + Framer Motion)                     │
│  Browser → LocalStorage (wishlist, currency, preferences)      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                            │
│  (Next.js App Router + Middleware)                             │
│  Authentication | Rate Limiting | Validation | Response        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                         │
│  (Server-side utilities + Query functions)                     │
│  DB Queries | SEO Generation | Data Transformations           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Data Layer                                  │
│  (PostgreSQL + Drizzle ORM)                                   │
│  Posts | Contacts | Settings                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer Breakdown

### 1. Client Layer (Frontend)

**Technology:** React 19, Tailwind CSS, Framer Motion, Radix UI

**Responsibilities:**
- Render UI components
- Handle user interactions (clicks, form submits)
- Manage client-side state (useState, useContext)
- Persist user preferences (localStorage)
- Fetch data from API

**Key Components:**
- **Layout Components:** Header, Footer, Mobile Menu, Floating Social
- **Section Components:** Hero, Tours, Reviews, Experiences, Services, eTickets, YouTube, About, Newsletter
- **UI Components:** Button, Form Fields, Modals, Carousels, Dropdowns
- **Providers:** Theme Provider (dark/light mode)

**Data Flow:**
```
User Action (click, type, submit)
    ↓
Event Handler (onClick, onChange, onSubmit)
    ↓
Update State (setState, dispatch)
    ↓
Fetch API (if needed)
    ↓
Re-render Component
    ↓
LocalStorage Update (if needed)
```

**Example: Add to Wishlist**
```
1. User clicks "Add to Wishlist" button
2. TourCard component captures click event
3. Handler calls setWishlist([...wishlist, tour])
4. Component re-renders with ❤️ icon change
5. useLocalStorage hook updates localStorage['wishlist']
6. Drawer component reads from localStorage to display items
```

### 2. API Gateway Layer

**Technology:** Next.js App Router, API Routes

**Location:** `src/app/api/`

**Responsibilities:**
- Handle HTTP requests (GET, POST, PUT, DELETE)
- Authenticate requests (Bearer token)
- Validate input (Zod schemas)
- Enforce rate limiting
- Format responses
- Cache control headers

**Key Routes:**

```
GET  /api/posts                    ← List posts
POST /api/posts                    ← Create post
GET  /api/posts/[slug]             ← Get single post
PUT  /api/posts/[slug]             ← Update post
DELETE /api/posts/[slug]           ← Delete post

GET  /api/contacts                 ← List submissions
PUT  /api/contacts/[id]            ← Toggle read status
DELETE /api/contacts/[id]          ← Delete submission

GET  /api/settings                 ← Get all settings
PUT  /api/settings                 ← Upsert setting

POST /api/seo/audit                ← Run SEO analysis
```

**Middleware Flow:**
```
Incoming Request
    ↓
[Authorization Check] → 401 if missing/invalid
    ↓
[Rate Limit Check] → 429 if exceeded
    ↓
[Body Parsing] → application/json
    ↓
[Input Validation] → 422 if invalid
    ↓
[Business Logic]
    ↓
[Cache Revalidation] (if mutation)
    ↓
[Response Formatting]
    ↓
Client
```

**Example: POST /api/posts**
```typescript
1. Receive request with Authorization header
2. Call checkApiAccess() → verify token + rate limit
3. Parse JSON body
4. Validate with postSchema (Zod)
5. Call createPost() DB function
6. Call revalidatePath() for ISR
7. Return { success: true, data: newPost }
```

### 3. Business Logic Layer

**Technology:** TypeScript utilities, Drizzle ORM

**Location:** `src/lib/`, `src/db/queries/`

**Responsibilities:**
- Reusable data fetching functions
- Input validation schemas
- API authentication logic
- Rate limiting
- SEO utilities (metadata, JSON-LD)
- Data transformations

**Key Utilities:**

| File | Purpose |
|------|---------|
| `lib/api-auth.ts` | Bearer token auth + rate limit check |
| `lib/rate-limiter.ts` | In-memory IP-based rate limiting |
| `lib/seo-utils.ts` | Metadata generation + JSON-LD builders |
| `lib/utils.ts` | General utilities (cn(), etc) |
| `lib/validations/*.ts` | Zod schemas for validation |
| `db/queries/*.ts` | Reusable DB query functions |

**Example: Rate Limiting**
```typescript
const limiter = new RateLimiter({ maxRequests: 100, windowMs: 60000 });

export async function checkApiAccess(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  if (!limiter.isAllowed(ip)) {
    return { valid: false, error: "Rate limit exceeded" };
  }

  // ... verify token
  return { valid: true };
}
```

### 4. Data Layer

**Technology:** PostgreSQL, Drizzle ORM

**Location:** `src/db/`

**Responsibilities:**
- Store and retrieve application data
- Enforce data integrity (constraints)
- Provide query interface (Drizzle)

**Database Schema:**

```sql
-- Blog Posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  excerpt TEXT,
  content TEXT,
  author VARCHAR,
  featured_image VARCHAR,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact Submissions
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  subject VARCHAR,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Site Settings (key-value store)
CREATE TABLE site_settings (
  key VARCHAR UNIQUE PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Drizzle Schema:**
```typescript
// src/db/schema.ts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").notNull().unique(),
  title: varchar("title").notNull(),
  // ... other columns
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

**Connection Pattern (Lazy Singleton):**
```typescript
let db: Drizzle | null = null;

export async function getDb() {
  if (!db) {
    const client = new postgres({ url: process.env.DATABASE_URL });
    db = drizzle(client);
  }
  return db;
}
```

Why lazy? Build-time database connections fail. This ensures DB only connects when needed (at request time).

---

## Request-Response Cycle

### Server-Side Rendering (SSR)

**For dynamic pages:** `/blog/[slug]`

```
1. User visits /blog/my-post
2. Next.js routes to page.tsx
3. Component imports getPost() function
4. getPost() is async, so page becomes async component
5. getPost() calls getDb() → connects to DB
6. Query: SELECT * FROM posts WHERE slug = 'my-post'
7. Render component with post data
8. Send HTML to browser (fully rendered)
9. React hydrates on client (attaches event listeners)
```

**Code:**
```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 60;  // ISR: revalidate every 60 seconds

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);  // ← Runs on server

  if (!post) return notFound();

  return <article>{/* ... */}</article>;  // ← HTML sent to client
}
```

### Static Site Generation (SSG)

**For the homepage:** `/`

```
1. Next.js builds site (npm run build)
2. Homepage is mostly static (hero, services, etc)
3. generateStaticParams() could pre-render blog posts
4. Each page generates to HTML file
5. Server serves pre-generated HTML (very fast)
6. React hydrates on client
```

**Build Output:**
```
.next/static/pages/
├── index.html              (homepage)
├── blog/index.html         (blog listing)
├── blog/my-post.html       (individual post)
└── ...
```

### Incremental Static Regeneration (ISR)

**For dynamic content with caching:**

```
1. User visits /blog/my-post
2. If cached HTML exists and < 60 seconds old → serve cached
3. If cached > 60 seconds old → serve stale HTML while revalidating
4. In background, regenerate HTML (no user wait)
5. Next request gets fresh HTML
```

**Cache Invalidation:**
```typescript
// When post is updated via API
export async function PUT(request, { params }) {
  const updated = await updatePost(params.slug, data);

  revalidatePath(`/blog/${params.slug}`);  // ← Invalidate immediately
  revalidatePath("/blog");                 // ← Also invalidate listing

  return Response.json({ data: updated });
}

// Next request gets fresh page
```

### API Route with Database

**Example: GET /api/posts**

```
1. Browser fetch GET /api/posts?limit=10
2. Next.js routes to app/api/posts/route.ts
3. Handler function: export async function GET(request)
4. Extract query params: const limit = url.searchParams.get("limit")
5. Check auth: const { valid } = await checkApiAccess(request)
6. If not valid → return 401
7. Query DB: const posts = await getPosts({ limit: 10 })
8. Format response: Response.json({ success: true, data: posts })
9. Browser receives JSON response
10. React state updates (if fetched from component)
11. Component re-renders with new data
```

**Code:**
```typescript
// app/api/posts/route.ts
export async function GET(request: Request) {
  const { valid, error } = await checkApiAccess(request);
  if (!valid) return Response.json({ error }, { status: 401 });

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "10");

  const posts = await getPosts({ limit });
  return Response.json({ success: true, data: posts });
}
```

---

## Data Flow Diagrams

### Homepage Wishlist Interaction

```
User clicks "Add to Wishlist"
        ↓
TourCard component (client)
        ↓
onClick handler → setWishlist([...wishlist, tour])
        ↓
useLocalStorage hook
        ↓
localStorage.setItem("wishlist", JSON.stringify(newWishlist))
        ↓
Component re-renders
        ↓
Heart icon changes color (filled)
        ↓
WishlistDrawer component re-renders with new item
        ↓
LocalStorage persistent (survives page reload)
```

### Blog Post Creation (API)

```
Admin fills form in admin/posts/new
        ↓
handleSubmit() event
        ↓
fetch POST /api/posts {
  Authorization: Bearer <API_SECRET_KEY>
  body: { title, slug, content, ... }
}
        ↓
API Route: POST /app/api/posts/route.ts
        ↓
checkApiAccess() → validate token + rate limit
        ↓
postSchema.safeParse(body) → validate input
        ↓
createPost(validData) → DB insert
        ↓
revalidatePath("/blog") → clear cache
        ↓
Response.json({ success: true, data: newPost })
        ↓
Client receives response
        ↓
Client redirects to admin/posts (success)
        ↓
Admin sees new post in list (refetched)
```

### Currency Converter (Client-Side)

```
User selects "GBP" from currency dropdown
        ↓
CurrencySwitcher component (client)
        ↓
onChange handler → setCurrency("GBP")
        ↓
useLocalStorage("currency", "GBP")
        ↓
All prices re-calculate based on exchange rate
        ↓
Tour cards, service cards update
        ↓
Persist to localStorage["currency"]
        ↓
Page reload → currency preference restored
```

---

## Rendering Strategy Decision Tree

**When to use each rendering strategy:**

```
Is the page content dynamic?
│
├─ No (about, terms, privacy)
│  └─ Static Site Generation (SSG)
│     Build once, serve forever
│     Revalidate: Manual via revalidatePath()
│
├─ Yes, but can wait 60 seconds
│  └─ Incremental Static Regeneration (ISR)
│     Cache for N seconds, then revalidate in background
│     Example: Blog posts, tour listings
│     revalidate = 60;  // in seconds
│
└─ Yes, needs real-time updates
   └─ Server-Side Rendering (SSR)
      Render on each request
      Example: Admin pages, user-specific content
      async function BlogPost({ params })
```

---

## Caching Strategy

### Browser Cache
```
Static assets (images, CSS, JS):
- Cache-Control: public, max-age=31536000 (1 year)
- Served via CDN (Vercel)

HTML pages:
- Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
- Served stale if backend is slow
```

### Next.js ISR Cache
```
POST /api/posts → create post
        ↓
revalidatePath("/blog")  // Clear /blog cache
revalidatePath("/blog/[slug]")  // Clear all /blog/* caches
        ↓
Next request to /blog → regenerate HTML
        ↓
Store in .next/cache/
```

### Database Query Cache
```
None currently (queries execute on each request).

Could optimize with:
- Redis cache layer
- Query result memoization
- Database indexes on frequently queried columns
```

---

## Authentication & Authorization

### API Authentication (Bearer Token)

**Flow:**
```
Client requests /api/posts with Authorization header
        ↓
Authorization: Bearer <API_SECRET_KEY>
        ↓
checkApiAccess() middleware extracts token
        ↓
Compare with process.env.API_SECRET_KEY
        ↓
If match → proceed
If no match → return 401 Unauthorized
```

**Security Notes:**
- Token stored in `process.env.API_SECRET_KEY` (not in code)
- Transmitted via HTTPS only (must use https)
- No token expiration (TODO: implement JWT with TTL)
- All mutations require valid token

### Admin Dashboard (TODO)

**Not implemented yet. Plan:**
- Admin login form
- Session stored in secure HTTP-only cookie
- Check session in admin routes
- Redirect to login if not authenticated

---

## Performance Optimizations

### 1. Image Optimization

**Problem:** Large images slow page load
**Solution:** Next.js `Image` component

```typescript
import Image from "next/image";

<Image
  src="/tour-1.jpg"
  alt="Tour name"
  width={338}
  height={516}
  priority={false}  // Lazy load
/>
```

**What it does:**
- Auto-detects viewport size
- Serves WebP if supported
- Resizes to exact dimensions
- Lazy loads off-screen images
- Adds blur placeholder option

### 2. Code Splitting

**Problem:** Large JavaScript bundle
**Solution:** Dynamic imports

```typescript
const YouTubeSection = dynamic(
  () => import("@/components/sections/homepage/youtube-section"),
  { loading: () => <div>Loading...</div> }
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <YouTubeSection />  {/* Chunk loaded on demand */}
    </>
  );
}
```

### 3. CSS Optimization

**Problem:** Unused CSS in bundle
**Solution:** Tailwind CSS purges unused classes

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  // Build only classes used in these files
};
```

### 4. Server Components

**Problem:** Large client bundle (too much JavaScript)
**Solution:** Server components by default

```typescript
// ✅ Server component (shipped as HTML, no JS overhead)
export default function BlogPostCard({ post }) {
  return <article>{post.title}</article>;
}

// vs

// ❌ Client component (shipped as JavaScript, hydrated on browser)
"use client";
export default function BlogPostCard({ post }) {
  const [saved, setSaved] = useState(false);
  return (
    <article onClick={() => setSaved(!saved)}>
      {post.title}
    </article>
  );
}
```

---

## Scalability Considerations

### Current Limitations

1. **Rate Limiter:** In-memory (resets on server restart)
   - **Solution:** Use Redis cache layer

2. **Database Connections:** Single lazy connection
   - **Solution:** Use connection pooling (PgBouncer)

3. **Static Assets:** Served from disk
   - **Solution:** Use CDN (Vercel auto-handles this)

4. **Search:** No full-text search
   - **Solution:** Use Algolia or database FTS

### Scaling Path

**Phase 1 (Current):** Single server, single database
```
Client → Vercel (Next.js) → PostgreSQL
```

**Phase 2 (Optimize):** Add caching + optimize DB
```
Client → CDN
      ↓
      Vercel (Next.js)
         ↓
      Redis cache
         ↓
      PostgreSQL with indexes
```

**Phase 3 (Scale):** Multiple servers + load balancer
```
Client → CDN
      ↓
      Load Balancer
      ↙   ┃   ┖→
   Vercel1 Vercel2 Vercel3  (auto-scaling)
      └────┬────┘
          ↓
       PostgreSQL (replicas)
```

---

## Monitoring & Observability

### Metrics to Track

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| **API Error Rate** | Vercel logs | > 5% |
| **Response Time (p95)** | Vercel Analytics | > 1s |
| **Database Queries** | PostgreSQL logs | > 1000 qps |
| **Rate Limiter Hits** | In-app counter | > 100/min |
| **Build Time** | Vercel CI/CD | > 5 min |
| **Lighthouse Score** | Vercel Analytics | < 80 |

### Logging

**Application Logs:**
```typescript
console.error("Failed to fetch posts:", error);  // Errors
console.log("Post created:", postId);            // Info (sparingly)
```

**Database Logs:**
```sql
SELECT query, duration FROM pg_stat_statements
WHERE mean_time > 1000;  -- Queries slower than 1 second
```

---

## Security Considerations

### Input Validation

**All user input validated with Zod:**

```typescript
const postSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),  // Only lowercase, numbers, hyphens
  content: z.string().min(10),
});

if (!postSchema.safeParse(body).success) {
  return Response.json({ error: "Invalid input" }, { status: 422 });
}
```

**Benefits:**
- Prevents SQL injection (Drizzle parameterized queries)
- Prevents XSS (React auto-escapes)
- Type-safe (TypeScript catches most errors)

### API Key Management

**Secure practices:**
- Store API_SECRET_KEY in environment variables (not code)
- Use unique keys for each environment (dev, staging, prod)
- Rotate keys periodically
- Never log keys

**TODO: Implement:**
- JWT with expiration
- Multiple API keys per admin
- Rate limiting per key (not just IP)

### CORS Policy

**Configure allowed origins:**
```typescript
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(o => o.trim());

if (!allowedOrigins.includes(origin)) {
  return Response.json({ error: "Not allowed" }, { status: 403 });
}
```

### SQL Injection Prevention

**Drizzle ORM parameterizes queries:**
```typescript
// ✅ SAFE — Parameterized query
db.select().from(posts).where(eq(posts.slug, userInput))

// ❌ UNSAFE — String concatenation (never do this)
db.select().from(posts).where(`slug = '${userInput}'`)
```

---

## Deployment Architecture

### Vercel (Recommended)

```
GitHub repo
    ↓
Push to main branch
    ↓
Vercel detects changes
    ↓
Build: npm run build
    ↓
Deploy: Send .next/ to edge network
    ↓
Cache invalidation: Instant
    ↓
Live at https://meetuptravel.vn
```

**Benefits:**
- Automatic HTTPS
- CDN globally distributed
- Zero-downtime deployments
- Built-in monitoring

### Alternative: Self-Hosted

```
Server (Node.js)
    ↓
PM2 (process manager)
    ↓
Nginx (reverse proxy)
    ↓
PostgreSQL (local or remote)
    ↓
Cloudflare (DNS + CDN)
```

**Setup:**
```bash
npm install
npm run build
npm start  # Starts server on port 3000

# With PM2:
pm2 start npm --name "meetup" -- start
pm2 save
```

---

## Related Documentation

- `./codebase-summary.md` — Component file structure
- `./code-standards.md` — Code patterns and conventions
- `./design-guidelines.md` — UI/UX specifications
- `./project-overview-pdr.md` — Features and requirements
