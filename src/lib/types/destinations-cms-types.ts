/** Destination item displayed in grid */
export type DestinationItem = {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
};

/** Intro section content for Destinations page */
export type DestinationsPageContent = {
  introTitle: string;
  introCity: string;
  introDescription: string;
  gridTitle: string;
};
