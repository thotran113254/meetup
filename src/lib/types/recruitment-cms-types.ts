/** Job posting on Recruitment page */
export type RecruitmentJob = {
  id: number;
  title: string;
  description: string;
  jdLink: string;
  jdLabel: string;
};

/** Recruitment page section content */
export type RecruitmentPageContent = {
  heading: string;
  subheading: string;
  connectTitle: string;
  connectDescription: string;
  joinTitle: string;
  joinDescription: string;
};
