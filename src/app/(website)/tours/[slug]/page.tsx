import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { generatePageMetadata, buildOrganizationJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo-utils";
import { TourImageGallery } from "@/components/sections/tour-detail/tour-image-gallery";
import { TourDetailInfo } from "@/components/sections/tour-detail/tour-detail-info";
import { TourItinerarySection } from "@/components/sections/tour-detail/tour-itinerary-section";
import { TourPricingSidebar } from "@/components/sections/tour-detail/tour-pricing-sidebar";
import { TourDetailReviews } from "@/components/sections/tour-detail/tour-detail-reviews";
import { TourRelatedPackages } from "@/components/sections/tour-detail/tour-related-packages";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";
import { TourMobileBottomBar } from "@/components/sections/tour-detail/tour-mobile-bottom-bar";
import { getTourPackageBySlug, getPublishedTourPackages } from "@/db/queries/tour-packages-queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourPackageBySlug(slug).catch(() => null);
  if (!tour) return generatePageMetadata({ title: "Tour Not Found", description: "Tour not found.", path: "/tours" });
  return generatePageMetadata({
    title: `${tour.title} - Meetup Travel`,
    description: tour.description || "Explore Vietnam with local experts.",
    path: `/tours/${tour.slug}`,
    image: tour.image || undefined,
  });
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const [tour, allTours] = await Promise.all([
    getTourPackageBySlug(slug).catch(() => null),
    getPublishedTourPackages().catch(() => []),
  ]);

  if (!tour) notFound();

  // Related tours: other published tours, max 4, excluding current
  const relatedTours = allTours.filter((t) => t.slug !== slug).slice(0, 4);

  // Gallery: cover image + extra gallery images
  const galleryImages = [tour.image, ...tour.gallery].filter(Boolean);

  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Tour Packages", href: "/tours" },
            { name: tour.title, href: `/tours/${tour.slug}` },
          ]),
        ]}
      />

      {/* Image Gallery */}
      <section className="bg-[var(--color-background)] pt-0 md:pt-4">
        <div className="max-w-[1400px] mx-auto px-0 md:px-4 lg:px-[100px]">
          <TourImageGallery images={galleryImages} tourName={tour.title} />
        </div>
      </section>

      {/* Two-column layout: Main content + Sticky sidebar */}
      <section className="bg-[var(--color-background)] py-6 md:py-10 pb-20 lg:pb-10">
        <div className="max-w-[1400px] mx-auto px-0 md:px-4 lg:px-[100px]">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-6 lg:gap-[16px]">
            <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0 lg:max-w-[928px]">
              <TourDetailInfo
                title={tour.title}
                duration={tour.duration}
                spots={tour.spots}
                tags={tour.tags}
                description={tour.description}
                groupSize={tour.groupSize}
                tripType={tour.tripType}
                rangeLabel={tour.rangeLabel}
                tourPace={tour.tourPace}
                physicalRating={tour.physicalRating}
                places={tour.places}
              />
              <TourItinerarySection itinerary={tour.itinerary} />
              <TourDetailReviews />
            </div>

            <div id="tour-pricing" className="w-full lg:w-[456px] shrink-0">
              <div className="lg:sticky lg:top-[80px]">
                <TourPricingSidebar pricingOptions={tour.pricingOptions} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TourRelatedPackages relatedTours={relatedTours} />
      <NewsletterSection />
      <TourMobileBottomBar />
    </>
  );
}
