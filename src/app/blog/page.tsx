import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo-utils";
import { formatDate } from "@/lib/utils";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog",
  description: "Kien thuc thiet ke website, SEO, digital marketing va cong nghe moi nhat tu doi ngu chuyen gia YourBrand.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />

      {/* Header */}
      <section className="section-padding bg-gradient-to-b from-[var(--color-accent)]/30 to-transparent">
        <div className="container-narrow text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Blog <span className="text-[var(--color-primary)]">kien thuc</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--color-muted-foreground)]">
            Chia se kien thuc thuc tien ve website, SEO va digital marketing tu doi ngu chuyen gia.
          </p>
        </div>
      </section>

      {/* Post grid */}
      <section className="section-padding bg-[var(--color-background)]">
        <div className="container-wide">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image placeholder */}
                <div className="aspect-video bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)]/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[var(--color-primary)]/40">
                    {post.category.charAt(0)}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-6 gap-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                    <span className="rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] px-2 py-0.5 font-medium">
                      {post.category}
                    </span>
                    <span>&middot;</span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>&middot;</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="font-semibold text-base leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                    <span className="text-xs text-[var(--color-muted-foreground)]">{post.author}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                    >
                      Doc them &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
