/** Team member displayed on About page */
export type AboutTeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
};

/** Core value displayed on About page */
export type AboutCoreValue = {
  id: number;
  title: string;
  desc: string;
};

/** Hero/mission content for About page */
export type AboutPageContent = {
  heroTitle: string;
  heroDescription: string;
  mission: string;
  valuesHeading: string;
  teamHeading: string;
  ctaTitle: string;
  ctaDescription: string;
};
