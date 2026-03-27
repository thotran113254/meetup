# Meetup Travel Documentation

Welcome to the Meetup Travel project documentation. This directory contains comprehensive guides for developers, designers, and project managers.

**Project Status:** ✅ MVP Phase 6 Complete (Homepage Figma Implementation)
**Last Updated:** March 27, 2026

---

## Quick Start

**New to the project?** Start here:

1. **[Project Overview & Requirements](./project-overview-pdr.md)** (10 min)
   - What Meetup Travel does
   - Project phases and completion status
   - Functional & non-functional requirements
   - Success metrics (all ✅ met)

2. **[Codebase Summary](./codebase-summary.md)** (10 min)
   - Directory structure
   - All 54+ components cataloged
   - API endpoints reference
   - Development commands

3. **[Design Guidelines](./design-guidelines.md)** (10 min)
   - Design tokens (colors, spacing, typography)
   - Component specs (sizes, styles)
   - Responsive breakpoints
   - Accessibility standards

4. **[Code Standards](./code-standards.md)** (15 min)
   - Naming conventions
   - React & TypeScript patterns
   - Best practices and anti-patterns
   - Code review checklist

5. **[System Architecture](./system-architecture.md)** (15 min)
   - 4-layer architecture
   - Data flow diagrams
   - Rendering strategies (SSR, SSG, ISR)
   - Security & performance considerations

**Total time:** ~60 minutes for full context

---

## Documentation Guide

### By Role

**Frontend Developer**
- Start: [Codebase Summary](./codebase-summary.md) → [Design Guidelines](./design-guidelines.md) → [Code Standards](./code-standards.md)
- Reference: [System Architecture](./system-architecture.md) for data flow

**Backend/API Developer**
- Start: [Project Overview](./project-overview-pdr.md) → [Codebase Summary](./codebase-summary.md)
- Deep dive: [System Architecture](./system-architecture.md) → [Code Standards](./code-standards.md)

**Product Manager**
- Start: [Project Overview](./project-overview-pdr.md)
- Reference: [Codebase Summary](./codebase-summary.md) for feature locations

**Designer**
- Start: [Design Guidelines](./design-guidelines.md)
- Reference: [Codebase Summary](./codebase-summary.md) for component structure

**DevOps/Deployment**
- Start: [System Architecture](./system-architecture.md) (Deployment section)
- Reference: [Project Overview](./project-overview-pdr.md) for environment variables

---

## Documentation Files

### 1. **codebase-summary.md** (375 LOC)
Complete inventory of codebase structure and components.

**Contents:**
- Project overview & tech stack
- Directory structure with file locations
- 54+ component files cataloged by type
- Database schema overview
- API endpoints reference (6 categories, 12+ endpoints)
- Environment variables
- Development commands
- Design tokens summary

**When to read:** Understanding where code lives, finding specific files

**Key sections:**
- `/src/app/` — Pages and routing
- `/src/components/` — React components (layout, sections, UI)
- `/src/db/` — Database layer
- `/src/lib/` — Utilities and helpers

---

### 2. **design-guidelines.md** (806 LOC)
Design system documentation with Figma specifications.

