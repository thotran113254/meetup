import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/homepage/hero-section";
import { TourPackageSection } from "@/components/sections/homepage/tour-package-section";
import { ReviewsSection } from "@/components/sections/homepage/reviews-section";
import { ExperienceSection } from "@/components/sections/homepage/experience-section";
import { ServicesSection } from "@/components/sections/homepage/services-section";
import { EticketsSection } from "@/components/sections/homepage/etickets-section";
import { YoutubeSection } from "@/components/sections/homepage/youtube-section";
import { AboutSection } from "@/components/sections/homepage/about-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";
import { LatestPostsSection } from "@/components/sections/homepage/latest-posts-section";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo-utils";

export const metadata: Metadata = generatePageMetadata({
  title: "Meetup Travel - Where Local Experts Craft A Journey Uniquely Yours",
  description:
    "Discover Vietnam with local experts. Customized tours, eTickets, visa services and more. Friendship, integrity and a spirit of self-improvement.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />

      <HeroSection />
      <TourPackageSection />
      <ReviewsSection />
      <ExperienceSection region="North" />
      <ExperienceSection region="Mid" />
      <ExperienceSection region="South" />
      <ServicesSection />
      <LatestPostsSection />
      <EticketsSection />
      <YoutubeSection />
      <AboutSection />
      <NewsletterSection />
    </>
  );
}
