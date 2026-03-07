"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card";

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating?: number;
  avatar?: string;
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
}

/**
 * TestimonialsSection - Grid of customer testimonial cards with star ratings.
 */
export function TestimonialsSection({
  title = "Khach hang noi gi ve chung toi",
  subtitle,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  return (
    <section className={cn("section-padding bg-[var(--color-muted)]", className)}>
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <MagicCard
              key={i}
              className="p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating ?? 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-sm text-[var(--color-foreground)] leading-relaxed flex-1">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-border)]">
                {/* Avatar placeholder */}
                <div className="h-10 w-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