**Contents:**
- Design philosophy
- Color palette (primary #2CBCB3, accent #E87C3E)
- Typography (system fonts, heading hierarchy)
- Layout & spacing (1400px max-width, responsive)
- Component specifications (card sizes, button styles)
- Responsive design (375px mobile → 1600px desktop)
- Interactive components (modals, carousels, drawers)
- Accessibility standards (WCAG AA)
- Dark mode implementation via CSS variables
- 13 homepage sections + 8 popups (all ✅ spec-compliant)

**When to read:** Building new components, understanding design system, ensuring pixel-perfect UI

**Key reference:**
- Color system table
- Component card specifications
- Responsive breakpoint table
- Accessibility checklist

---

### 3. **project-overview-pdr.md** (690 LOC)
Product requirements, business objectives, and project roadmap.

**Contents:**
- Executive summary and vision
- Product overview (what Meetup does)
- Target market analysis
- 10 functional requirements (FR-1 to FR-10)
- 7 non-functional requirements (NFR-1 to NFR-7)
- Technology stack
- 6 project phases with completion status (all ✅)
- Success metrics & acceptance criteria (all ✅ met)
- Known limitations and future work
- Budget and resource allocation
- Deployment planning

**When to read:** Understanding requirements, what's completed vs future, project scope

**Key sections:**
- Functional Requirements (what product does)
- Non-Functional Requirements (performance, security, scalability)
- Phase completion status (Phase 1-6 all ✅)
- Success metrics (all ✅ met)

---

### 4. **code-standards.md** (1,184 LOC)
Coding conventions, patterns, and best practices.

**Contents:**
- File organization (directory structure, size limits)
- Naming conventions (files, variables, functions, CSS)
- React patterns (server vs client components, hooks)
- TypeScript guidelines (strict mode, interfaces, generics)
- Tailwind CSS patterns (CSS variables, responsive, utilities)
- API route patterns (GET, POST, PUT, DELETE handlers)
- Database patterns (Drizzle ORM, schema, queries)
- Error handling (try-catch, API responses)
- Testing examples (unit tests, API tests)
- Performance (images, code splitting, caching)
- Security (validation, auth, CORS)
- Documentation standards (JSDoc, comments)
- Common anti-patterns to avoid
- Code review checklist

**When to read:** Writing new code, reviewing PRs, understanding conventions

**Key checklists:**
- File naming conventions table
- API error status codes
- Code review checklist (15 items)

---

### 5. **system-architecture.md** (851 LOC)
Technical architecture, data flow, and system design.

**Contents:**
- Architecture overview (4 layers)
- Layer breakdown with responsibilities
- Request-response cycle (SSR, SSG, ISR)
- Data flow diagrams (5+ flows)
- Rendering strategy decision tree
- Caching strategy (browser, ISR, database)
- Authentication & authorization (Bearer tokens)
- Performance optimizations
- Scalability considerations (Phase 1-3)
- Monitoring & observability
- Security considerations
- Deployment architecture (Vercel, self-hosted)

**When to read:** Understanding how system works, optimizing performance, scaling

**Key diagrams:**
- 4-layer architecture
- Request-response cycle
- Wishlist interaction flow
- Blog post creation flow
- Scaling progression (Phase 1-3)

---

## Quick Reference

### File Locations
| What | Where |
|------|-------|
| Homepage | `src/app/page.tsx` |
| Components | `src/components/` |
| API routes | `src/app/api/` |
| Database | `src/db/schema.ts` |
| Config | `src/config/site-config.ts` |
| Styles | `src/app/globals.css` |
| Utils | `src/lib/` |

### Development Commands
```bash
pnpm dev              # Start dev server (port 1458)
pnpm build            # Production build
pnpm typecheck        # TypeScript check
pnpm db:push          # Sync DB schema
pnpm db:studio        # Drizzle Studio GUI
```

### Key Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Runtime:** React 19
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL + Drizzle ORM
- **Forms:** react-hook-form + Zod
- **UI:** Radix primitives + shadcn/ui

### Design System
- **Primary color:** `#2CBCB3` (teal)
- **Accent color:** `#E87C3E` (orange)
- **Max width:** 1400px (content), 1600px (full)
- **Border radius:** 12-16px
- **Card sizes:** 338×516px (tours), 338×338px (experiences)
- **Mobile width:** 375px, Desktop: 1600px

---

## Navigation Guide

**Want to find something specific?**

| Looking for | Go to |
|-------------|-------|
| **How to create a component** | code-standards.md → React Patterns |
| **Design tokens (colors, spacing)** | design-guidelines.md → Design System |
| **API endpoint details** | codebase-summary.md → API Endpoints |
| **Database schema** | codebase-summary.md → Database Schema |
| **Component file locations** | codebase-summary.md → Directory Structure |
| **How authentication works** | system-architecture.md → Authentication |
| **Responsive design specs** | design-guidelines.md → Responsive Design |
| **What's in Phase 6** | project-overview-pdr.md → Phase 6 |
| **TypeScript patterns** | code-standards.md → TypeScript Guidelines |
| **SEO setup** | project-overview-pdr.md → FR-10 |

---

## New Components (Phase 5-6)

All new components are fully documented in [Codebase Summary](./codebase-summary.md#new-components-created-phase-6).

- **mobile-menu.tsx** — Mobile mega menu overlay
- **subscribe-popup.tsx** — Newsletter subscription feedback (success/fail/unsubscribe)
- **wishlist-drawer.tsx** — Saved tours drawer (persistent via localStorage)
- **currency-switcher.tsx** — Currency selector dropdown (USD, VND, GBP, EUR)
- **filter-dropdown.tsx** — Reusable multi-select filter component

---

## Documentation Status

| Document | Status | Topics | Last Updated |
|----------|--------|--------|--------------|
| Codebase Summary | ✅ Complete | 12 sections | Mar 27, 2026 |
| Design Guidelines | ✅ Complete | 16 sections | Mar 27, 2026 |
| Project Overview | ✅ Complete | 15 sections | Mar 27, 2026 |
| Code Standards | ✅ Complete | 12 sections | Mar 27, 2026 |
| System Architecture | ✅ Complete | 13 sections | Mar 27, 2026 |

**Total:** 3,906 lines across 5 documents, 68 topics

---

## Feedback & Updates

This documentation covers the current MVP (Phase 6 complete). As the project evolves:

- **Bug reports?** File an issue on GitHub
- **Documentation improvements?** Create a PR with changes
- **Missing topics?** Open a discussion

---

## Related Resources

- **GitHub Repository:** `https://github.com/meetup-travel/meetup`
- **Figma Design:** `https://www.figma.com/design/V4UemzwwSm5FEe9FJteXDw/MEETUP-TRAVEL`
- **Deployment:** Vercel (https://meetuptravel.vn)
- **Database:** PostgreSQL

---

## Onboarding Checklist

New developer? Follow this checklist:

- [ ] Read [Project Overview](./project-overview-pdr.md) (10 min)
- [ ] Read [Codebase Summary](./codebase-summary.md) (10 min)
- [ ] Read [Design Guidelines](./design-guidelines.md) (10 min)
- [ ] Read [Code Standards](./code-standards.md) (15 min)
- [ ] Skim [System Architecture](./system-architecture.md) (10 min)
- [ ] Set up dev environment: `git clone && pnpm install && pnpm dev`
- [ ] Explore codebase: Navigate `src/` directory
- [ ] Read CLAUDE.md in project root (5 min)
- [ ] Ask questions in Slack/Discord

**Total time:** ~1 hour for full context

---

**Happy coding! 🚀**

For questions, check the relevant document or ask in the team channel.
