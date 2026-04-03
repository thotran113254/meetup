import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo-utils";
import { DestinationHeroSection } from "@/components/sections/destinations/destination-hero-section";
import { DestinationGridSection } from "@/components/sections/destinations/destination-grid-section";
import { DestinationIntroSection } from "@/components/sections/destinations/destination-intro-section";
import { DestinationFeaturesSection } from "@/components/sections/destinations/destination-features-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";
import { getSetting } from "@/db/queries/settings-queries";
import type { DestinationItem, DestinationsPageContent } from "@/lib/types/destinations-cms-types";

export const metadata: Metadata = generatePageMetadata({
  title: "Destinations - Explore Vietnam's Best Places",
  description:
    "Discover Vietnam's top destinations. From Hanoi's ancient streets to Halong Bay's emerald waters. Customized itineraries by local experts.",
  path: "/destinations",
});

export default async function DestinationsPage() {
  // Load CMS data — fall back silently to component defaults if DB unavailable
  let cmsDestinations: DestinationItem[] | undefined;
  let cmsContent: DestinationsPageContent | undefined;

  try {
    const [destinations, content] = await Promise.all([
      getSetting<DestinationItem[]>("destinations_list"),
      getSetting<DestinationsPageContent>("destinations_page_content"),
    ]);
    if (Array.isArray(destinations) && destinations.length > 0) cmsDestinations = destinations;
    if (content && typeof content === "object" && !Array.isArray(content)) cmsContent = content;
  } catch {
    // DB unavailable — section components will use their built-in fallbacks
  }

  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Destination", href: "/destinations" },
          ]),
        ]}
      />

      <DestinationHeroSection />
      <DestinationIntroSection
        city={cmsContent?.introCity}
        description={cmsContent?.introDescription || undefined}
      />
      <DestinationGridSection
        destinations={cmsDestinations}
        title={cmsContent?.gridTitle}
      />
      <DestinationFeaturesSection />
      <NewsletterSection />
    </>
  );
}
