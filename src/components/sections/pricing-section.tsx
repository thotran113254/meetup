import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
  badge?: string;
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  className?: string;
}

/**
 * PricingSection - Pricing cards grid; highlighted plan gets primary styling.
 */
export function PricingSection({
  title = "Bang gia dich vu",
  subtitle,
  plans,
  className,
}: PricingSectionProps) {
  return (
    <section className={cn("section-padding bg-[var(--color-background)]", className)}>
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={cn(
                "relative rounded-2xl border p-8 flex flex-col gap-6",
                plan.highlighted
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xl scale-105"
                  : "border-[var(--color-border)] bg-[var(--color-card)]"
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1">
                  {plan.badge}
                </span>
              )}

              <div>
                <p className={cn("font-semibold text-lg", plan.highlighted && "text-white/90")}>
                  {plan.name}
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className={cn("text-sm", plan.highlighted ? "text-white/70" : "text-[var(--color-muted-foreground)]")}>
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className={cn("mt-2 text-sm", plan.highlighted ? "text-white/80" : "text-[var(--color-muted-foreground)]")}>
                  {plan.description}
                </p>
              </div>

              <ul className="flex-1 space-y-3">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm">
                    <Check className={cn("h-4 w-4 mt-0.5 flex-shrink-0", plan.highlighted ? "text-white" : "text-[var(--color-primary)]")} />
                    <span className={plan.highlighted ? "text-white/90" : ""}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.highlighted ? "outline" : "default"}
                className={plan.highlighted ? "border-white text-white hover:bg-white hover:text-[var(--color-primary)]" : ""}
              >
                <Link href={plan.cta.href}>{plan.cta.label}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
