export const dynamic = "force-dynamic";

import Link from "next/link";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, PenSquare, Globe, Images, Navigation } from "lucide-react";
import { getDb } from "@/db/connection";
import { posts, contactSubmissions } from "@/db/schema";
import { formatDate } from "@/lib/utils";

async function getDashboardStats() {
  const db = getDb();
  const [totalPosts, publishedPosts, draftPosts, totalContacts, unreadContacts, recentContacts] =
    await Promise.all([
      db.$count(posts),
      db.$count(posts, eq(posts.published, true)),
      db.$count(posts, eq(posts.published, false)),
      db.$count(contactSubmissions),
      db.$count(contactSubmissions, eq(contactSubmissions.read, false)),
      db
        .select()
        .from(contactSubmissions)
        .orderBy(contactSubmissions.createdAt)
        .limit(5),
    ]);
  return {
    totalPosts: Number(totalPosts),
    publishedPosts: Number(publishedPosts),
    draftPosts: Number(draftPosts),
    totalContacts: Number(totalContacts),
    unreadContacts: Number(unreadContacts),
    recentContacts,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: "Tong bai viet", value: stats.totalPosts, icon: FileText, color: "var(--color-primary)" },
    { label: "Da xuat ban", value: stats.publishedPosts, icon: FileText, color: "#22c55e" },
    { label: "Ban nhap", value: stats.draftPosts, icon: FileText, color: "#f59e0b" },
    { label: "Chua doc", value: stats.unreadContacts, icon: MessageSquare, color: "#6366f1" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Tong quan he thong quan tri
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--color-muted-foreground)]">{label}</span>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recent messages */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">
            Tin nhan gan day
            {stats.unreadContacts > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs text-[var(--color-primary-foreground)]">
                {stats.unreadContacts} chua doc
              </span>
            )}
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/contacts">Xem tat ca</Link>
          </Button>
        </div>
        {stats.recentContacts.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)] py-4 text-center">Chua co tin nhan nao</p>
        ) : (
          <div className="space-y-0">
            {stats.recentContacts.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0"
              >
                <div>
                  <p className={`text-sm font-medium ${!msg.read ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"}`}>
                    {msg.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{msg.email}</p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <p className="text-xs text-[var(--color-muted-foreground)]">{formatDate(msg.createdAt)}</p>
                  {!msg.read && (
                    <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold mb-3">Tac vu nhanh</h2>
        <div className="flex gap-3 flex-wrap">
          <Button asChild>
            <Link href="/admin/posts">
              <PenSquare className="h-4 w-4" />
              Quan ly bai viet
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/slides">
              <Images className="h-4 w-4" />
              Quan ly slides
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/navigation">
              <Navigation className="h-4 w-4" />
              Dieu huong
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/" target="_blank">
              <Globe className="h-4 w-4" />
              Xem trang web
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
