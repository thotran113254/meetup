export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-utils";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CurrentOpeningsSection } from "@/components/sections/recruitment/current-openings-section";
import { ConnectSection } from "@/components/sections/recruitment/connect-section";
import { getSetting } from "@/db/queries/settings-queries";
import type { RecruitmentJob, RecruitmentPageContent } from "@/lib/types/recruitment-cms-types";

export const metadata: Metadata = generatePageMetadata({
  title: "Recruitment",
  description:
    "Join the Meetup Travel team. Explore current job openings and connect with us to build a career in travel.",
  path: "/recruitment",
});

export default async function RecruitmentPage() {
  const [pageContent, jobs] = await Promise.all([
    getSetting<RecruitmentPageContent>("recruitment_page_content"),
    getSetting<RecruitmentJob[]>("recruitment_jobs"),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Recruitment", href: "/recruitment" }]} />
      <CurrentOpeningsSection
        jobs={jobs ?? undefined}
        heading={pageContent?.heading}
        subheading={pageContent?.subheading}
      />
      <ConnectSection
        connectTitle={pageContent?.connectTitle}
        connectDescription={pageContent?.connectDescription}
        joinTitle={pageContent?.joinTitle}
        joinDescription={pageContent?.joinDescription}
      />
    </>
  );
}
