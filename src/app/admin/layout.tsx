import { AdminSidebar } from "@/components/admin/admin-sidebar";

// TODO: Add authentication middleware here

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8 pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
