/** FAQ category with questions for Contact page */
export type ContactFaqCategory = {
  id: number;
  title: string;
  questions: string[];
  fullWidth?: boolean;
};

/** Business info for Contact page */
export type ContactPageInfo = {
  timezone: string;
  operatingHours: string;
  infoTitle: string;
};
