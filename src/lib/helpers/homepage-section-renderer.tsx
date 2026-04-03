import type { SectionConfig, HomepageSectionKey } from "@/lib/types/homepage-cms-types";
import { DEFAULT_SECTIONS_CONFIG } from "@/lib/constants/homepage-section-defaults";
import { getSetting } from "@/db/queries/settings-queries";

import { HeroSection } from "@/components/sections/homepage/hero-section";
import { TourPackageSection } from "@/components/sections/homepage/tour-package-section";
import { ReviewsSection } from "@/components/sections/homepage/reviews-section";
import { ExperienceSection } from "@/components/sections/homepage/experience-section";
import { ServicesSection } from "@/components/sections/homepage/services-section";
import { LatestPostsSection } from "@/components/sections/homepage/latest-posts-section";
import { EticketsSection } from "@/components/sections/homepage/etickets-section";
import { YoutubeSection } from "@/components/sections/homepage/youtube-section";
import { AboutSection } from "@/components/sections/homepage/about-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";

/** Map section key to its React element — exhaustive switch for type safety */
function renderSection(key: HomepageSectionKey): React.ReactNode {
  switch (key) {
    case "hero": return <HeroSection />;
    case "tours": return <TourPackageSection />;
    case "reviews": return <ReviewsSection />;
    case "experience-north": return <ExperienceSection region="North" />;
    case "experience-mid": return <ExperienceSection region="Mid" />;
    case "experience-south": return <ExperienceSection region="South" />;
    case "services": return <ServicesSection />;
    case "latest-posts": return <LatestPostsSection />;
    case "etickets": return <EticketsSection />;
    case "youtube": return <YoutubeSection />;
    case "about": return <AboutSection />;
    case "newsletter": return <NewsletterSection />;
  }
}

/** Load section config from CMS and return ordered, visible sections as React nodes */
export async function getHomepageSections(): Promise<{ key: string; node: React.ReactNode }[]> {
  let config = DEFAULT_SECTIONS_CONFIG;
  try {
    const cms = await getSetting<SectionConfig[]>("homepage_sections_config");
    if (Array.isArray(cms) && cms.length > 0) config = cms;
  } catch {
    // DB unavailable — use defaults (all sections, default order)
  }

  return config
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ key: s.key, node: renderSection(s.key) }));
}
