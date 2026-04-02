/**
 * Central site configuration — Meetup Travel.
 * All SEO metadata, navigation, and branding derive from this file.
 */

export const siteConfig = {
  // Core identity
  name: "Meetup Travel",
  shortName: "Meetup",
  description:
    "Where local experts craft a journey uniquely yours",
  tagline: "Welcome to Meetup",

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://meetuptravel.vn",
  ogImage: "/images/og-default.png",

  // Contact
  email: "vn.meetup.travel@gmail.com",
  phone: "+84 97 266 49 31",
  address: {
    street: "No. 22C, Thanh Cong Street",
    city: "Ba Dinh District, Hanoi",
    country: "Vietnam",
    zip: "100000",
  },

  // Social links
  socials: {
    instagram: "https://instagram.com/meetuptravel",
    facebook: "https://facebook.com/meetuptravel",
    tiktok: "https://tiktok.com/@meetuptravel",
    youtube: "https://youtube.com/@meetuptravel",
    whatsapp: "https://wa.me/84972664931",
  },

  // SEO defaults
  seo: {
    titleTemplate: "%s | Meetup Travel",
    defaultTitle:
      "Meetup Travel - Where Local Experts Craft A Journey Uniquely Yours",
    locale: "en_US",
    alternateLocales: ["vi_VN"],
    type: "website" as const,
    twitterHandle: "",
  },

  // Theme colors
  theme: {
    primary: "#2CBCB3",
    background: "#ffffff",
    foreground: "#0a0a0a",
  },

  // Navigation items
  navigation: {
    main: [
      { label: "Tour", href: "/tours", hasDropdown: true },
      { label: "Services", href: "/services", hasDropdown: true },
      { label: "eTickets", href: "#", hasDropdown: false },
      { label: "Destination", href: "/destinations", hasDropdown: false },
      { label: "Blog", href: "/blog", hasDropdown: false },
      { label: "About Meetup", href: "/about", hasDropdown: true },
    ],
    footer: {
      company: [
        { label: "Home", href: "/" },
        { label: "Tours", href: "/tours" },
        { label: "Hotel", href: "#" },
        { label: "Services", href: "/services" },
        { label: "e-Tickets", href: "#" },
      ],
      about: [
        { label: "About Us", href: "/about" },
        { label: "Recruitment", href: "/recruitment" },
        { label: "Terms & Policy", href: "#" },
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
} as const;

export type SiteConfig = typeof siteConfig;
