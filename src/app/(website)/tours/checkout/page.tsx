import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo-utils";
import { TourCheckoutContent } from "@/components/sections/tour-checkout/tour-checkout-content";

export const metadata: Metadata = generatePageMetadata({
  title: "Tour Checkout - Book Your Vietnam Adventure",
  description:
    "Complete your booking for an unforgettable Vietnam tour experience. Select your dates, guests, and services.",
  path: "/tours/checkout",
});

export default function TourCheckoutPage() {
  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Tour Packages", href: "/tours" },
            { name: "Checkout", href: "/tours/checkout" },
          ]),
        ]}
      />

      <section className="bg-[var(--color-background)] py-6 md:py-10 pb-20 lg:pb-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[100px]">
          <TourCheckoutContent />
        </div>
      </section>
    </>
  );
}
