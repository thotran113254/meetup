import Image from "next/image";

/**
 * HeroSection — Meetup Travel homepage hero.
 * Full-width white section with script "Welcome to Meetup" heading on the left,
 * bold uppercase tagline, and a Vietnam landmark photo collage on the right.
 * Server component — no interactivity needed.
 */
export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-background)]">
      <div className="container-wide flex flex-col lg:flex-row items-center min-h-[480px] py-10 lg:py-0">
        {/* Left: text content */}
        <div className="flex-1 z-10 flex flex-col justify-center py-10 lg:py-16 pr-0 lg:pr-8">
          {/* Script font welcome line */}
          <p
            className="font-[family-name:var(--font-script)] text-[var(--color-accent)] text-5xl sm:text-6xl lg:text-7xl leading-tight mb-4"
            aria-label="Welcome to Meetup"
          >
            Welcome to Meetup
          </p>

          {/* Bold uppercase tagline */}
          <h1 className="text-[var(--color-primary)] font-extrabold uppercase text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight max-w-xl">
            Where local experts craft a journey uniquely yours
          </h1>
        </div>

        {/* Right: photo collage — landmark images + team burst */}
        <div className="relative flex-1 flex items-center justify-center min-h-[320px] lg:min-h-[480px] w-full lg:w-auto">
          {/* Background landmark strip */}
          <div className="absolute inset-0 flex gap-2 overflow-hidden rounded-xl">
            {/* Left landmark placeholder */}
            <div className="relative flex-1 bg-gray-200 rounded-l-xl overflow-hidden">
              <Image
                src="/images/placeholder.svg"
                alt="Vietnam landmarks"
                fill
                className="object-cover"
                priority
              />
              {/* Gray overlay for landmark feel */}
              <div className="absolute inset-0 bg-gray-400/30" />
            </div>
            {/* Center landmark placeholder */}
            <div className="relative flex-1 bg-gray-300 overflow-hidden">
              <Image
                src="/images/placeholder.svg"
                alt="Vietnam temple"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gray-300/40" />
            </div>
          </div>

          {/* Yellow burst / team photo overlay */}
          <div className="relative z-10 flex items-center justify-center w-56 h-56 sm:w-72 sm:h-72 ml-auto mr-4">
            {/* Yellow blob background */}
            <div
              className="absolute inset-0 bg-[#FACC15] rounded-[60%_40%_55%_45%/50%_60%_40%_50%]"
              aria-hidden="true"
            />
            {/* Team group photo placeholder */}
            <div className="relative z-10 w-44 h-44 sm:w-60 sm:h-60 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
              <Image
                src="/images/placeholder.svg"
                alt="Meetup Travel team"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Airplane decoration */}
          <span
            className="absolute bottom-8 left-8 text-3xl rotate-45 text-[var(--color-accent)] select-none"
            aria-hidden="true"
          >
            ✈
          </span>
        </div>
      </div>
    </section>
  );
}
