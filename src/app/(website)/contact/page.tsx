import type { Metadata } from "next";
import { generatePageMetadata, buildOrganizationJsonLd } from "@/lib/seo-utils";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { ContactHeroSection } from "@/components/sections/contact/contact-hero-section";
import { ContactInfoBar } from "@/components/sections/contact/contact-info-bar";
import { ContactPlanningFormSection } from "@/components/sections/contact/contact-planning-form-section";
import { ContactLeaveMessageSection } from "@/components/sections/contact/contact-leave-message-section";
import { ContactFaqGridSection } from "@/components/sections/contact/contact-faq-grid-section";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Meetup Travel local experts. We are available Mon–Sun 06:00 AM – 12:00 AM (GMT+7) to help plan your perfect Vietnam trip.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLdScript data={buildOrganizationJsonLd()} />

      <ContactHeroSection />
      <ContactInfoBar />
      <ContactPlanningFormSection />
      <ContactLeaveMessageSection />
      <ContactFaqGridSection />
    </>
  );
}
