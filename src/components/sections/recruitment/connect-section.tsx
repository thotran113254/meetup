/**
 * ConnectSection — "Connect with us" + "Join our Team" two-column block.
 * Desktop: side-by-side columns. Mobile: stacked.
 * Figma: desktop 14008:86361, mobile 14008:88275 + 14008:88912.
 */

import { Instagram, Facebook, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site-config";

/** TikTok SVG icon (not in lucide-react) */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07Z" />
    </svg>
  );
}

/** Teal circular social icon button */
function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-[48px] items-center justify-center rounded-full bg-[#3bbcb7] text-white transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  );
}

type Props = {
  /** CMS-overridable "Connect with us" title. */
  connectTitle?: string;
  /** CMS-overridable "Connect with us" description. */
  connectDescription?: string;
  /** CMS-overridable "Join our Team" title. */
  joinTitle?: string;
  /** CMS-overridable "Join our Team" description. */
  joinDescription?: string;
};

export function ConnectSection({
  connectTitle = "Connect with us",
  connectDescription = "Follow us on social media to stay up to date with the latest travel inspiration, exclusive deals, and behind-the-scenes glimpses of life at Meetup Travel.",
  joinTitle = "Join our Team",
  joinDescription = "Ready to turn your passion for travel into a career? Send your CV to our team and we'll be in touch about upcoming opportunities.",
}: Props = {}) {
  const { socials, email, address, phone } = siteConfig;

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-0">
          {/* Left: Connect with us */}
          <div className="flex flex-col gap-5 lg:w-[456px] lg:pr-8">
            <h2 className="text-[#1d1d1d] text-[28px] md:text-[48px] font-bold leading-[1.2]">
              {connectTitle}
            </h2>
            <p className="text-[#828282] text-[14px] leading-[1.5] tracking-[0.035px]">
              {connectDescription}
            </p>
            <div className="flex items-center gap-2">
              <SocialButton href={socials.instagram} label="Instagram">
                <Instagram className="size-5" />
              </SocialButton>
              <SocialButton href={socials.facebook} label="Facebook">
                <Facebook className="size-5" />
              </SocialButton>
              <SocialButton href={socials.tiktok} label="TikTok">
                <TikTokIcon className="size-5" />
              </SocialButton>
              <SocialButton href={socials.youtube} label="YouTube">
                <Youtube className="size-5" />
              </SocialButton>
            </div>
          </div>

          {/* Right: Join our Team */}
          <div className="flex flex-col gap-5 lg:w-[456px] lg:pl-8">
            <h2 className="text-[#1d1d1d] text-[28px] md:text-[48px] font-bold leading-[1.2]">
              {joinTitle}
            </h2>
            <p className="text-[#828282] text-[14px] leading-[1.5] tracking-[0.035px]">
              {joinDescription}
            </p>

            {/* Contact info rows */}
            <div className="flex flex-col gap-3 text-[14px] leading-[1.5] tracking-[0.035px]">
              {/* Email */}
              <div className="flex gap-2">
                <span className="w-[100px] font-bold text-[#1d1d1d] shrink-0">Email:</span>
                <a
                  href={`mailto:${email}`}
                  className="text-[#828282] hover:text-[#3bbcb7] transition-colors"
                >
                  {email}
                </a>
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-[100px] font-bold text-[#1d1d1d] shrink-0">Whatsapp:</span>
                  <span className="text-[#828282]">{phone} (Grace)</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-[100px] shrink-0" aria-hidden="true" />
                  <span className="text-[#828282]">+84 90 624 49 14 (Sunny)</span>
                </div>
              </div>

              {/* Office */}
              <div className="flex gap-2 items-start">
                <span className="w-[100px] font-bold text-[#1d1d1d] shrink-0">Our office:</span>
                <span className="text-[#828282]">
                  {address.street}, {address.city}, {address.country}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
