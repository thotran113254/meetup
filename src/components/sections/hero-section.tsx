import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGradientBadge, AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ParticlesBackground } from "@/components/ui/particles-background";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
}

/**
 * HeroSection - Full-width hero with animated badge, gradient headline, particles, and CTA buttons.
 */
export function HeroSection({
  badge,
  title,
  titleHighlight,
  description,
  primaryCta,
  secondaryCta,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "section-padding relative overflow-hidden bg-gradient-to-b from-[var(--color-accent)]/30 to-transparent",
        className
      )}
    >
      <ParticlesBackground quantity={50} color="#6366f1" />

      <div className="container-wide relative z-10 text-center">
        {badge && (
          <div className="mb-6">
            <AnimatedGradientBadge>{badge}</AnimatedGradientBadge>
          </div>
        )}

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title}{" "}
          {titleHighlight && (
            <AnimatedGradientText>{titleHighlight}</AnimatedGradientText>
          )}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-muted-foreground)] leading-relaxed">
          {description}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          {secondaryCta && (
            <Button asChild variant="outline" size="lg">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
