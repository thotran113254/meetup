/**
 * ExperienceSection — Reusable "Best experience in [Region]" tour grid.
 * Used three times on homepage: North, Mid, South.
 * Server component — static mock tour data, no client interactivity.
 */

type TourCard = {
  id: number;
  title: string;
  price: string;
  tags: string[];
};

// Static mock data — same cards used for all regions (placeholder until real data)
const MOCK_TOURS: TourCard[] = [
  { id: 1, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 2, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 3, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 4, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 5, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", tags: ["Adventure", "Solo"] },
  { id: 6, title: "Cu Chi Tunnels and Mekong Delta Full Day Tour S...", price: "$669", tags: ["Adventure", "Solo"] },
];

type ExperienceSectionProps = {
  region: string;
  description?: string;
};

export function ExperienceSection({ region, description }: ExperienceSectionProps) {
  return (
    <section className="py-10 md:py-14 bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Heading with colored region name */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mb-2">
          Best experience in{" "}
          <span className="text-[var(--color-primary)]">{region}</span>...
        </h2>
        {description && (
          <p className="text-[var(--color-muted-foreground)] mb-6 max-w-xl">{description}</p>
        )}

        {/* Tour card grid — 3 columns desktop, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_TOURS.map((tour) => (
            <div
              key={tour.id}
              className="rounded-xl overflow-hidden bg-[var(--color-card)] shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow"
            >
              {/* Image placeholder */}
              <div className="relative w-full h-48 bg-gray-300">
                {/* Price badge */}
                <span className="absolute bottom-3 left-3 bg-white/90 text-[var(--color-foreground)] text-sm font-semibold px-2 py-0.5 rounded">
                  From {tour.price}
                </span>
              </div>

              {/* Card content */}
              <div className="p-3">
                {/* Tags */}
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  {tour.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <p className="text-sm font-medium text-[var(--color-foreground)] line-clamp-2">
                  {tour.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
