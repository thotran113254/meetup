/**
 * CurrentOpeningsSection — Job listings grid.
 * Desktop: 4-column grid, 2 rows. Mobile: single-column stack.
 * Figma: desktop 14008:86356, mobile 14008:88836.
 */

import Link from "next/link";

interface JobPosting {
  id: string;
  title: string;
  description: string;
  jdLink: string;
  jdLabel: string;
}

const JOB_POSTINGS: JobPosting[] = [
  {
    id: "1",
    title: "SALE TOUR",
    description:
      "Join our sales team to promote and sell tour packages to domestic and international travelers. Work with local experts to craft unforgettable journeys.",
    jdLink: "#",
    jdLabel: "View full job description",
  },
  {
    id: "2",
    title: "TOUR GUIDE",
    description:
      "Lead groups of travelers through Vietnam's most iconic destinations. Share your passion for culture, history, and local cuisine with our guests.",
    jdLink: "#",
    jdLabel: "View full job description",
  },
  {
    id: "3",
    title: "MARKETING EXECUTIVE",
    description:
      "Drive brand awareness and lead generation through digital channels. Manage social media, content creation, and campaign analytics.",
    jdLink: "#",
    jdLabel: "View full job description",
  },
  {
    id: "4",
    title: "CUSTOMER SERVICE",
    description:
      "Provide exceptional support to our travelers before, during, and after their trips. Handle inquiries, resolve issues, and ensure memorable experiences.",
    jdLink: "#",
    jdLabel: "View full job description",
  },
  {
    id: "5",
    title: "SALE TOUR",
    description:
      "Work with our experienced team to develop customized travel itineraries. Build relationships with clients and deliver personalized service.",
    jdLink: "#",
    jdLabel: "View full job description",
  },
  {
    id: "6",
    title: "CONTENT CREATOR",
    description:
      "Create compelling travel content for our website, blog, and social media platforms. Produce photos, videos, and written content that inspires travelers.",
    jdLink: "#",
    jdLabel: "View full job description",
  },
  {
    id: "7",
    title: "OPERATIONS STAFF",
    description:
      "Coordinate logistics for tour operations including transportation, accommodation, and activities. Ensure seamless execution of all travel programs.",
    jdLink: "#",
    jdLabel: "View full job description",
  },
  {
    id: "8",
    title: "E-TICKET SPECIALIST",
    description:
      "Manage booking and issuance of attraction tickets, transportation passes, and travel vouchers. Maintain partnerships with local vendors.",
    jdLink: "#",
    jdLabel: "View full job description",
  },
];

/** Single job card — Figma node 14008:86286 (desktop), 14008:88811 (mobile) */
function JobCard({ job }: { job: JobPosting }) {
  return (
    <div className="bg-white rounded-[12px] shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] p-[20px] flex flex-col gap-3">
      {/* Job title — teal, H5 */}
      <h3 className="text-[#3bbcb7] text-[20px] font-bold leading-[1.2] tracking-[0.05px]">
        {job.title}
      </h3>

      {/* Description block */}
      <div className="flex flex-col gap-1 text-[14px] leading-[1.5] tracking-[0.035px]">
        <span className="text-[#1d1d1d] font-normal">Description:</span>
        <p className="text-[#828282] line-clamp-4">{job.description}</p>
      </div>

      {/* JD link block */}
      <div className="flex flex-col gap-1 text-[14px] leading-[1.5] tracking-[0.035px]">
        <span className="text-[#1d1d1d] font-normal">Link JD:</span>
        <Link
          href={job.jdLink}
          className="text-[#0088ff] underline underline-offset-2 decoration-solid truncate hover:text-[#0066cc] transition-colors"
        >
          {job.jdLabel}
        </Link>
      </div>
    </div>
  );
}

type Props = {
  /** CMS-overridable job list. Falls back to hardcoded JOB_POSTINGS. */
  jobs?: { id: string | number; title: string; description: string; jdLink: string; jdLabel: string }[];
  /** CMS-overridable heading. Defaults to "Current openings". */
  heading?: string;
  /** CMS-overridable subheading. Defaults to hardcoded text. */
  subheading?: string;
};

export function CurrentOpeningsSection({
  jobs,
  heading = "Current openings",
  subheading = "Thanks for checking out our job openings. See something that interests you? Apply here.",
}: Props = {}) {
  const source = jobs && jobs.length > 0
    ? jobs.map((j) => ({ ...j, id: String(j.id) }))
    : JOB_POSTINGS;

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Heading block */}
        <div className="mb-10">
          <h1 className="text-[#1d1d1d] text-[28px] md:text-[48px] font-bold leading-[1.2] mb-3">
            {heading}
          </h1>
          <p className="text-[#828282] text-[14px] md:text-[16px] leading-[1.5] tracking-[0.04px] max-w-[678px]">
            {subheading}
          </p>
        </div>

        {/* Job cards grid — 1 col on mobile, 2 on sm, 4 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {source.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
