import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { generatePageMetadata, buildOrganizationJsonLd } from "@/lib/seo-utils";
import { siteConfig } from "@/config/site-config";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = generatePageMetadata({
  title: "Lien he",
  description: "Lien he voi YourBrand de duoc tu van mien phi ve thiet ke website, SEO va digital marketing. Doi ngu san sang phan hoi trong 24 gio.",
  path: "/contact",
});

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Phone, label: "Dien thoai", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
  {
    icon: MapPin,
    label: "Dia chi",
    value: `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.country}`,
    href: "#map",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLdScript data={buildOrganizationJsonLd()} />
      <Breadcrumbs items={[{ label: "Lien he", href: "/contact" }]} />

      {/* Header */}
      <section className="section-padding bg-gradient-to-b from-[var(--color-accent)]/30 to-transparent">
        <div className="container-narrow text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Lien he <span className="text-[var(--color-primary)]">voi chung toi</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--color-muted-foreground)]">
            Dien form ben duoi hoac lien he truc tiep - chung toi se phan hoi trong vong 24 gio.
          </p>
        </div>
      </section>

      <section className="section-padding bg-[var(--color-background)]">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Thong tin lien he</h2>
                <ul className="space-y-5">
                  {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex items-start gap-4">
                      <div className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-muted-foreground)]">{label}</p>
                        <a href={href} className="font-medium hover:text-[var(--color-primary)] transition-colors">
                          {value}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map placeholder */}
              <div id="map" className="aspect-video rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center">
                <p className="text-sm text-[var(--color-muted-foreground)]">Ban do Google Maps</p>
              </div>
            </div>

            {/* Contact form with react-hook-form + zod validation */}
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
