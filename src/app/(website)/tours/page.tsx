// Always render fresh from DB — never use static/cached HTML
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { generatePageMetadata, buildOrganizationJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo-utils";
import { ToursHeroSection } from "@/components/sections/tours/tours-hero-section";
import { VietnamIntroSection } from "@/components/sections/tours/vietnam-intro-section";
import { MostLikedPackageSection } from "@/components/sections/tours/most-liked-package-section";
import { TourPackageGridSection } from "@/components/sections/tours/tour-package-grid-section";
import { ReviewsSection } from "@/components/sections/homepage/reviews-section";
import { TourFaqSection } from "@/components/sections/tours/tour-faq-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";
import { getSetting } from "@/db/queries/settings-queries";
import { getPublishedTourPackages, getTourPackagesBySlugs } from "@/db/queries/tour-packages-queries";
import type {
  VietnamStat,
  ToursPageContent,
  ToursHeroContent,
  TourFaqItem,
  MostLikedContent,
  TourPackageGridContent,
} from "@/lib/types/tours-cms-types";

export const metadata: Metadata = generatePageMetadata({
  title: "Tour Packages - Explore Vietnam with Local Experts",
  description:
    "Browse curated tour packages across Vietnam. Filter by style and duration. Book authentic local-guided experiences in North, Mid, and South Vietnam.",
  path: "/tours",
});

export default async function ToursPage() {
  let cmsHero: ToursHeroContent | undefined;
  let cmsStats: VietnamStat[] | undefined;
  let cmsContent: ToursPageContent | undefined;
  let cmsFaq: TourFaqItem[] | undefined;
  let cmsMostLiked: MostLikedContent | undefined;
  let cmsPackageGrid: TourPackageGridContent | undefined;

  try {
    const [hero, stats, content, faq, mostLiked, packageGrid] = await Promise.all([
      getSetting<ToursHeroContent>("tours_hero"),
      getSetting<VietnamStat[]>("tours_page_stats"),
      getSetting<ToursPageContent>("tours_page_content"),
      getSetting<TourFaqItem[]>("tours_faq"),
      getSetting<MostLikedContent>("tours_most_liked"),
      getSetting<TourPackageGridContent>("tours_package_grid"),
    ]);
    if (hero && typeof hero === "object" && !Array.isArray(hero)) cmsHero = hero;
    if (Array.isArray(stats) && stats.length > 0) cmsStats = stats;
    if (content && typeof content === "object" && !Array.isArray(content)) cmsContent = content;
    if (Array.isArray(faq) && faq.length > 0) cmsFaq = faq;
    if (mostLiked && typeof mostLiked === "object" && !Array.isArray(mostLiked)) cmsMostLiked = mostLiked;
    if (packageGrid && typeof packageGrid === "object" && !Array.isArray(packageGrid)) cmsPackageGrid = packageGrid;
  } catch {}

  // Fetch published tours — used to populate sections
  const allPublished = await getPublishedTourPackages().catch(() => []);

  // "Most Liked Package": use selected slugs or fall back to first 2
  const featuredSlugs = cmsMostLiked?.tourSlugs ?? [];
  const mostLikedTours = featuredSlugs.length > 0
    ? await getTourPackagesBySlugs(featuredSlugs).catch(() => [])
    : allPublished.slice(0, 2);

  // "Tour Package Grid": use selected slugs or fall back to all published
  const gridSlugs = cmsPackageGrid?.tourSlugs ?? [];
  const gridPackages = gridSlugs.length > 0
    ? await getTourPackagesBySlugs(gridSlugs).catch(() => [])
    : allPublished;

  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: cmsHero?.breadcrumbLabel ?? "Tour Packages", href: "/tours" },
          ]),
        ]}
      />

      <ToursHeroSection
        heroImage={cmsHero?.heroImage}
        marqueeText={cmsHero?.marqueeText}
        breadcrumbLabel={cmsHero?.breadcrumbLabel}
      />
      <VietnamIntroSection
        introTitle={cmsContent?.introTitle}
        stats={cmsStats}
        description={cmsContent?.introDescription || undefined}
      />
      <MostLikedPackageSection
        sectionTitle={cmsMostLiked?.sectionTitle}
        tours={mostLikedTours}
      />
      <TourPackageGridSection
        sectionTitle={cmsPackageGrid?.sectionTitle}
        packages={gridPackages}
      />
      <ReviewsSection />
      <TourFaqSection faqItems={cmsFaq} />
      <NewsletterSection />
    </>
  );
}
