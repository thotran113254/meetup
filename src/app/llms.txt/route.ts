import { siteConfig } from "@/config/site-config";
import { BLOG_POSTS } from "@/lib/blog-data";

/**
 * GET /llms.txt - Machine-readable site summary for AI search engines (ChatGPT, Perplexity, etc.)
 * Format follows the emerging llms.txt standard: https://llmstxt.org
 */
export async function GET() {
  // Try DB first, fallback to static data
  let blogPosts: Array<{ title: string; slug: string; excerpt: string }>;
  try {
    const { getPublishedPosts } = await import("@/db/queries/post-queries");
    blogPosts = await getPublishedPosts();
  } catch {
    blogPosts = BLOG_POSTS;
  }

  const lines = [
    `# ${siteConfig.name}`,
    ``,
    `> ${siteConfig.description}`,
    ``,
    `## Thong tin`,
    ``,
    `- Website: ${siteConfig.url}`,
    `- Email: ${siteConfig.email}`,
    `- Dien thoai: ${siteConfig.phone}`,
    `- Dia chi: ${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.country}`,
    ``,
    `## Dich vu chinh`,
    ``,
    `- [Thiet ke Website](${siteConfig.url}/services#web-design): Thiet ke giao dien web dep, hien dai, responsive tren moi thiet bi`,
    `- [Phat trien Ung dung](${siteConfig.url}/services#app-dev): Xay dung ung dung web va mobile voi React, Next.js`,
    `- [SEO & GEO Optimization](${siteConfig.url}/services#seo): Tang hang Google va toi uu cho AI search engines`,
    `- [Digital Marketing](${siteConfig.url}/services#marketing): Chien dich quang cao Google Ads, Facebook Ads`,
    `- [E-commerce](${siteConfig.url}/services#ecommerce): Giai phap thuong mai dien tu toan dien`,
    `- [Ho tro & Bao tri](${siteConfig.url}/services#support): Ho tro ky thuat 24/7`,
    ``,
    `## Trang chinh`,
    ``,
    `- [Trang chu](${siteConfig.url}): Gioi thieu tong quan ve ${siteConfig.name}`,
    `- [Ve chung toi](${siteConfig.url}/about): Lich su, doi ngu va gia tri cot loi`,
    `- [Dich vu](${siteConfig.url}/services): Day du cac dich vu cung cap`,
    `- [Blog](${siteConfig.url}/blog): Kien thuc ve website, SEO, marketing`,
    `- [Lien he](${siteConfig.url}/contact): Lien he tu van mien phi`,
    ``,
    `## Bai viet moi nhat`,
    ``,
    ...blogPosts.slice(0, 6).map(
      (post) => `- [${post.title}](${siteConfig.url}/blog/${post.slug}): ${post.excerpt.slice(0, 100)}...`
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
