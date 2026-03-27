"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight, Instagram, Facebook, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site-config";

/** TikTok SVG icon (not in lucide-react) */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07Z" />
    </svg>
  );
}

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * MobileMenu — Full-screen overlay mega menu for mobile (375px design).
 * Figma node: 14394:91168. Header with logo + X close, expandable nav items,
 * social icons row, timezone/hours info cards, WhatsApp contact.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const { navigation, socials } = siteConfig;

  return (
    <div role="dialog" aria-modal="true" aria-label="Navigation menu" className="fixed inset-0 z-[60] bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#ECECEC]">
        <Link href="/" onClick={onClose} className="flex flex-col leading-none">
          <span className="text-xl font-bold text-[#2CBCB3]" style={{ fontFamily: "cursive" }}>
            Meetup
          </span>
          <span className="text-[8px] font-semibold tracking-[0.3em] text-[#2CBCB3] uppercase" style={{ marginTop: "-2px" }}>
            Travel
          </span>
        </Link>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close menu">
          <X className="w-5 h-5 text-[#1D1D1D]" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="px-4 py-4">
        {navigation.main.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center justify-between py-3.5 border-b border-[#F8F8F8] text-[15px] font-bold text-[#1D1D1D]"
          >
            {item.label}
            {item.hasDropdown && <ChevronRight className="w-4 h-4 text-[#828282]" />}
          </Link>
        ))}
      </nav>

      {/* Social icons */}
      <div className="flex items-center justify-center gap-3 py-4 border-t border-[#ECECEC] mx-4">
        {[
          { key: "instagram", Icon: Instagram, href: socials.instagram },
          { key: "facebook", Icon: Facebook, href: socials.facebook },
          { key: "tiktok", Icon: TikTokIcon, href: socials.tiktok },
          { key: "youtube", Icon: Youtube, href: socials.youtube },
        ].map(({ key, Icon, href }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={key}
            className="flex size-[40px] items-center justify-center rounded-full bg-[#EBF8F8] text-[#2CBCB3]"
          >
            <Icon className="w-5 h-5" />
          </a>
        ))}
      </div>

      {/* Info cards */}
      <div className="px-4 py-3 space-y-3">
        <div className="rounded-[12px] bg-[#F8F8F8] p-4">
          <p className="text-xs text-[#828282]">Timezone</p>
          <p className="text-sm font-bold text-[#1D1D1D]">Asia/Saigon, GMT+7</p>
        </div>
        <div className="rounded-[12px] bg-[#F8F8F8] p-4">
          <p className="text-xs text-[#828282]">Working hours</p>
          <p className="text-sm font-bold text-[#1D1D1D]">Mon-Sun: 06:00 AM - 12:00 AM</p>
        </div>
      </div>

      {/* WhatsApp contact */}
      <div className="px-4 py-4">
        <a
          href={socials.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-[12px] bg-[#25D366] text-white font-bold text-sm"
        >
          WhatsApp Us
        </a>
      </div>
    </div>
  );
}
