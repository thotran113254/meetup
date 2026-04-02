import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-utils";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CurrentOpeningsSection } from "@/components/sections/recruitment/current-openings-section";
import { ConnectSection } from "@/components/sections/recruitment/connect-section";

export const metadata: Metadata = generatePageMetadata({
  title: "Recruitment",
  description:
    "Join the Meetup Travel team. Explore current job openings and connect with us to build a career in travel.",
  path: "/recruitment",
});

export default function RecruitmentPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Recruitment", href: "/recruitment" }]} />
      <CurrentOpeningsSection />
      <ConnectSection />
    </>
  );
}
