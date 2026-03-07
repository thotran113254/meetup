"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  gradientSize?: number;
}

export function MagicCard({
  children,
  className,
  gradientColor = "rgba(99, 102, 241, 0.15)",
  gradientSize = 300,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [gradientPos, setGradientPos] = useState({ x: -999, y: -999 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setGradientPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setGradientPos({ x: -999, y: -999 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] transition-shadow hover:shadow-xl",
        className
      )}
    >
      {/* Spotlight gradient */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${gradientSize}px circle at ${gradientPos.x}px ${gradientPos.y}px, ${gradientColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
