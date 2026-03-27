import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site-config";

/** Payment method badge labels rendered as styled text chips */
const PAYMENT_METHODS = ["Visa", "MC", "Amex", "JCB", "PayPal", "Union"];

/** TikTok SVG icon (not in lucide-react) */
function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07Z" />
    </svg>
  );
}

/** Social icon circles — white filled with colored icon inside */
function FooterSocialIcons() {
  const { socials } = siteConfig;
  const items = [
    { key: "instagram", href: socials.instagram, Icon: Instagram, color: "#E1306C" },
    { key: "facebook", href: socials.facebook, Icon: Facebook, color: "#1877F2" },
    { key: "tiktok", href: socials.tiktok, Icon: null, color: "#010101" },
    { key: "youtube", href: socials.youtube, Icon: Youtube, color: "#FF0000" },
  ] as const;

  return (
    <div className="flex items-center gap-2 pt-1">
      {items.map(({ key, href, Icon, color }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={key}
          className="flex size-[40px] items-center justify-center rounded-full bg-white hover:opacity-80 transition-opacity"
        >
          {key === "tiktok" ? (
            <TikTokIcon className="h-5 w-5" style={{ color }} />
          ) : Icon ? (
            <Icon className="h-5 w-5" style={{ color }} />
          ) : null}
        </a>
      ))}
    </div>
  );
}

/** Payment channel badges */
function FooterPaymentIcons() {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {PAYMENT_METHODS.map((method) => (
        <span
          key={method}
          className="inline-flex items-center justify-center rounded-[4px] bg-white h-[24px] w-[35px] text-xs font-semibold text-[#2CBCB3]"
        >
          {method}
        </span>
      ))}
    </div>
  );
}

/**
 * SiteFooter — Solid teal background, rounded card with margin per Figma node 13230:45835.
 * Server component — no interactivity required.
 */
export function SiteFooter() {
  const { navigation } = siteConfig;
  const contact = navigation.footer.contact;

  return (
    <footer className="w-full px-[27px] pb-[27px]">
      <div
        className="bg-[#3BBCB7] rounded-[20px] p-10 flex flex-col gap-5"
        style={{ maxWidth: "1546px", margin: "0 auto" }}
      >
        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8">

          {/* Col 1: Brand + socials */}
          <div className="flex flex-col gap-4 min-w-[140px]">
            <Link href="/" className="inline-block">
              <div className="text-white font-extrabold text-3xl leading-none tracking-tight">
                Meetup
              </div>
              <div className="text-white text-xs tracking-[0.25em] uppercase font-medium mt-0.5">
                TRAVEL
              </div>
            </Link>
            <FooterSocialIcons />
          </div>

          {/* Col 2: About Meetup Travel — two sub-columns */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[16px] text-white tracking-[0.32px]">
              About Meetup Travel
            </h3>
            <div className="flex gap-[58px]">
              {/* Left sub-column */}
              <div className="flex flex-col gap-3">
                {navigation.footer.company.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-bold text-[14px] text-[#ECECEC] tracking-[0.14px] hover:opacity-70 transition-opacity"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {/* Right sub-column */}
              <div className="flex flex-col gap-3">
                {navigation.footer.about.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-bold text-[14px] text-[#ECECEC] tracking-[0.14px] hover:opacity-70 transition-opacity"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Col 3: Contact */}
          <div className="flex flex-col gap-3" style={{ width: "362px", maxWidth: "100%" }}>
            <h3 className="font-bold text-[16px] text-white tracking-[0.32px]">Contact</h3>
            <div className="flex flex-col gap-3 text-[14px] text-[#ECECEC]">
              <div>
                <span className="font-bold">Whatsapp:</span>
                <div className="mt-1 space-y-0.5 font-normal">
                  {contact.whatsapp.map(({ name, phone }) => (
                    <div key={name}>{phone} ({name})</div>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-bold">Email:</span>{" "}
                <a href={`mailto:${contact.email}`} className="font-normal hover:opacity-70 transition-opacity">
                  {contact.email}
                </a>
              </div>
              <div>
                <span className="font-bold">Our office:</span>{" "}
                <span className="font-normal">{contact.office}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Payment Channel */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[16px] text-white tracking-[0.32px]">
              Payment Channel
            </h3>
            <FooterPaymentIcons />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#ECECEC]/30 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[14px] text-[#ECECEC]">
          <p>Copyright 2025 Meetup travel</p>
          <div className="flex items-center gap-3">
            <span className="text-[#ECECEC]/40">|</span>
            <a href="/unsubscribe" className="hover:opacity-70 transition-opacity">
              Unsubcribe
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
