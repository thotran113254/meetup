import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site-config";

/** Payment method badge labels rendered as styled text chips */
const PAYMENT_METHODS = ["Visa", "Mastercard", "Amex", "JCB", "PayPal", "UnionPay"];

/** Social icon map for white circle buttons */
const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
} as const;

/** TikTok SVG icon (not in lucide-react) */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07Z" />
    </svg>
  );
}

/**
 * SiteFooter — Teal gradient 4-column footer matching Meetup Travel Figma design.
 * Server component — no interactivity required.
 */
export function SiteFooter() {
  const { navigation, socials, email } = siteConfig;
  const contact = navigation.footer.contact;

  return (
    <footer
      className="rounded-t-3xl"
      style={{ background: "linear-gradient(to right, #5DD5CD, #2CBCB3)" }}
    >
      {/* Main content grid */}
      <div className="container mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Column 1: Brand + socials */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <div className="text-white font-extrabold text-3xl leading-none tracking-tight">
                Meetup
              </div>
              <div className="text-white text-xs tracking-[0.25em] uppercase font-medium mt-0.5">
                TRAVEL
              </div>
            </Link>

            {/* Social icon circles */}
            <div className="flex items-center gap-3 pt-2">
              {(["instagram", "facebook", "tiktok", "youtube"] as const).map((key) => {
                const href = socials[key];
                if (!href) return null;
                const Icon = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-white hover:bg-white hover:text-[#2CBCB3] transition-colors"
                  >
                    {key === "tiktok" ? (
                      <TikTokIcon className="h-4 w-4" />
                    ) : Icon ? (
                      <Icon className="h-4 w-4" />
                    ) : null}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: About Meetup Travel — two sub-columns */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              About Meetup Travel
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navigation.footer.company.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white text-sm hover:opacity-70 transition-opacity"
                >
                  {item.label}
                </Link>
              ))}
              {navigation.footer.about.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white text-sm hover:opacity-70 transition-opacity"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-white">
              <div>
                <span className="font-semibold">Whatsapp:</span>
                <div className="mt-1 space-y-0.5 pl-1">
                  {contact.whatsapp.map(({ name, phone }) => (
                    <div key={name}>
                      {phone} ({name})
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                <a href={`mailto:${email}`} className="hover:opacity-70 transition-opacity">
                  {contact.email}
                </a>
              </div>
              <div>
                <span className="font-semibold">Our office:</span>{" "}
                <span className="opacity-90">{contact.office}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Payment Channel */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Payment Channel
            </h3>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method, i) => (
                <span
                  key={`${method}-${i}`}
                  className="inline-flex items-center justify-center rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-[#2CBCB3] shadow-sm"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-4 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white">
          <p>Copyright 2025 Meetup travel</p>
          <a href="/unsubscribe" className="hover:opacity-70 transition-opacity underline underline-offset-2">
            Unsubscribe
          </a>
        </div>
      </div>
    </footer>
  );
}
