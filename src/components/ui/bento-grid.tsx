import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function BentoCard({
  icon: Icon,
  title,
  description,
  className,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-shadow hover:shadow-lg",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]">
          <Icon className="h-5 w-5 text-[var(--color-accent-foreground)]" />
        </div>
      )}
      <div>
        <h3 className="mb-2 text-lg font-semibold text-[var(--color-card-foreground)]">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {description}
        </p>
      </div>
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
