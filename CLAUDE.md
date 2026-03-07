# CLAUDE.md — Next.js Landing Template

## Quick Start
```bash
pnpm install
cp .env.example .env.local    # Configure DATABASE_URL + API_SECRET_KEY
pnpm db:push                  # Create DB tables
pnpm dev                      # Start dev server (port 3000)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4 + shadcn/ui + Magic UI components
- **Database**: PostgreSQL + Drizzle ORM
- **Forms**: react-hook-form + zod (shared client/server validation)
- **Auth**: API key (Bearer token) for API routes. Admin UI has no auth yet (TODO).

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (public pages)      # /, /about, /services, /blog, /contact
│   ├── admin/              # Admin dashboard (separate layout, no header/footer)
│   ├── api/                # REST API for AI agents
│   │   ├── posts/          # CRUD blog posts
│   │   ├── contacts/       # Contact submissions
│   │   ├── settings/       # Site settings
│   │   └── seo/audit/      # SEO analysis
│   ├── llms.txt/           # AI search engine summary
│   ├── llms-full.txt/      # Full content for AI
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/
│   ├── admin/              # Admin sidebar
│   ├── forms/              # Form components (ContactForm)
│   ├── layout/             # SiteHeader, SiteFooter
│   ├── providers/          # ThemeProvider
│   ├── sections/           # Reusable page sections (Hero, Features, etc.)
│   ├── seo/                # JsonLdScript, Breadcrumbs
│   └── ui/                 # Base UI components (Button, Accordion, MagicCard, etc.)
├── config/
│   └── site-config.ts      # SINGLE SOURCE OF TRUTH — update this first for each project
├── db/
│   ├── connection.ts       # Lazy singleton DB connection (getDb())
│   ├── schema.ts           # Drizzle schema (posts, contactSubmissions, siteSettings)
│   └── queries/            # Reusable DB query functions
├── lib/
│   ├── api-auth.ts         # API key auth + rate limiting (checkApiAccess)
│   ├── rate-limiter.ts     # In-memory rate limiter by IP
│   ├── seo-utils.ts        # generatePageMetadata() + JSON-LD builders
│   ├── utils.ts            # cn() utility
│   ├── blog-data.ts        # Static blog data (fallback when no DB)
│   └── validations/        # Zod schemas (shared client ↔ server)
```

### How to Customize for a New Project

1. **Branding**: Edit `src/config/site-config.ts` — name, URL, description, navigation, socials
2. **Theme Colors**: Edit CSS variables in `src/app/globals.css` (`:root` and `.dark` sections)
3. **Content**: Update section data in page files (src/app/page.tsx, etc.)
4. **Add Pages**: Create new folder in `src/app/`, use `generatePageMetadata()` from `seo-utils.ts`
5. **Add Components**: `pnpm dlx shadcn@latest add <component>` or create in `src/components/ui/`
6. **Add DB Tables**: Add to `src/db/schema.ts`, create queries in `src/db/queries/`, run `pnpm db:push`

### API for AI Agents

All mutation endpoints require `Authorization: Bearer <API_SECRET_KEY>` header.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/posts?published=true&limit=10 | Yes | List posts |
| POST | /api/posts | Yes | Create post |
| GET | /api/posts/[slug] | No | Get single post |
| PUT | /api/posts/[slug] | Yes | Update post (partial) |
| DELETE | /api/posts/[slug] | Yes | Delete post |
| GET | /api/contacts?read=false | Yes | List submissions |
| PUT | /api/contacts/[id] | Yes | Toggle read status |
| DELETE | /api/contacts/[id] | Yes | Delete submission |
| GET | /api/settings | Yes | Get all settings |
| PUT | /api/settings | Yes | Upsert setting |
| GET | /api/seo/audit | Yes | SEO analysis + score |

Use `checkApiAccess(request)` from `src/lib/api-auth.ts` in mutation handlers — it combines rate limiting + auth in one call.

### SEO/GEO Optimization

- **Per-page metadata**: Use `generatePageMetadata()` from `src/lib/seo-utils.ts`
- **JSON-LD schemas**: Organization, Website, Article, FAQ, Service, Breadcrumb
- **llms.txt**: AI search engine summary at `/llms.txt`
- **llms-full.txt**: Full content at `/llms-full.txt`
- **Sitemap**: Auto-generated at `/sitemap.xml`
- **FAQ schema**: Add FAQ JSON-LD to pages for GEO boost (AI engines love FAQ structured data)

### Key Patterns

- **Server Components by default** — only add "use client" for interactivity
- **CSS Variables for theming** — all colors use `var(--color-*)`, never hardcode
- **Lazy DB connection** — `getDb()` only connects when called, safe during build
- **Shared Zod schemas** — same validation on client forms and server API
- **ISR revalidation** — API mutations call `revalidatePath()` for instant updates

### Environment Variables
```
NEXT_PUBLIC_SITE_URL=https://yourbrand.com    # SEO canonical URLs
DATABASE_URL=postgresql://user:pass@host/db   # PostgreSQL connection
API_SECRET_KEY=your-secret-key                # API auth for AI agents
ALLOWED_ORIGINS=https://yourbrand.com         # CORS origins (comma-separated)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX                # Google Analytics (optional)
```

### Commands
```bash
pnpm dev          # Dev server with Turbopack
pnpm build        # Production build
pnpm start        # Start production server
pnpm typecheck    # TypeScript check
pnpm db:push      # Push schema to DB
pnpm db:generate  # Generate migrations
pnpm db:studio    # Drizzle Studio GUI
```
