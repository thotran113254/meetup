import type { HomepageSectionKey, SectionConfig } from "@/lib/types/homepage-cms-types";

/** Default homepage section order — used when no DB config exists */
export const DEFAULT_SECTIONS_CONFIG: SectionConfig[] = [
  { key: "hero", visible: true, order: 0 },
  { key: "tours", visible: true, order: 1 },
  { key: "reviews", visible: true, order: 2 },
  { key: "experience-north", visible: true, order: 3 },
  { key: "experience-mid", visible: true, order: 4 },
  { key: "experience-south", visible: true, order: 5 },
  { key: "services", visible: true, order: 6 },
  { key: "latest-posts", visible: true, order: 7 },
  { key: "etickets", visible: true, order: 8 },
  { key: "youtube", visible: true, order: 9 },
  { key: "about", visible: true, order: 10 },
  { key: "newsletter", visible: true, order: 11 },
];

/** Human-readable labels for admin UI */
export const SECTION_LABELS: Record<HomepageSectionKey, string> = {
  hero: "Hero Slides",
  tours: "Tour Packages",
  reviews: "Đánh giá",
  "experience-north": "Experience - Miền Bắc",
  "experience-mid": "Experience - Miền Trung",
  "experience-south": "Experience - Miền Nam",
  services: "Dịch vụ",
  "latest-posts": "Bài viết mới",
  etickets: "e-Tickets",
  youtube: "YouTube",
  about: "About Us",
  newsletter: "Newsletter",
};

/** CMS setting keys map */
export const HOMEPAGE_SETTING_KEYS = {
  config: "homepage_sections_config",
  tours: "homepage_tours",
  services: "homepage_services",
  reviews: "homepage_reviews",
  videos: "homepage_videos",
  experience: "homepage_experience",
  about: "homepage_about",
  newsletter: "homepage_newsletter",
  etickets: "homepage_etickets",
} as const;
