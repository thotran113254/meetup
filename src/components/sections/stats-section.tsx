"use client";

import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";

export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
}

interface StatsSectionProps {
  stats: Stat[];
  className?: string;
}

/**
 * StatsSection - Full-width band of animated key metrics using NumberTicker.
 */
export function StatsSection({ stats, className }: StatsSectionProps) {
  return (
    <section
      className={cn(
        "section-padding bg-[var(--color-primary)]",
        className
      )}
    >
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-bold text-white sm:text-5xl">
                <NumberTicker
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  className="text-white"
                />
              </p>
              <p className="mt-2 text-base font-semibold text-white/90">
                {stat.label}
              </p>
              {stat.description && (
                <p className="mt-1 text-sm text-white/70">{stat.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
