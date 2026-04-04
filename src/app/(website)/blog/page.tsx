import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-utils";
import { BlogHeroSection } from "@/components/sections/blog/blog-hero-section";
import { BlogPostsGridSection } from "@/components/sections/blog/blog-posts-grid-section";
import { getPublishedPosts, mapDbPostToBlogPost } from "@/db/queries/post-queries";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Khám phá kiến thức du lịch, văn hoá và trải nghiệm địa phương từ đội ngũ chuyên gia Meetup Travel.",
  path: "/blog",
});

export default async function BlogPage() {
  // Try DB first; fall back to static data if DB is empty or unavailable
  let posts = BLOG_POSTS;
  try {
    const dbPosts = await getPublishedPosts();
    if (dbPosts.length > 0) posts = dbPosts.map(mapDbPostToBlogPost);
  } catch { /* DB not available — use static */ }

  return (
    <>
      <BlogHeroSection />
      <BlogPostsGridSection posts={posts} />
    </>
  );
}
