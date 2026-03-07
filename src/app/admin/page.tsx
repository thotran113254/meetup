import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, PenSquare, Globe } from "lucide-react";

// TODO: Replace placeholder counts with real DB queries using post-queries.ts and contact-queries.ts
const stats = [
  { label: "Tong bai viet", value: "—", icon: FileText, color: "var(--color-primary)" },
  { label: "Da xuat ban", value: "—", icon: FileText, color: "#22c55e" },
  { label: "Ban nhap", value: "—", icon: FileText, color: "#f59e0b" },
  { label: "Tin nhan lien he", value: "—", icon: MessageSquare, color: "#6366f1" },
];

// TODO: Replace with real recent contact messages from DB
const recentMessages = [
  { name: "Nguyen Van A", email: "a@example.com", date: "07/03/2026", read: false },
  { name: "Tran Thi B", email: "b@example.com", date: "06/03/2026", read: true },
];

export default function AdminDashboardPage() {
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
        {stats.map(({ label, value, icon: Icon, color }) => (
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
          <h2 className="font-semibold">Tin nhan gan day</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/contacts">Xem tat ca</Link>
          </Button>
        </div>
        <div className="space-y-3">
          {recentMessages.map((msg) => (
            <div
              key={msg.email}
              className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
            >
              <div>
                <p className={`text-sm font-medium ${!msg.read ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"}`}>
                  {msg.name}
                </p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{msg.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--color-muted-foreground)]">{msg.date}</p>
                {!msg.read && (
                  <span className="inline-block mt-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold mb-3">Tac vu nhanh</h2>
        <div className="flex gap-3 flex-wrap">
          <Button asChild>
            <Link href="/admin/posts/new">
              <PenSquare className="h-4 w-4" />
              Them bai viet moi
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
