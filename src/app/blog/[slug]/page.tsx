import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata, buildArticleJsonLd } from "@/lib/seo-utils";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BlogDetailHeroSection } from "@/components/sections/blog/blog-detail-hero-section";
import { BlogDetailArticleSection } from "@/components/sections/blog/blog-detail-article-section";
import { MostLikedPackageSection } from "@/components/sections/tours/most-liked-package-section";
import { NewsletterSection } from "@/components/sections/homepage/newsletter-section";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    authors: [post.author],
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = buildArticleJsonLd({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedAt: post.date,
    author: post.author,
  });

  return (
    <>
      <JsonLdScript data={articleSchema} />

      {/* Hero banner + breadcrumb */}
      <BlogDetailHeroSection
        postTitle={post.title}
        heroImage={post.image}
        heroAlt={post.title}
      />

      {/* Article body with sticky Table of Contents */}
      <BlogDetailArticleSection post={post} />

      {/* Most Liked Package carousel */}
      <MostLikedPackageSection />

      {/* Newsletter subscription */}
      <NewsletterSection />
    </>
  );
}
