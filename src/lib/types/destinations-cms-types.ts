/** Destination item displayed in grid */
export type DestinationItem = {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
};

/** Hero section content */
export type DestinationsHeroContent = {
  heroImage: string;
  marqueeText: string;
  breadcrumbLabel: string;
};

/** Feature card in features section */
export type DestinationFeatureItem = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

/** Intro section content for Destinations page */
export type DestinationsPageContent = {
  introTitle: string;
  introCity: string;
  introDescription: string;
  gridTitle: string;
};
