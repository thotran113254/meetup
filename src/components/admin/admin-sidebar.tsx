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
  Images,
  Navigation,
  ImageIcon,
  LogOut,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Tổng quan",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Trang",
    items: [
      { label: "Homepage", href: "/admin/homepage", icon: Home },
      { label: "Hero Slides", href: "/admin/slides", icon: Images },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { label: "Bài viết", href: "/admin/posts", icon: FileText },
      { label: "Media", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { label: "Tin nhắn", href: "/admin/contacts", icon: MessageSquare },
      { label: "Điều hướng", href: "/admin/navigation", icon: Navigation },
      { label: "Cài đặt", href: "/admin/settings", icon: Settings },
    ],
  },
];

/** Extracted as a stable component to avoid hydration mismatch when rendered in mobile + desktop sidebars */
function NavContent({
  pathname,
  onNavClick,
  onLogout,
}: {
  pathname: string;
  onNavClick: () => void;
  onLogout: () => void;
}) {
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-[var(--color-border)] px-6">
        <Link href="/admin" className="text-lg font-bold text-[var(--color-primary)]" onClick={onNavClick}>
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 space-y-4 p-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavClick}
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
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] p-4 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          Xem trang web
        </Link>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

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
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeMobile} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-[var(--color-border)] bg-[var(--color-card)] transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent pathname={pathname} onNavClick={closeMobile} onLogout={handleLogout} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-card)] lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <NavContent pathname={pathname} onNavClick={closeMobile} onLogout={handleLogout} />
        </div>
      </aside>
    </>
  );
}
