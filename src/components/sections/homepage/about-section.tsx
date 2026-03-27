/**
 * AboutSection — "About us" centered layout with quote + clothesline photos.
 * Decorative tilted photo placeholders on a string line, group photo below.
 * Server component — purely visual, no interactivity.
 */

// Clothesline photo items — tilted at alternating angles
const CLOTHESLINE_PHOTOS = [
  { id: 1, rotate: "-rotate-6", width: "w-28", height: "h-24" },
  { id: 2, rotate: "rotate-3", width: "w-24", height: "h-28" },
  { id: 3, rotate: "-rotate-2", width: "w-32", height: "h-24" },
  { id: 4, rotate: "rotate-6", width: "w-24", height: "h-28" },
  { id: 5, rotate: "-rotate-4", width: "w-28", height: "h-24" },
  { id: 6, rotate: "rotate-2", width: "w-24", height: "h-20" },
  { id: 7, rotate: "-rotate-3", width: "w-28", height: "h-24" },
];

export function AboutSection() {
  return (
    <section className="py-10 md:py-14 bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Centered heading + quote */}
        <div className="text-center mb-10 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mb-3">
            About us
          </h2>
          <p className="text-[var(--color-muted-foreground)] text-sm sm:text-base italic">
            &ldquo;Friendship, integrity and a spirit of self-improvement forge the strength of an
            organization that continues to grow.&rdquo;
          </p>
        </div>

        {/* Clothesline — horizontal string with hanging photos */}
        <div className="relative mb-8">
          {/* The string line */}
          <div
            className="absolute left-0 right-0 top-6 h-px bg-[var(--color-primary)] opacity-50"
            aria-hidden="true"
          />

          {/* Photos hanging from the line */}
          <div className="flex items-start justify-center gap-4 flex-wrap px-4 pt-2">
            {CLOTHESLINE_PHOTOS.map((photo) => (
              <div key={photo.id} className="flex flex-col items-center">
                {/* Clothespin dot */}
                <div
                  className="w-2 h-2 rounded-full bg-[var(--color-primary)] mb-1 z-10 relative"
                  aria-hidden="true"
                />
                {/* Photo placeholder — tilted */}
                <div
                  className={`${photo.width} ${photo.height} ${photo.rotate} bg-gray-300 rounded shadow-md border-2 border-white`}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Team group photo placeholder area */}
        <div className="flex items-end justify-center gap-6 mt-4">
          {/* Left landmark illustration placeholder */}
          <div className="hidden md:block w-28 h-32 bg-gray-200 rounded-lg opacity-70" aria-hidden="true" />

          {/* Center group photo */}
          <div className="w-64 h-40 sm:w-80 sm:h-52 bg-gray-300 rounded-xl shadow-md border-2 border-white" aria-label="Team group photo" />

          {/* Right landmark illustration placeholder */}
          <div className="hidden md:block w-24 h-36 bg-gray-200 rounded-lg opacity-70" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
