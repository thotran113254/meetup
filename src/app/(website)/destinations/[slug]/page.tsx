import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { generatePageMetadata, buildOrganizationJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo-utils";
import { DestinationDetailHero } from "@/components/sections/destination-detail/destination-detail-hero";
import { DestinationIntroSection } from "@/components/sections/destinations/destination-intro-section";
import { DestinationDetailTourGrid } from "@/components/sections/destination-detail/destination-detail-tour-grid";
import { MostLikedPackageSection } from "@/components/sections/tours/most-liked-package-section";
import { TourFaqSection } from "@/components/sections/tours/tour-faq-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";
import { getSetting } from "@/db/queries/settings-queries";
import { getPublishedTourPackages, getTourPackagesBySlugs } from "@/db/queries/tour-packages-queries";
import type { DestinationItem, DestinationsPageContent } from "@/lib/types/destinations-cms-types";
import type { MostLikedContent, TourFaqItem } from "@/lib/types/tours-cms-types";
import type { TourCardProps } from "@/components/ui/tour-card";

type Props = { params: Promise<{ slug: string }> };

function toTourCardProps(tour: Awaited<ReturnType<typeof getPublishedTourPackages>>[number]): TourCardProps {
  return { image: tour.image, title: tour.title, price: tour.price, duration: tour.duration, spots: tour.spots, tags: tour.tags, slug: tour.slug };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const list = await getSetting<DestinationItem[]>("destinations_list").catch(() => null);
  const dest = list?.find((d) => d.slug === slug);
  if (!dest) return generatePageMetadata({ title: "Destination", description: "Explore Vietnam destinations.", path: `/destinations/${slug}` });
  return generatePageMetadata({
    title: `${dest.name} - Explore Tours & Packages`,
    description: dest.description || `Discover the best tours in ${dest.name}.`,
    path: `/destinations/${slug}`,
    image: dest.image || undefined,
  });
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;

  const [destinationList, pageContent, allTours, mostLikedSetting, faqItems] = await Promise.all([
    getSetting<DestinationItem[]>("destinations_list").catch(() => null),
    getSetting<DestinationsPageContent>("destinations_page_content").catch(() => null),
    getPublishedTourPackages().catch(() => []),
    getSetting<MostLikedContent>("tours_most_liked").catch(() => null),
    getSetting<TourFaqItem[]>("tours_faq").catch(() => null),
  ]);

  const dest = destinationList?.find((d) => d.slug === slug);
  if (!dest) notFound();

  // Most liked tours for the section at the bottom
  const mostLikedSlugs = mostLikedSetting?.tourSlugs ?? [];
  const mostLikedTours = mostLikedSlugs.length > 0
    ? await getTourPackagesBySlugs(mostLikedSlugs).catch(() => [])
    : allTours.slice(0, 2);

  // Tour grids — show published tours (max 8 per grid)
  const tourCards = allTours.slice(0, 8).map(toTourCardProps);

  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Destination", href: "/destinations" },
            { name: dest.name, href: `/destinations/${slug}` },
          ]),
        ]}
      />

      <DestinationDetailHero cityName={dest.name} heroImage={dest.image} />

      <DestinationIntroSection
        introTitle={pageContent?.introTitle}
        city={dest.name}
        description={dest.description}
      />

      <DestinationDetailTourGrid
        title={`${dest.name} day tour`}
        variant="day-tour"
        tours={tourCards}
      />

      <DestinationDetailTourGrid
        title={`${dest.name} tour package`}
        variant="package"
        tours={tourCards}
      />

      <MostLikedPackageSection
        sectionTitle={mostLikedSetting?.sectionTitle}
        tours={mostLikedTours}
      />

      <TourFaqSection faqItems={faqItems ?? undefined} />

      <NewsletterSection />
    </>
  );
}
