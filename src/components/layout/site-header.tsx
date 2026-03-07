"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site-config";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * SiteHeader - Sticky header with desktop nav + mobile hamburger toggle.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/60">
      <div className="container-wide flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-[var(--color-primary)]">{siteConfig.shortName}</span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/contact">Lien he</Link>
          </Button>
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-md hover:bg-[var(--color-muted)]"
            aria-label="Mo menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <nav className="container-wide flex flex-col gap-1 pb-4 pt-1">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="mt-2">
            <Link href="/contact" onClick={() => setMobileOpen(false)}>
              Lien he
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
