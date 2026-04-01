"use client";

/**
 * SiteFooter — Teal card footer per Figma node 13230:45835.
 * Desktop: 4-column layout (logo+socials | nav links | contact | payment).
 * Mobile: stacked layout with dividers between sections.
 */

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site-config";

/** Payment method icons — Figma node 9034:231542 */
const PAYMENT_METHODS = [
  { name: "Visa", src: "/images/payment-visa-1.svg" },
  { name: "Visa Classic", src: "/images/payment-visa-2.svg" },
  { name: "Mastercard", src: "/images/payment-mastercard.svg" },
  { name: "UnionPay", src: "/images/payment-unionpay.svg" },
  { name: "JCB", src: "/images/payment-jcb.svg" },
  { name: "Amex", src: "/images/payment-amex.svg", bg: "bg-[#006fcf]" },
  { name: "PayPal", src: "/images/payment-paypal.svg" },
];

/** TikTok SVG icon (not in lucide-react) */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07Z" />
    </svg>
  );
}

/** Social icon circles — white bg, dark icons per Figma */
function FooterSocialIcons() {
  const { socials } = siteConfig;
  const items = [
    { key: "instagram", href: socials.instagram, Icon: Instagram },
    { key: "facebook", href: socials.facebook, Icon: Facebook },
    { key: "tiktok", href: socials.tiktok, Icon: null as typeof Instagram | null },
    { key: "youtube", href: socials.youtube, Icon: Youtube },
  ];

  return (
    <div className="flex items-center gap-2">
      {items.map(({ key, href, Icon }) => (
        <motion.a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={key}
          className="flex size-[40px] items-center justify-center rounded-full bg-white text-[#333] transition-opacity"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {key === "tiktok" ? (
            <TikTokIcon className="h-5 w-5" />
          ) : Icon ? (
            <Icon className="h-5 w-5" />
          ) : null}
        </motion.a>
      ))}
    </div>
  );
}

/** Payment card icons — Figma gap-[6px] w-[210px] */
function FooterPaymentIcons() {
  return (
    <div className="flex flex-wrap gap-[6px] w-[210px]">
      {PAYMENT_METHODS.map(({ name, src, bg }) => (
        <div
          key={name}
          className={`relative flex items-center justify-center h-[24px] w-[35px] rounded-[4px] border border-[#d9d9d9] overflow-hidden ${bg || "bg-white"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={name} className="w-[60%] h-[60%] object-contain" />
        </div>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const { navigation } = siteConfig;
  const contact = navigation.footer.contact;

  return (
    <motion.footer
      className="w-full px-0 md:px-[27px] pb-0 md:pb-[27px]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="relative bg-[#3BBCB7] rounded-t-[20px] md:rounded-[20px] px-4 py-6 md:p-10 flex flex-col gap-5 overflow-clip"
        style={{ maxWidth: "1546px", margin: "0 auto" }}
      >
        {/* Decorative gradient circle — top right per Figma */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/footer-decorative-circle.svg"
          alt=""
          className="absolute w-[400px] h-[400px] pointer-events-none opacity-30"
          style={{ right: "-100px", top: "-40px" }}
          aria-hidden="true"
        />

        {/* Main content — stacked on mobile, 4-col row on lg+ */}
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          {/* Col 1: Logo + Socials — vertically spaced on desktop */}
          <div className="flex items-start justify-between lg:flex-col lg:justify-between lg:self-stretch lg:shrink-0 lg:gap-4">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/meetup-logo-white.svg" alt="Meetup Travel" className="h-[42px] md:h-[58px] w-auto" />
            </Link>
            <FooterSocialIcons />
          </div>

          {/* Mobile divider */}
          <div className="border-t border-white/30 lg:hidden" />

          {/* Col 2: About Meetup Travel — two sub-columns */}
          <div className="flex flex-col gap-3 lg:gap-5 lg:shrink-0 lg:w-[240px]">
            <h3 className="font-bold text-[14px] lg:text-[16px] text-white tracking-[0.32px] leading-[1.3] uppercase">
              About Meetup Travel
            </h3>
            <div className="flex gap-[58px]">
              <div className="flex flex-col gap-3">
                {navigation.footer.company.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-bold text-[12px] md:text-[14px] text-[#ECECEC] leading-[1.3] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {navigation.footer.about.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-bold text-[12px] md:text-[14px] text-[#ECECEC] leading-[1.3] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile divider */}
          <div className="border-t border-white/30 lg:hidden" />

          {/* Col 3: Contact */}
          <div className="flex flex-col gap-3 lg:gap-5 lg:shrink-0 lg:w-[362px]">
            <h3 className="font-bold text-[14px] lg:text-[16px] text-white tracking-[0.32px] leading-[1.3] uppercase">
              Contact
            </h3>
            <div className="flex flex-col gap-3 text-[12px] md:text-[14px] text-[#ECECEC]">
              {/* Whatsapp */}
              <div className="flex gap-2">
                <span className="font-bold w-[100px] shrink-0 leading-[1.3]">Whatsapp:</span>
                <div className="flex flex-col gap-1 leading-[1.5]">
                  {contact.whatsapp.map(({ name, phone }) => (
                    <span key={name}>{phone} ({name})</span>
                  ))}
                </div>
              </div>
              {/* Email */}
              <div className="flex gap-2">
                <span className="font-bold w-[100px] shrink-0 leading-[1.3]">Email:</span>
                <a href={`mailto:${contact.email}`} className="leading-[1.5] hover:text-white transition-colors break-all">
                  {contact.email}
                </a>
              </div>
              {/* Office */}
              <div className="flex gap-2">
                <span className="font-bold w-[100px] shrink-0 leading-[1.3]">Our office:</span>
                <span className="leading-[1.5]">{contact.office}</span>
              </div>
            </div>
          </div>

          {/* Mobile divider */}
          <div className="border-t border-white/30 lg:hidden" />

          {/* Col 4: Payment Channel */}
          <div className="flex flex-col gap-3 lg:gap-5 lg:shrink-0">
            <h3 className="font-bold text-[14px] lg:text-[16px] text-white tracking-[0.32px] leading-[1.3] uppercase">
              Payment Channel
            </h3>
            <FooterPaymentIcons />
          </div>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-white/30" />

        {/* Bottom bar — copyright + unsubscribe */}
        <div className="flex items-center gap-5 text-[14px] text-[#ECECEC]">
          <p className="leading-[1.5] tracking-[0.035px]">Copyright 2025 Meetup travel</p>
          <span className="w-px h-[18px] bg-[#ECECEC]/40" />
          <a href="#" className="font-bold leading-[1.3] tracking-[0.14px] hover:text-white transition-colors">
            Unsubcribe
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
