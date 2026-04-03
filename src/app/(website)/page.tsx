import { Fragment } from "react";
import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo-utils";
import { getHomepageSections } from "@/lib/helpers/homepage-section-renderer";

export const metadata: Metadata = generatePageMetadata({
  title: "Meetup Travel - Where Local Experts Craft A Journey Uniquely Yours",
  description:
    "Discover Vietnam with local experts. Customized tours, eTickets, visa services and more. Friendship, integrity and a spirit of self-improvement.",
  path: "/",
});

export default async function HomePage() {
  const sections = await getHomepageSections();

  return (
    <>
      <JsonLdScript data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />
      {sections.map((s) => (
        <Fragment key={s.key}>{s.node}</Fragment>
      ))}
    </>
  );
}
