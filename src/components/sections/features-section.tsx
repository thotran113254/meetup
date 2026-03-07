import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

export interface Feature {
  icon: keyof typeof LucideIcons;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  className?: string;
}

/**
 * FeaturesSection - Grid of feature cards with Lucide icons, title, and description.
 */
export function FeaturesSection({
  title = "Tinh nang noi bat",
  subtitle,
  features,
  className,
}: FeaturesSectionProps) {
  return (
    <section className={cn("section-padding bg-[var(--color-background)]", className)}>
      <div className="container-wide">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = (LucideIcons as any)[feature.icon] as React.ComponentType<{ className?: string }>;
            return (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 hover:shadow-md transition-shadow"
              >
                {Icon && (
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]">
                    <Icon className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
