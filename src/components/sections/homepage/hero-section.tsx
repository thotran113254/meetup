import Image from "next/image";

/**
 * HeroSection — Meetup Travel homepage hero.
 * Full-width section with centered script heading over a Vietnam landmark photo strip,
 * team burst photo anchored to the right side, and airplane decoration bottom-left.
 * Layout matches Figma: text centered (z-10), landmarks at bottom (z-0), team burst right (z-5).
 * Server component — no interactivity needed.
 */
export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-background)]">
      <div className="container-wide relative min-h-[520px] md:min-h-[560px] py-10 flex flex-col items-center justify-start">

        {/* Text content — centered horizontally, on top */}
        <div className="relative z-10 text-center pt-6 md:pt-10 pb-4 max-w-3xl mx-auto">
          {/* Script font welcome line in accent orange */}
          <p
            className="font-[family-name:var(--font-script)] text-[var(--color-accent)] text-5xl sm:text-6xl lg:text-7xl leading-tight mb-4"
            aria-label="Welcome to Meetup"
          >
            Welcome to Meetup
          </p>

          {/* Bold uppercase tagline in dark foreground */}
          <h1 className="text-[var(--color-foreground)] font-extrabold uppercase text-2xl sm:text-3xl lg:text-[2.75rem] leading-tight tracking-tight">
            Where local experts craft a journey uniquely yours
          </h1>
        </div>

        {/* Landmarks photo strip — full width, anchored to bottom, behind text */}
        <div className="absolute bottom-0 left-0 right-0 h-[55%] z-0">
          <Image
            src="/images/hero-landmarks.png"
            alt="Vietnam landmarks — Ho Chi Minh Mausoleum, travelers, temples"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>

        {/* Team burst — absolute positioned on right side, overlapping top-right */}
        <div className="absolute right-0 md:right-8 top-4 md:top-0 w-[200px] h-[250px] sm:w-[280px] sm:h-[350px] md:w-[340px] md:h-[430px] z-[5]">
          <Image
            src="/images/hero-team-burst.png"
            alt="Meetup Travel team"
            fill
            className="object-contain object-right-top"
            priority
            sizes="(max-width: 768px) 200px, 340px"
          />
        </div>

        {/* Airplane decoration — bottom-left */}
        <span
          className="absolute bottom-12 left-12 text-3xl rotate-45 text-[var(--color-accent)] select-none z-10"
          aria-hidden="true"
        >
          ✈
        </span>
      </div>
    </section>
  );
}
