import Image from "next/image";

/**
 * HeroSection — Meetup Travel homepage hero banner.
 * Uses the original Figma hero asset (1600x524) as a full-width responsive image.
 * Text is baked into the image from design; hidden text kept for SEO/accessibility.
 * Server component — no interactivity needed.
 */
export function HeroSection() {
  return (
    <section className="w-full bg-[var(--color-background)] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* Hero banner with rounded corners and padding — matches Figma frame */}
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl" style={{ aspectRatio: "1546 / 487" }}>
        <Image
          src="/images/hero-banner.png"
          alt="Welcome to Meetup — Where local experts craft a journey uniquely yours"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </div>

      {/* Hidden text for SEO — visually hidden but readable by search engines */}
      <h1 className="sr-only">
        Welcome to Meetup — Where Local Experts Craft A Journey Uniquely Yours
      </h1>
    </section>
  );
}
