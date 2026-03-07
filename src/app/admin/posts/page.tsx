import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";

// TODO: Replace with real DB queries from post-queries.ts
const SAMPLE_POSTS = [
  {
    id: "1",
    title: "Gioi thieu Next.js 15 va cac tinh nang moi",
    slug: "gioi-thieu-nextjs-15",
    category: "technology",
    published: true,
    createdAt: new Date("2026-03-01"),
  },
  {
    id: "2",
    title: "Huong dan toi uu SEO cho website Next.js",
    slug: "toi-uu-seo-nextjs",
    category: "seo",
    published: true,
    createdAt: new Date("2026-02-20"),
  },
  {
    id: "3",
    title: "Xay dung design system voi Tailwind CSS",
    slug: "design-system-tailwind",
    category: "design",
    published: false,
    createdAt: new Date("2026-02-15"),
  },
];

export default function AdminPostsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quan ly bai viet</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            {SAMPLE_POSTS.length} bai viet
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4" />
            Them bai viet
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">
                Tieu de
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden sm:table-cell">
                Danh muc
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">
                Trang thai
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden md:table-cell">
                Ngay tao
              </th>
              <th className="px-4 py-3 text-right font-medium text-[var(--color-muted-foreground)]">
                Thao tac
              </th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_POSTS.map((post) => (
              <tr
                key={post.id}
                className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-medium line-clamp-1">{post.title}</span>
                  <span className="text-xs text-[var(--color-muted-foreground)] block">
                    /{post.slug}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden sm:table-cell capitalize">
                  {post.category}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.published ? "Da xuat ban" : "Ban nhap"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden md:table-cell">
                  {formatDate(post.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/posts/${post.slug}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline ml-1">Sua</span>
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
