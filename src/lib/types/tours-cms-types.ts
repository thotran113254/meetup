/** Vietnam statistics on Tours intro section */
export type VietnamStat = {
  id: number;
  value: string;
  description: string;
};

/** Tours intro section content */
export type ToursPageContent = {
  introTitle: string;
  introDescription: string;
};

/** Hero section content for Tours page */
export type ToursHeroContent = {
  heroImage: string;
  marqueeText: string;
  breadcrumbLabel: string;
};

/** Single FAQ item for Tours FAQ section */
export type TourFaqItem = {
  id: number;
  question: string;
  answer: string;
};

/** Single day in a tour itinerary */
export type ItineraryDay = {
  title: string;
  details: string[];
  images: string[];
  accommodation: string;
  meals: string;
  included: string[];
  excluded: string[];
};

/** A pricing tier group (e.g. "Group tour:" with 4-star / 5-star rows) */
export type PricingGroup = {
  title: string;
  rows: { label: string; price: string }[];
};

/**
 * Tour package entity — stored in `tour_packages` DB table.
 * Basic fields drive the listing cards; detail fields drive the /tours/[slug] page.
 */
export type TourPackage = {
  // Listing fields
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  duration: string;
  spots: number;
  tags: string[];
  flights: number;
  description: string;
  category: string;
  published: boolean;
  sortOrder: number;
  // Detail page fields
  gallery: string[];
  groupSize: string;
  tripType: string;
  rangeLabel: string;
  tourPace: string;
  physicalRating: number;
  places: string[];
  itinerary: ItineraryDay[];
  pricingOptions: PricingGroup[];
  createdAt: Date;
  updatedAt: Date;
};

/** Input shape for creating/updating a TourPackage (all editable fields) */
export type TourPackageInput = Omit<TourPackage, "id" | "createdAt" | "updatedAt">;

/**
 * "Most Liked Package" section CMS config.
 * `tourSlugs` — ordered list of slugs to feature (empty = first 2 published).
 */
export type MostLikedContent = {
  sectionTitle: string;
  tourSlugs: string[];
};

/**
 * Tour Package Grid section CMS config.
 * `tourSlugs` — slugs to display (empty = all published tours).
 */
export type TourPackageGridContent = {
  sectionTitle: string;
  tourSlugs: string[];
};
