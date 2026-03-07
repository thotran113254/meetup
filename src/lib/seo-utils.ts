import type { Metadata } from "next";
import { siteConfig } from "@/config/site-config";

/**
 * SEO & GEO utility functions for generating metadata and structured data.
 * Centralized so every page uses consistent patterns.
 */

type PageSeoParams = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

/** Generate consistent metadata for any page */
export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: PageSeoParams): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.seo.locale,
      type,
      images: [
        {
          url: ogImage.startsWith("http")
            ? ogImage
            : `${siteConfig.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: siteConfig.seo.twitterHandle,
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

// --- JSON-LD Structured Data Builders ---

/** Organization schema - for homepage */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.country,
      postalCode: siteConfig.address.zip,
    },
    sameAs: Object.values(siteConfig.socials).filter(Boolean),
  };
}

/** WebSite schema with search action - for homepage */
export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** Article schema - for blog posts */
export function buildArticleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${siteConfig.url}/blog/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/images/logo.png` },
    },
    image: article.image || `${siteConfig.url}${siteConfig.ogImage}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${article.slug}`,
    },
  };
}

/** FAQ schema - for FAQ sections (boosts GEO) */
export function buildFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Service schema - for services page */
export function buildServiceJsonLd(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/** Breadcrumb schema */
export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; href: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}
