import Image from "next/image";

/**
 * HeroSection — Meetup Travel homepage hero banner.
 * Uses the original Figma hero asset (1600x524) as a full-width responsive image.
 * Text is baked into the image from design; hidden text kept for SEO/accessibility.
 * Server component — no interactivity needed.
 */
export function HeroSection() {
  return (
    <section className="relative w-full bg-[var(--color-background)]">
      {/* Full-width hero banner from Figma */}
      <div className="relative w-full" style={{ aspectRatio: "1600 / 524" }}>
        <Image
          src="/images/hero-banner.png"
          alt="Welcome to Meetup — Where local experts craft a journey uniquely yours"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Hidden text for SEO — visually hidden but readable by search engines */}
      <h1 className="sr-only">
        Welcome to Meetup — Where Local Experts Craft A Journey Uniquely Yours
      </h1>
    </section>
  );
}
