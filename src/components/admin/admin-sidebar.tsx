"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bai viet", href: "/admin/posts", icon: FileText },
  { label: "Tin nhan", href: "/admin/contacts", icon: MessageSquare },
  { label: "Cai dat", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const NavContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[var(--color-border)] px-6">
        <Link
          href="/admin"
          className="text-lg font-bold text-[var(--color-primary)]"
          onClick={() => setMobileOpen(false)}
        >
          Admin Panel
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(href)
                ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Back to site link */}
      <div className="border-t border-[var(--color-border)] p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          Xem trang web
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-2 lg:hidden"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-[var(--color-border)] bg-[var(--color-card)] transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-card)] lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <NavContent />
        </div>
      </aside>
    </>
  );
}
