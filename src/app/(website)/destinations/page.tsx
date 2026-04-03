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

export const metadata: Metadata = generatePageMetadata({
  title: "Destinations - Explore Vietnam's Best Places",
  description:
    "Discover Vietnam's top destinations. From Hanoi's ancient streets to Halong Bay's emerald waters. Customized itineraries by local experts.",
  path: "/destinations",
});

export default function DestinationsPage() {
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
      <DestinationIntroSection />
      <DestinationGridSection />
      <DestinationFeaturesSection />
      <NewsletterSection />
    </>
  );
}
