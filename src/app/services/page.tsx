import type { Metadata } from "next";
import Link from "next/link";
import { Monitor, Smartphone, Search, BarChart3, ShoppingCart, Headphones } from "lucide-react";
import { generatePageMetadata, buildServiceJsonLd } from "@/lib/seo-utils";
import { siteConfig } from "@/config/site-config";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata: Metadata = generatePageMetadata({
  title: "Dich vu",
  description: "Kham pha day du cac dich vu thiet ke website, phat trien ung dung, SEO va marketing so cua YourBrand danh cho doanh nghiep Viet Nam.",
  path: "/services",
});

const SERVICES = [
  {
    icon: Monitor,
    title: "Thiet ke Website",
    description: "Thiet ke giao dien dep, hien dai, toi uu trai nghiem nguoi dung. Moi website deu duoc tuy chinh rieng, khong dung template co san.",
    href: "/services#web-design",
    id: "web-design",
  },
  {
    icon: Smartphone,
    title: "Phat trien Ung dung",
    description: "Xay dung ung dung web va mobile voi React, Next.js, React Native. Hieu suat cao, bao mat, de mo rong.",
    href: "/services#app-dev",
    id: "app-dev",
  },
  {
    icon: Search,
    title: "SEO & GEO Optimization",
    description: "Toi uu hoa website len top Google voi chien luoc SEO on-page, off-page va GEO cho AI search engines.",
    href: "/services#seo",
    id: "seo",
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    description: "Chien dich quang cao Google Ads, Facebook Ads, email marketing voi ROI do luong ro rang.",
    href: "/services#marketing",
    id: "marketing",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Xay dung cua hang truc tuyen day du chuc nang: quan ly san pham, gio hang, thanh toan, van chuyen.",
    href: "/services#ecommerce",
    id: "ecommerce",
  },
  {
    icon: Headphones,
    title: "Ho tro & Bao tri",
    description: "Dich vu bao tri, cap nhat, sao luu va ho tro ky thuat 24/7 dam bao website hoat dong on dinh.",
    href: "/services#support",
    id: "support",
  },
];

export default function ServicesPage() {
  const jsonLdSchemas = SERVICES.map((s) =>
    buildServiceJsonLd({ name: s.title, description: s.description, url: `${siteConfig.url}${s.href}` })
  );

  return (
    <>
      <JsonLdScript data={jsonLdSchemas} />
      <Breadcrumbs items={[{ label: "Dich vu", href: "/services" }]} />

      {/* Header */}
      <section className="section-padding bg-gradient-to-b from-[var(--color-accent)]/30 to-transparent">
        <div className="container-narrow text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Dich vu <span className="text-[var(--color-primary)]">chuyen nghiep</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--color-muted-foreground)] leading-relaxed">
            Giai phap so hoa toan dien giup doanh nghiep cua ban phat trien manh me trong ky nguyen so.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding bg-[var(--color-background)]">
        <div className="container-wide">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 hover:shadow-lg hover:border-[var(--color-primary)]/50 transition-all"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent)]">
                    <Icon className="h-6 w-6 text-[var(--color-primary)]" />
                  </div>
                  <h2 className="text-xl font-semibold mb-3">{service.title}</h2>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
                  >
                    Tu van mien phi &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaSection
        title="Ban can giai phap nao?"
        description="Lien he ngay de duoc tu van mien phi va nhan bao gia chi tiet trong 24 gio."
        primaryCta={{ label: "Nhan bao gia mien phi", href: "/contact" }}
        secondaryCta={{ label: "Xem bang gia", href: "/#pricing" }}
      />
    </>
  );
}
