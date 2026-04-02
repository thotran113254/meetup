import type { Metadata } from "next";
import { generatePageMetadata, buildServiceJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo-utils";
import { siteConfig } from "@/config/site-config";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { TourImageGallery } from "@/components/sections/tour-detail/tour-image-gallery";
import { ServiceDetailInfo } from "@/components/sections/services/service-detail-info";
import { ServiceProcessSection } from "@/components/sections/services/service-process-section";
import { ServiceIncludeExclude } from "@/components/sections/services/service-include-exclude";
import { ServicePricingSidebar } from "@/components/sections/services/service-pricing-sidebar";
import { TourDetailReviews } from "@/components/sections/tour-detail/tour-detail-reviews";
import { TourMobileBottomBar } from "@/components/sections/tour-detail/tour-mobile-bottom-bar";
import { TourFaqSection } from "@/components/sections/tours/tour-faq-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";

const SERVICE_META: Record<string, { name: string; description: string }> = {
  "fast-track": {
    name: "Fast Track Service",
    description:
      "Priority airport fast track assistance for smooth arrivals and departures in Vietnam. Skip long immigration queues with our VIP lane service.",
  },
  evisa: {
    name: "eVisa Service",
    description:
      "Hassle-free electronic visa processing for travelers visiting Vietnam. Fast approval, minimal paperwork.",
  },
  "airport-pickup": {
    name: "Airport Pickup Service",
    description:
      "Premium private airport transfer with professional drivers and comfortable vehicles throughout Vietnam.",
  },
  esim: {
    name: "eSim Service",
    description:
      "Instant eSIM activation for seamless mobile connectivity throughout Vietnam. No physical SIM needed.",
  },
  "customize-tour": {
    name: "Customize Tour Service",
    description:
      "Fully personalized tour itineraries crafted by local travel experts to match your interests and budget.",
  },
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = SERVICE_META[slug] ?? {
    name: "Travel Service",
    description: "Premium travel services in Vietnam by Meetup Travel.",
  };
  return generatePageMetadata({
    title: meta.name,
    description: meta.description,
    path: `/services/${slug}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(SERVICE_META).map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = SERVICE_META[slug] ?? { name: "Travel Service", description: "" };

  return (
    <>
      <JsonLdScript
        data={[
          buildServiceJsonLd({
            name: meta.name,
            description: meta.description,
            url: `${siteConfig.url}/services/${slug}`,
          }),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Services", href: "/services" },
            { name: meta.name, href: `/services/${slug}` },
          ]),
        ]}
      />

      {/* Image gallery */}
      <section className="bg-[var(--color-background)] pt-0 md:pt-4">
        <div className="max-w-[1400px] mx-auto px-0 md:px-4 lg:px-[100px]">
          <TourImageGallery />
        </div>
      </section>

      {/* Two-column layout: content + sticky sidebar */}
      <section className="bg-[var(--color-background)] py-6 md:py-10 pb-20 lg:pb-10">
        <div className="max-w-[1400px] mx-auto px-0 md:px-4 lg:px-[100px]">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-6 lg:gap-[16px]">
            {/* Left: main content */}
            <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0 lg:max-w-[928px]">
              <ServiceDetailInfo serviceName={meta.name} />
              <ServiceProcessSection />
              <ServiceIncludeExclude />
              <TourDetailReviews />
            </div>

            {/* Right: sticky booking sidebar — desktop only */}
            <div className="hidden lg:block w-[456px] shrink-0">
              <div className="lg:sticky lg:top-[80px]">
                <ServicePricingSidebar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <TourFaqSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Mobile sticky bottom bar */}
      <TourMobileBottomBar />
    </>
  );
}
