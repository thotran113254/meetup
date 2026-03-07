import { siteConfig } from "@/config/site-config";
import { BLOG_POSTS } from "@/lib/blog-data";

/**
 * GET /llms-full.txt - Full content endpoint for AI deep understanding
 * Includes complete post content for all published posts
 */
export async function GET() {
  // Try DB first, fallback to static data
  let blogPosts: Array<{ title: string; slug: string; excerpt: string; content?: string }>;
  try {
    const { getPublishedPosts } = await import("@/db/queries/post-queries");
    blogPosts = await getPublishedPosts();
  } catch {
    blogPosts = BLOG_POSTS;
  }

  const sections = [
    `# ${siteConfig.name} - Full Content`,
    ``,
    `> ${siteConfig.description}`,
    ``,
    `- Website: ${siteConfig.url}`,
    `- Email: ${siteConfig.email}`,
    ``,
    `---`,
    ``,
    `## Blog Posts (${blogPosts.length} articles)`,
    ``,
  ];

  for (const post of blogPosts) {
    sections.push(`### ${post.title}`);
    sections.push(`URL: ${siteConfig.url}/blog/${post.slug}`);
    sections.push(``);
    if (post.excerpt) {
      sections.push(`**Summary:** ${post.excerpt}`);
      sections.push(``);
    }
    if (post.content) {
      sections.push(post.content);
    }
    sections.push(``);
    sections.push(`---`);
    sections.push(``);
  }

  return new Response(sections.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
