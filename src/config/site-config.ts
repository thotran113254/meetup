/**
 * Central site configuration - UPDATE THIS for each project.
 * All SEO metadata, navigation, and branding derive from this file.
 */

export const siteConfig = {
  // Core identity
  name: "YourBrand",
  shortName: "YB",
  description:
    "A modern website template built with Next.js, Magic UI, and optimized for SEO & GEO.",
  tagline: "Build beautiful, high-converting websites",

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourbrand.com",
  ogImage: "/images/og-default.png",

  // Contact & socials
  email: "hello@yourbrand.com",
  phone: "+84 123 456 789",
  address: {
    street: "123 Main Street",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    zip: "700000",
  },

  // Social links
  socials: {
    twitter: "https://twitter.com/yourbrand",
    facebook: "https://facebook.com/yourbrand",
    linkedin: "https://linkedin.com/company/yourbrand",
    github: "https://github.com/yourbrand",
    youtube: "",
  },

  // SEO defaults
  seo: {
    titleTemplate: "%s | YourBrand",
    defaultTitle: "YourBrand - Build Beautiful Websites",
    locale: "vi_VN",
    alternateLocales: ["en_US"],
    type: "website" as const,
    twitterHandle: "@yourbrand",
  },

  // Theme colors for manifest and meta tags
  theme: {
    primary: "#6366f1", // indigo-500
    background: "#ffffff",
    foreground: "#0a0a0a",
  },

  // Navigation items
  navigation: {
    main: [
      { label: "Trang chu", href: "/" },
      { label: "Dich vu", href: "/services" },
      { label: "Ve chung toi", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Lien he", href: "/contact" },
    ],
    footer: {
      company: [
        { label: "Ve chung toi", href: "/about" },
        { label: "Doi ngu", href: "/about#team" },
        { label: "Tuyen dung", href: "/careers" },
      ],
      services: [
        { label: "Thiet ke website", href: "/services#web-design" },
        { label: "Phat trien ung dung", href: "/services#app-dev" },
        { label: "SEO & Marketing", href: "/services#seo" },
      ],
      legal: [
        { label: "Chinh sach bao mat", href: "/privacy" },
        { label: "Dieu khoan su dung", href: "/terms" },
      ],
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
