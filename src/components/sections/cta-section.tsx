import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
}

/**
 * CtaSection - Full-width call-to-action banner with gradient background.
 */
export function CtaSection({
  title = "San sang bat dau cung chung toi?",
  description = "Lien he ngay hom nay de duoc tu van mien phi va nhan bao gia tot nhat.",
  primaryCta = { label: "Bat dau ngay", href: "/contact" },
  secondaryCta = { label: "Xem dich vu", href: "/services" },
  className,
}: CtaSectionProps) {
  return (
    <section
      className={cn(
        "section-padding bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-foreground)]",
        className
      )}
    >
      <div className="container-wide text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
          {description}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-[var(--color-primary)] hover:bg-white/90"
          >
            <Link href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
