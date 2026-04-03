/** Service card in the grid on Services page */
export type ServiceCard = {
  id: number;
  serviceId: string;
  name: string;
  price: string;
  image: string;
  href: string;
};

/** Feature item on Services page */
export type ServiceFeature = {
  id: number;
  featureId: string;
  icon: string;
  title: string;
  description: string;
};

/** Section titles/descriptions for Services page */
export type ServicesPageContent = {
  gridTitle: string;
  gridDescription: string;
  featuresTitle: string;
};
