import Link from "next/link";
import { Twitter, Facebook, Linkedin, Github, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site-config";

const socialIcons = {
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
} as const;

/**
 * SiteFooter - Multi-column footer with nav links, contact, and copyright.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-muted)]">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="font-bold text-lg">
              <span className="text-[var(--color-primary)]">
                {siteConfig.shortName}
              </span>{" "}
              {siteConfig.name}
            </Link>
            <p className="text-sm text-[var(--color-muted-foreground)] max-w-xs">
              {siteConfig.description}
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {(Object.entries(siteConfig.socials) as [keyof typeof socialIcons, string][])
                .filter(([, url]) => url)
                .map(([key, url]) => {
                  const Icon = socialIcons[key];
                  return Icon ? (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ) : null;
                })}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Cong ty</h3>
            <ul className="space-y-2">
              {siteConfig.navigation.footer.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Dich vu</h3>
            <ul className="space-y-2">
              {siteConfig.navigation.footer.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Lien he</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
              <li>{siteConfig.email}</li>
              <li>{siteConfig.phone}</li>
              <li>
                {siteConfig.address.street}, {siteConfig.address.city}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted-foreground)]">
          <p>
            &copy; {year} {siteConfig.name}. Bao luu moi quyen.
          </p>
          <ul className="flex gap-4">
            {siteConfig.navigation.footer.legal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[var(--color-foreground)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
