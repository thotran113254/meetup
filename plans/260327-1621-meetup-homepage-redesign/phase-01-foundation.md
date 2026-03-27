---
phase: 1
priority: critical
status: completed
effort: small
---

# Phase 1: Foundation — Config, Theme, Fonts

## Overview
Update site config, theme colors, and fonts to match Meetup Travel branding. All other phases depend on this.

## Files to Modify
- `src/config/site-config.ts` — Full rebrand
- `src/app/globals.css` — Color variables indigo → teal
- `src/app/layout.tsx` — Add Google Font (Dancing Script)

## Implementation Steps

### 1. Update `site-config.ts`
```ts
export const siteConfig = {
  name: "Meetup Travel",
  shortName: "Meetup",
  description: "Where local experts craft a journey uniquely yours",
  tagline: "Welcome to Meetup",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://meetuptravel.vn",
  email: "vn.meetup.travel@gmail.com",
  phone: "+84 97 266 49 31",
  address: {
    street: "No. 22C, Thanh Cong Street",
    city: "Ba Dinh District, Hanoi",
    country: "Vietnam",
    zip: "100000",
  },
  socials: {
    instagram: "https://instagram.com/meetuptravel",
    facebook: "https://facebook.com/meetuptravel",
    tiktok: "https://tiktok.com/@meetuptravel",
    youtube: "https://youtube.com/@meetuptravel",
    whatsapp: "https://wa.me/84972664931",
  },
  navigation: {
    main: [
      { label: "Tour", href: "/tours", hasDropdown: true },
      { label: "Services", href: "/services", hasDropdown: true },
      { label: "eTickets", href: "/etickets" },
      { label: "Destination", href: "/destination" },
      { label: "Blog", href: "/blog" },
      { label: "About Meetup", href: "/about", hasDropdown: true },
    ],
    footer: {
      company: [
        { label: "Home", href: "/" },
        { label: "Tours", href: "/tours" },
        { label: "Hotel", href: "/hotel" },
        { label: "Services", href: "/services" },
        { label: "e-Tickets", href: "/etickets" },
      ],
      about: [
        { label: "About Us", href: "/about" },
        { label: "Recruitment", href: "/recruitment" },
        { label: "Terms & Policy", href: "/terms" },
        { label: "Contact Us", href: "/contact" },
      ],
      contact: {
        whatsapp: [
          { name: "Grace", phone: "+84 97 266 49 31" },
          { name: "Sunny", phone: "+84 90 624 49 14" },
        ],
        email: "vn.meetup.travel@gmail.com",
        office: "No. 22C, Thanh Cong Street, Ba Dinh District, Hanoi",
      },
    },
  },
  theme: {
    primary: "#2CBCB3",
    background: "#ffffff",
    foreground: "#0a0a0a",
  },
  seo: {
    titleTemplate: "%s | Meetup Travel",
    defaultTitle: "Meetup Travel - Where Local Experts Craft A Journey Uniquely Yours",
    locale: "en_US",
    alternateLocales: ["vi_VN"],
    type: "website" as const,
  },
} as const;
```

### 2. Update `globals.css` colors
```css
:root {
  --color-primary: #2CBCB3;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f0fdfb;
  --color-secondary-foreground: #134e4a;
  --color-accent: #E87C3E;
  --color-accent-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-border: #e5e7eb;
  --color-ring: #2CBCB3;
  --color-card: #ffffff;
  --color-card-foreground: #0a0a0a;
  --radius: 0.75rem;
}
```

### 3. Add Dancing Script font in `layout.tsx`
```tsx
import { Dancing_Script } from "next/font/google";
const dancingScript = Dancing_Script({ subsets: ["latin", "vietnamese"], variable: "--font-script" });
// Add dancingScript.variable to <body> className
```

## Success Criteria
- [ ] Colors reflect teal/turquoise theme
- [ ] Site config has Meetup Travel data
- [ ] Script font available via CSS variable `--font-script`
- [ ] `pnpm typecheck` passes
