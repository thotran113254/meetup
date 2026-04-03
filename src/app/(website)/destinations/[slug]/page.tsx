import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo-utils";
import { DestinationDetailHero } from "@/components/sections/destination-detail/destination-detail-hero";
import { DestinationIntroSection } from "@/components/sections/destinations/destination-intro-section";
import { DestinationDetailTourGrid } from "@/components/sections/destination-detail/destination-detail-tour-grid";
import { MostLikedPackageSection } from "@/components/sections/tours/most-liked-package-section";
import { TourFaqSection } from "@/components/sections/tours/tour-faq-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";
import type { TourCardProps } from "@/components/ui/tour-card";

/**
 * Static destination data — in production this would come from DB/CMS.
 * Each destination has its own hero image, city name, and tour listings.
 */
const DESTINATIONS: Record<
  string,
  { name: string; heroImage: string; description: string }
> = {
  hanoi: {
    name: "Hanoi",
    heroImage: "/images/destinations/hero-banner.png",
    description: "Explore Hanoi's ancient streets, temples, and vibrant culture.",
  },
  danang: {
    name: "Danang",
    heroImage: "/images/destinations/danang.png",
    description: "Discover Danang's stunning beaches and Ba Na Hills.",
  },
  halong: {
    name: "Halong",
    heroImage: "/images/destinations/halong.jpg",
    description: "Cruise through Halong Bay's emerald waters and limestone islands.",
  },
  "ho-chi-minh": {
    name: "Ho Chi Minh City",
    heroImage: "/images/destinations/hochiminh.jpg",
    description: "Experience the energy of Vietnam's largest city.",
  },
};

/** Sample day tour cards — 8 items for 4x2 grid */
const DAY_TOURS: TourCardProps[] = Array.from({ length: 8 }, (_, i) => ({
  image: `/images/tour-${(i % 4) + 1}-${["floating-market", "hoi-an", "mekong", "palm-trees"][i % 4]}.png`,
  title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Small Group < pax",
  price: 669,
  duration: "4D3N",
  spots: 3,
  tags: ["Adventure", "Solo"],
  slug: `day-tour-${i + 1}`,
}));

/** Sample tour package cards — 8 items for 4x2 grid */
const TOUR_PACKAGES: TourCardProps[] = Array.from({ length: 8 }, (_, i) => ({
  image: `/images/tour-${(i % 4) + 1}-${["floating-market", "hoi-an", "mekong", "palm-trees"][i % 4]}.png`,
  title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
  price: 669,
  duration: "4D3N",
  spots: 3,
  tags: ["Adventure", "Solo"],
  slug: `tour-package-${i + 1}`,
}));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = DESTINATIONS[slug];
  const name = dest?.name ?? "Destination";

  return generatePageMetadata({
    title: `${name} - Explore Tours & Packages`,
    description:
      dest?.description ??
      `Discover the best tours and packages in ${name}. Customized itineraries by local experts.`,
    path: `/destinations/${slug}`,
  });
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = DESTINATIONS[slug] ?? DESTINATIONS.hanoi;

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

      <DestinationDetailHero
        cityName={dest.name}
        heroImage={dest.heroImage}
      />

      <DestinationIntroSection />

      <DestinationDetailTourGrid
        title={`${dest.name} day tour`}
        variant="day-tour"
        tours={DAY_TOURS}
      />

      <DestinationDetailTourGrid
        title={`${dest.name} tour package`}
        variant="package"
        tours={TOUR_PACKAGES}
      />

      <MostLikedPackageSection />

      <TourFaqSection />

      <NewsletterSection />
    </>
  );
}
