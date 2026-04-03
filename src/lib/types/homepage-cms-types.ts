/** Section keys — one per renderable homepage section */
export type HomepageSectionKey =
  | "hero"
  | "tours"
  | "reviews"
  | "experience-north"
  | "experience-mid"
  | "experience-south"
  | "services"
  | "latest-posts"
  | "etickets"
  | "youtube"
  | "about"
  | "newsletter";

/** Per-section config stored in homepage_sections_config */
export type SectionConfig = {
  key: HomepageSectionKey;
  visible: boolean;
  order: number;
  title?: string;
  subtitle?: string;
};

/** About section CMS data */
export type AboutData = {
  title: string;
  quote: string;
  mobilePhotos: Array<{
    src: string;
    alt: string;
    deg: number;
    left: string;
    top: string;
    stringH: number;
    wide?: boolean;
  }>;
  desktopImage: string;
  teamImage: string;
  dragonImage: string;
  templeImage: string;
  cloudImage: string;
};

/** Newsletter section CMS data */
export type NewsletterData = {
  title: string;
  description: string;
};

/** eTickets section CMS data */
export type EticketsData = {
  title: string;
  cities: Array<{ value: string; label: string }>;
  passengers: Array<{ value: string; label: string }>;
};

/** Experience section CMS data — per region tours + images */
export type ExperienceTourItem = {
  id: number;
  title: string;
  price: string;
  tags: string[];
};

export type ExperienceRegionData = {
  tours: ExperienceTourItem[];
  images: string[];
};

export type ExperienceData = Record<string, ExperienceRegionData>;
