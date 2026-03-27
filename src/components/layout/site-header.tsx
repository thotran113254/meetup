"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Globe, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site-config";

/**
 * SiteHeader — 3-zone layout: Logo | Nav | Icons
 * Sticky, white background, mobile hamburger drawer.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-background)]">
      <div className="container-wide flex h-16 items-center justify-between px-6">

        {/* Left: Logo */}
        <Link href="/" className="flex flex-col items-start leading-none">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-script, cursive)", color: "#2CBCB3" }}
          >
            Meetup
          </span>
          <span
            className="text-[9px] font-semibold tracking-[0.3em] text-[#2CBCB3] uppercase"
            style={{ marginTop: "-2px" }}
          >
            Travel
          </span>
        </Link>

        {/* Center: Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-foreground)] hover:text-[#2CBCB3] transition-colors"
            >
              {item.label}
              {item.hasDropdown && (
                <ChevronDown className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right: Action icons + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop icon buttons */}
          <div className="hidden md:flex items-center gap-1">
            <button
              aria-label="Language / Currency"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              aria-label="Favorites"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[var(--color-muted-foreground)] hover:text-[#E87C3E]"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 bg-[var(--color-background)] border-t border-[var(--color-border)]",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="container-wide flex flex-col gap-1 px-6 pb-4 pt-2">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-gray-50 hover:text-[#2CBCB3] transition-colors"
            >
              {item.label}
              {item.hasDropdown && (
                <ChevronDown className="h-4 w-4 text-[var(--color-muted-foreground)]" />
              )}
            </Link>
          ))}
          {/* Mobile icon row */}
          <div className="flex items-center gap-3 px-3 pt-3 border-t border-gray-100 mt-1">
            <button aria-label="Language / Currency" className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
              <Globe className="h-4 w-4" /> Language
            </button>
            <button aria-label="Favorites" className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
              <Heart className="h-4 w-4" /> Favorites
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
