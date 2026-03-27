"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Globe, Heart } from "lucide-react";
import { siteConfig } from "@/config/site-config";
import { MobileMenu } from "./mobile-menu";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { WishlistDrawer } from "@/components/ui/wishlist-drawer";

/**
 * SiteHeader — 3-zone layout: Logo | Nav | Icons
 * Sticky, white background with bottom rounded corners and shadow per Figma node 14079:88174.
 */
const WISHLIST_ITEMS = [
  { id: "1", title: "Cu Chi Tunnels and Mekong Delta Full Day Tour", image: "/images/tour-1-floating-market.png" },
  { id: "2", title: "Hoi An Ancient Town Walking Tour", image: "/images/tour-2-hoi-an.png" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(WISHLIST_ITEMS);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main header bar — rounded bottom corners + shadow per Figma */}
      <div
        className="bg-white rounded-bl-[12px] rounded-br-[12px] shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)]"
        style={{ maxWidth: "1400px", margin: "0 auto" }}
      >
        <div className="flex h-16 items-center justify-between px-6 lg:px-[100px]">

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
          <nav className="hidden md:flex items-center gap-5">
            {siteConfig.navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1 font-bold text-[14px] leading-[1.2] text-[#1D1D1D] hover:text-[#2CBCB3] transition-colors"
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown className="h-4 w-4 text-[#1D1D1D]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Action icons + mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Desktop icon buttons */}
            <div className="hidden md:flex items-center gap-2">
              {/* Currency / Language icon */}
              <div className="relative">
                <button
                  aria-label="Language / Currency"
                  className="flex items-center justify-center size-[40px] rounded-[12px] bg-[#EBF8F8] hover:opacity-80 transition-opacity"
                  onClick={() => setCurrencyOpen((o) => !o)}
                >
                  <Globe className="h-6 w-6 text-[#2CBCB3]" />
                </button>
                <CurrencySwitcher open={currencyOpen} onClose={() => setCurrencyOpen(false)} selected={currency} onSelect={setCurrency} />
              </div>

              {/* Wishlist heart icon with badge */}
              <button
                aria-label="Favorites"
                className="relative flex items-center justify-center size-[40px] rounded-[12px] bg-[#FFEEC7] hover:opacity-80 transition-opacity"
                onClick={() => setWishlistOpen(true)}
              >
                <Heart className="h-6 w-6 text-[#F5A623]" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center size-[18px] rounded-full bg-[#DA1115] text-white"
                    style={{ fontSize: "9px", lineHeight: 1, fontWeight: 700 }}
                  >
                    +{wishlistItems.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Wishlist drawer */}
      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistItems}
        onRemove={(id) => setWishlistItems((prev) => prev.filter((item) => item.id !== id))}
      />
    </header>
  );
}
