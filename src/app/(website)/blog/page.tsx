import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-utils";
import { BlogHeroSection } from "@/components/sections/blog/blog-hero-section";
import { BlogPostsGridSection } from "@/components/sections/blog/blog-posts-grid-section";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Khám phá kiến thức du lịch, văn hoá và trải nghiệm địa phương từ đội ngũ chuyên gia Meetup Travel.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <BlogHeroSection />
      <BlogPostsGridSection />
    </>
  );
}
