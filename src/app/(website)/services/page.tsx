export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { generatePageMetadata, buildServiceJsonLd } from "@/lib/seo-utils";
import { siteConfig } from "@/config/site-config";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { ServicesHeroSection } from "@/components/sections/services/services-hero-section";
import { ServicesCardGridSection } from "@/components/sections/services/services-card-grid-section";
import { ServicesFeaturesSection } from "@/components/sections/services/services-features-section";
import { ReviewsSection } from "@/components/sections/homepage/reviews-section";
import { TourFaqSection } from "@/components/sections/tours/tour-faq-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";
import { getSetting } from "@/db/queries/settings-queries";
import type { ServiceCard, ServiceFeature, ServicesPageContent } from "@/lib/types/services-cms-types";

export const metadata: Metadata = generatePageMetadata({
  title: "Services",
  description:
    "Explore Meetup Travel's full range of services: Fast Track, eVisa, Airport Pickup, eSim, and Customize Tour — making your Vietnam journey seamless.",
  path: "/services",
});

const SERVICE_SCHEMAS = [
  { name: "Fast Track Service", description: "Priority airport fast track assistance for smooth arrivals and departures in Vietnam." },
  { name: "eVisa Service", description: "Hassle-free electronic visa processing for travelers visiting Vietnam." },
  { name: "Airport Pickup Service", description: "Premium private airport transfer with professional drivers and comfortable vehicles." },
  { name: "eSim Service", description: "Instant eSIM activation for seamless mobile connectivity throughout Vietnam." },
  { name: "Customize Tour Service", description: "Fully personalized tour itineraries crafted by local travel experts." },
];

export default async function ServicesPage() {
  const jsonLdSchemas = SERVICE_SCHEMAS.map((s) =>
    buildServiceJsonLd({
      name: s.name,
      description: s.description,
      url: `${siteConfig.url}/services`,
    })
  );

  // Load CMS data — fall back silently to component defaults if DB unavailable
  let cmsCards: ServiceCard[] | undefined;
  let cmsFeatures: ServiceFeature[] | undefined;
  let cmsContent: ServicesPageContent | undefined;

  try {
    const [cards, features, content] = await Promise.all([
      getSetting<ServiceCard[]>("services_page_cards"),
      getSetting<ServiceFeature[]>("services_page_features"),
      getSetting<ServicesPageContent>("services_page_content"),
    ]);
    if (Array.isArray(cards) && cards.length > 0) cmsCards = cards;
    if (Array.isArray(features) && features.length > 0) cmsFeatures = features;
    if (content && typeof content === "object" && !Array.isArray(content)) cmsContent = content;
  } catch {
    // DB unavailable — section components will use their built-in fallbacks
  }

  return (
    <>
      <JsonLdScript data={jsonLdSchemas} />
      <ServicesHeroSection />
      <ServicesCardGridSection
        cards={cmsCards}
        title={cmsContent?.gridTitle}
        description={cmsContent?.gridDescription}
      />
      <ServicesFeaturesSection
        features={cmsFeatures}
        title={cmsContent?.featuresTitle}
      />
      <ReviewsSection />
      <TourFaqSection />
      <NewsletterSection />
    </>
  );
}
