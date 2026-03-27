/**
 * AboutSection — "About us" with quote, clothesline photo gallery, and team photos.
 * Figma node 13289:45217.
 * Clothesline: 7 tilted photo placeholders hanging from a wavy teal SVG line.
 * Below: center group photo (458x367) + right building image (509x341) with mist overlay.
 * Server component — purely visual, no interactivity.
 */

// Clothesline photo items — alternating tilt angles, varying sizes per Figma
const CLOTHESLINE_PHOTOS = [
  { id: 1, rotate: -6,  width: 112, height: 96  },
  { id: 2, rotate:  3,  width: 96,  height: 112 },
  { id: 3, rotate: -2,  width: 128, height: 96  },
  { id: 4, rotate:  6,  width: 96,  height: 112 },
  { id: 5, rotate: -4,  width: 112, height: 96  },
  { id: 6, rotate:  2,  width: 96,  height: 80  },
  { id: 7, rotate: -3,  width: 112, height: 96  },
];

export function AboutSection() {
  return (
    <section className="py-[50px] bg-[var(--color-background)]">
      <div className="container-wide">

        {/* Heading + italic quote — centered, max 2xl */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-[38px] font-bold text-[var(--color-foreground)] mb-4 leading-tight">
            About us
          </h2>
          <p className="text-[var(--color-muted-foreground)] text-base italic leading-relaxed">
            &ldquo;Friendship, integrity and a spirit of self-improvement forge the strength of an
            organization that continues to grow.&rdquo;
          </p>
        </div>

        {/* Clothesline — wavy SVG string with hanging tilted photos */}
        <div className="relative mb-8">
          {/* Wavy teal string line with pin attachment points */}
          <svg
            className="absolute top-0 left-0 w-full pointer-events-none"
            style={{ height: "32px" }}
            viewBox="0 0 1200 32"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 0,16 Q 85,4 170,16 Q 255,28 340,16 Q 425,4 510,16 Q 595,28 680,16 Q 765,4 850,16 Q 935,28 1020,16 Q 1105,4 1200,16"
              stroke="#2CBCB3"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.7"
            />
            {/* Pin dots at attachment points — evenly spaced across 7 positions */}
            {[85, 255, 425, 595, 765, 935, 1105].map((x) => (
              <circle key={x} cx={x} cy={16} r={4} fill="#2CBCB3" fillOpacity="0.8" />
            ))}
          </svg>

          {/* Photos row — positioned below the string line */}
          <div className="flex items-start justify-center gap-2 sm:gap-4 flex-wrap pt-5 px-2">
            {CLOTHESLINE_PHOTOS.map((photo) => (
              <div key={photo.id} className="flex flex-col items-center">
                {/* Short string from pin to photo */}
                <div
                  className="w-px bg-[#2CBCB3] opacity-50"
                  style={{ height: "14px" }}
                  aria-hidden="true"
                />
                {/* Tilted photo placeholder */}
                <div
                  className="bg-gray-300 rounded shadow-md border-2 border-white"
                  style={{
                    width: `${photo.width}px`,
                    height: `${photo.height}px`,
                    transform: `rotate(${photo.rotate}deg)`,
                  }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Team photo area — group photo center, building image right */}
        <div className="relative flex items-end justify-center gap-4 mt-6 overflow-hidden">
          {/* Center: group photo placeholder (458x367 per Figma) */}
          <div className="relative flex-shrink-0">
            <div
              className="bg-gray-300 rounded-xl shadow-lg border-2 border-white"
              style={{ width: "458px", maxWidth: "100%", height: "367px" }}
              aria-label="Team group photo"
            />
            {/* White mist / cloud fade at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{
                height: "80px",
                background: "linear-gradient(to top, var(--color-background) 0%, transparent 100%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Right: building / landmark placeholder (509x341 per Figma) */}
          <div
            className="hidden md:block relative bg-gray-200 rounded-xl shadow border border-gray-100 flex-shrink-0"
            style={{ width: "509px", height: "341px" }}
            aria-hidden="true"
          >
            {/* Mist overlay at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 rounded-b-xl pointer-events-none"
              style={{
                height: "60px",
                background: "linear-gradient(to top, var(--color-background) 0%, transparent 100%)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
