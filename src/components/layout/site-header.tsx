"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
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
        <div className="flex h-12 md:h-16 items-center justify-between px-4 lg:px-[100px]">

          {/* Left: Logo */}
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/meetup-logo-blue.svg" alt="Meetup Travel" className="h-[22px] md:h-[29px] w-auto" />
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
            {/* Icon buttons — visible on all screen sizes, smaller on mobile */}
            <div className="flex items-center gap-2">
              {/* Currency / Language icon */}
              <div className="relative">
                <button
                  aria-label="Language / Currency"
                  className="flex items-center justify-center size-8 md:size-[40px] rounded-[6px] md:rounded-[12px] bg-[#EBF8F8] hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => setCurrencyOpen((o) => !o)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/exchange.svg" alt="" className="size-[18px] md:size-6" aria-hidden="true" />
                </button>
                <CurrencySwitcher open={currencyOpen} onClose={() => setCurrencyOpen(false)} selected={currency} onSelect={setCurrency} />
              </div>

              {/* Wishlist heart icon with badge */}
              <button
                aria-label="Favorites"
                className="relative flex items-center justify-center size-8 md:size-[40px] rounded-[6px] md:rounded-[12px] bg-[#FFEEC7] hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => setWishlistOpen(true)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/heart-filled.svg" alt="" className="size-5 md:size-6" aria-hidden="true" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-[5px] left-[21px] md:-top-[7px] md:left-[28px] flex items-center justify-center size-4 md:size-[18px] rounded-full bg-[#DA1115] text-white"
                    style={{ fontSize: "9px", lineHeight: 1, fontWeight: 500 }}
                  >
                    +{wishlistItems.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center size-8 rounded-[6px] bg-[#EBF8F8] hover:bg-gray-100 transition-colors"
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
