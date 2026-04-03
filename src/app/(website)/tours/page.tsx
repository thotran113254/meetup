import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo-utils";
import { ToursHeroSection } from "@/components/sections/tours/tours-hero-section";
import { VietnamIntroSection } from "@/components/sections/tours/vietnam-intro-section";
import { MostLikedPackageSection } from "@/components/sections/tours/most-liked-package-section";
import { TourPackageGridSection } from "@/components/sections/tours/tour-package-grid-section";
import { ReviewsSection } from "@/components/sections/homepage/reviews-section";
import { TourFaqSection } from "@/components/sections/tours/tour-faq-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";

export const metadata: Metadata = generatePageMetadata({
  title: "Tour Packages - Explore Vietnam with Local Experts",
  description:
    "Browse curated tour packages across Vietnam. Filter by style and duration. Book authentic local-guided experiences in North, Mid, and South Vietnam.",
  path: "/tours",
});

export default function ToursPage() {
  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Tour Packages", href: "/tours" },
          ]),
        ]}
      />

      <ToursHeroSection />
      <VietnamIntroSection />
      <MostLikedPackageSection />
      <TourPackageGridSection />
      <ReviewsSection />
      <TourFaqSection />
      <NewsletterSection />
    </>
  );
}
