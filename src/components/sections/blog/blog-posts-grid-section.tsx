"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Calendar } from "lucide-react";
import { useState } from "react";
import { BLOG_POSTS, formatBlogDate, type BlogPost } from "@/lib/blog-data";

const POSTS_PER_PAGE = 12;

/** Single blog card matching Figma: image with date badge overlay, title below */
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-3">
      {/* Image container with date badge */}
      <div className="relative h-[191px] w-full overflow-hidden rounded-xl">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Date badge — bottom-left */}
        <div className="absolute bottom-[10px] left-[10px] flex items-center gap-[3px] bg-[#F3F3F3] rounded-[8px] px-[8px] py-[4px] h-[24px]">
          <Calendar className="w-3 h-3 text-[#1D1D1D] shrink-0" />
          <span className="text-[10px] font-medium leading-[1.2] text-[#1D1D1D] whitespace-nowrap">
            {formatBlogDate(post.date)}
          </span>
        </div>
      </div>

      {/* Title */}
      <p className="text-[14px] font-bold leading-[1.3] tracking-[0.14px] text-[#1D1D1D] line-clamp-2 group-hover:text-[#3BBCB7] transition-colors">
        {post.title}
      </p>
    </Link>
  );
}

/** Pagination button */
function PageButton({
  page,
  active,
  onClick,
}: {
  page: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-xl text-[14px] font-bold leading-[1.2] transition-colors ${
        active
          ? "bg-[#3BBCB7] text-white"
          : "bg-[#EBF8F8] text-[#3BBCB7] hover:bg-[#3BBCB7] hover:text-white"
      }`}
    >
      {page}
    </button>
  );
}

/**
 * BlogPostsGridSection — Blog listing grid with search/filter bar and pagination.
 * Desktop: 4-column grid. Mobile: 1 column.
 * Matches Figma design for the blog listing page.
 */
export function BlogPostsGridSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = BLOG_POSTS.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <section className="w-full bg-white py-10 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[100px] flex flex-col gap-8">
        {/* Header row: title + search + filter */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-[20px] md:text-[32px] font-bold leading-[1.2] tracking-[0.08px] text-[#1D1D1D]">
              Blog
            </h2>

            {/* Search + destination filter */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search input */}
              <div className="flex items-center gap-[6px] bg-white border border-[#BDBDBD] rounded-xl h-10 px-3 flex-1 sm:w-[338px] sm:flex-none">
                <Search className="w-4 h-4 text-[#BDBDBD] shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 text-[12px] leading-[1.5] tracking-[-0.12px] text-[#1D1D1D] placeholder:text-[#BDBDBD] outline-none bg-transparent min-w-0"
                />
              </div>

              {/* Destination filter */}
              <button className="flex items-center justify-between bg-white border border-[#BDBDBD] rounded-xl h-10 px-3 gap-2 w-[160px] sm:w-[237px] shrink-0">
                <span className="text-[12px] leading-[1.5] tracking-[-0.12px] text-[#828282] truncate">
                  Destination:{" "}
                  <span className="font-bold text-[#1D1D1D]">Hanoi</span>
                </span>
                <ChevronDown className="w-4 h-4 text-[#828282] shrink-0" />
              </button>
            </div>
          </div>

          {/* Blog cards grid: 4-col desktop, 2-col tablet, 1-col mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4">
            {paginated.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PageButton
                key={page}
                page={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
