"use client";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span className={cn(
      "inline-flex bg-gradient-to-r from-[var(--color-primary)] via-purple-500 to-pink-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-shift",
      className
    )}>
      {children}
    </span>
  );
}

interface AnimatedGradientBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientBadge({ children, className }: AnimatedGradientBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm",
      className
    )}>
      <AnimatedGradientText>{children}</AnimatedGradientText>
    </div>
  );
}
