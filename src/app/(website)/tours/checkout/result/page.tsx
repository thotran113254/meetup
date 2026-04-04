import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo-utils";
import { getBookingByCode } from "@/db/queries/booking-queries";
import { TourCheckoutResultContent } from "@/components/sections/tour-checkout/tour-checkout-result-content";

export const metadata: Metadata = generatePageMetadata({
  title: "Booking Result - Meetup Travel",
  description: "Your tour booking payment result.",
  path: "/tours/checkout/result",
});

type Props = { searchParams: Promise<{ code?: string; error?: string }> };

export default async function CheckoutResultPage({ searchParams }: Props) {
  const { code, error } = await searchParams;
  const booking = code ? await getBookingByCode(code) : null;

  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Tour Packages", href: "/tours" },
            { name: "Booking Result", href: "/tours/checkout/result" },
          ]),
        ]}
      />
      <section className="bg-[var(--color-background)] py-10 md:py-16 min-h-[60vh]">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6">
          <TourCheckoutResultContent booking={booking} errorType={error} />
        </div>
      </section>
    </>
  );
}
