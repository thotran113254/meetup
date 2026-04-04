import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo-utils";
import { TourCheckoutContent } from "@/components/sections/tour-checkout/tour-checkout-content";
import { getTourPackageBySlug } from "@/db/queries/tour-packages-queries";

export const metadata: Metadata = generatePageMetadata({
  title: "Tour Checkout - Book Your Vietnam Adventure",
  description:
    "Complete your booking for an unforgettable Vietnam tour experience.",
  path: "/tours/checkout",
});

type Props = { searchParams: Promise<{ slug?: string }> };

export default async function TourCheckoutPage({ searchParams }: Props) {
  const { slug } = await searchParams;
  if (!slug) return notFound();

  const tour = await getTourPackageBySlug(slug);
  if (!tour || !tour.published) return notFound();

  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Tour Packages", href: "/tours" },
            { name: "Checkout", href: `/tours/checkout?slug=${slug}` },
          ]),
        ]}
      />
      <section className="bg-[var(--color-background)] py-6 md:py-10 pb-20 lg:pb-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[100px]">
          <TourCheckoutContent tour={tour} />
        </div>
      </section>
    </>
  );
}
