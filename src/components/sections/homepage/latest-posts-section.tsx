import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getPublishedPosts } from "@/db/queries/post-queries";
import { ScrollReveal } from "@/components/ui/scroll-animations";

const FALLBACK_IMAGE = "/images/tour-1-floating-market.png";
const MAX_POSTS = 4;

/** Format a DB timestamp to "JUN 12, 2025" style matching BlogCard design */
function formatDate(date: Date | null): string {
  if (!date) return "";
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

/**
 * LatestPostsSection — Server component showing latest published blog posts from CMS.
 * Matches BlogCard visual design (image + date badge + title).
 * Returns null when no posts exist so it renders nothing gracefully.
 */
export async function LatestPostsSection() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    const all = await getPublishedPosts();
    posts = all.slice(0, MAX_POSTS);
  } catch {
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-5 gap-4">
            <h2 className="text-xl md:text-[32px] font-bold leading-[1.2] tracking-[0.05px] md:tracking-[0.08px] text-[var(--color-foreground)]">
              Tin tức & Blog
            </h2>
            <Link
              href="/blog"
              className="h-10 px-4 text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-xl transition-colors flex items-center justify-center shrink-0"
            >
              Xem thêm
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3"
              >
                {/* Image with date badge */}
                <div className="relative h-[191px] w-full overflow-hidden rounded-xl">
                  <Image
                    src={post.coverImage ?? FALLBACK_IMAGE}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Category badge — top left */}
                  {post.category && (
                    <span className="absolute top-[10px] left-[10px] bg-[var(--color-primary)] text-white text-[10px] font-bold px-2 py-[3px] rounded-[6px]">
                      {post.category}
                    </span>
                  )}
                  {/* Date badge — bottom left */}
                  <div className="absolute bottom-[10px] left-[10px] flex items-center gap-[3px] bg-[#F3F3F3] rounded-[8px] px-[8px] py-[4px] h-[24px]">
                    <Calendar className="w-3 h-3 text-[#1D1D1D] shrink-0" />
                    <span className="text-[10px] font-medium leading-[1.2] text-[#1D1D1D] whitespace-nowrap">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <p className="text-[14px] font-bold leading-[1.3] tracking-[0.14px] text-[var(--color-foreground)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {post.title}
                </p>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-xs text-[var(--color-muted-foreground)] leading-[1.5] line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
