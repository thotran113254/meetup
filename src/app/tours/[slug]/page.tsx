import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo-utils";
import { TourImageGallery } from "@/components/sections/tour-detail/tour-image-gallery";
import { TourDetailInfo } from "@/components/sections/tour-detail/tour-detail-info";
import { TourItinerarySection } from "@/components/sections/tour-detail/tour-itinerary-section";
import { TourPricingSidebar } from "@/components/sections/tour-detail/tour-pricing-sidebar";
import { TourDetailReviews } from "@/components/sections/tour-detail/tour-detail-reviews";
import { TourRelatedPackages } from "@/components/sections/tour-detail/tour-related-packages";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";
import { TourMobileBottomBar } from "@/components/sections/tour-detail/tour-mobile-bottom-bar";

export const metadata: Metadata = generatePageMetadata({
  title: "Tour Package Details - Explore Vietnam",
  description:
    "View detailed itinerary, pricing, and reviews for this Vietnam tour package.",
  path: "/tours/tour-package",
});

export default function TourDetailPage() {
  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Tour Packages", href: "/tours" },
            { name: "Adventures", href: "/tours" },
            { name: "Package Name", href: "/tours/tour-package" },
          ]),
        ]}
      />

      {/* Image Gallery */}
      <section className="bg-[var(--color-background)] pt-0 md:pt-4">
        <div className="max-w-[1400px] mx-auto px-0 md:px-4 lg:px-[100px]">
          <TourImageGallery />
        </div>
      </section>

      {/* Two-column layout: Main content + Sticky sidebar */}
      <section className="bg-[var(--color-background)] py-6 md:py-10 pb-20 lg:pb-10">
        <div className="max-w-[1400px] mx-auto px-0 md:px-4 lg:px-[100px]">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-6 lg:gap-[16px]">
            {/* Main content */}
            <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0 lg:max-w-[928px]">
              <TourDetailInfo />
              <TourItinerarySection />
              <TourDetailReviews />
            </div>

            {/* Sidebar — sticky */}
            <div id="tour-pricing" className="w-full lg:w-[456px] shrink-0">
              <div className="lg:sticky lg:top-[80px]">
                <TourPricingSidebar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom sections */}
      <TourRelatedPackages />
      <NewsletterSection />

      {/* Mobile sticky bottom bar */}
      <TourMobileBottomBar />
    </>
  );
}
