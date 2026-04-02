/**
 * Sample blog post data - replace with CMS or MDX source in production.
 * Each post includes an image for the listing card.
 */
export const BLOG_POSTS = [
  {
    slug: "10-bi-quyet-tang-toc-website-nextjs",
    title: "10 bí quyết tăng tốc website Next.js lên điểm 100 Lighthouse",
    excerpt:
      "Khám phá các kỹ thuật tối ưu hoá hiệu suất website Next.js từ image optimization, code splitting đến caching strategy giúp đạt điểm Lighthouse hoàn hảo.",
    date: "2025-06-12",
    author: "Lê Văn Thành",
    category: "Phát triển",
    readTime: "8 phút đọc",
    image: "/images/destinations/halong.jpg",
  },
  {
    slug: "seo-cho-doanh-nghiep-viet-nam-2025",
    title: "Chiến lược SEO toàn diện cho doanh nghiệp Việt Nam năm 2025",
    excerpt:
      "Hướng dẫn chi tiết từ nghiên cứu từ khoá, tối ưu on-page, xây dựng backlink đến GEO optimization cho AI search engines như ChatGPT và Gemini.",
    date: "2025-05-20",
    author: "Phạm Thu Hà",
    category: "SEO",
    readTime: "12 phút đọc",
    image: "/images/destinations/hanoi.jpg",
  },
  {
    slug: "thiet-ke-ux-tang-ty-le-chuyen-doi",
    title: "Nguyên tắc thiết kế UX giúp tăng tỷ lệ chuyển đổi lên 200%",
    excerpt:
      "Phân tích các yếu tố UX quan trọng nhất ảnh hưởng đến hành vi người dùng và cách áp dụng chúng để tối ưu landing page, form đăng ký và trang thanh toán.",
    date: "2025-04-10",
    author: "Trần Phương Linh",
    category: "Thiết kế",
    readTime: "10 phút đọc",
    image: "/images/destinations/hochiminh.jpg",
  },
  {
    slug: "xu-huong-thiet-ke-web-2025",
    title: "Top 8 xu hướng thiết kế web nổi bật nhất năm 2025",
    excerpt:
      "Từ glassmorphism, dark mode, micro-interactions đến AI-generated design - những xu hướng nào đang dẫn đầu và phù hợp với doanh nghiệp Việt Nam?",
    date: "2025-03-28",
    author: "Trần Phương Linh",
    category: "Thiết kế",
    readTime: "7 phút đọc",
    image: "/images/tour-1-floating-market.png",
  },
  {
    slug: "react-server-components-huong-dan-thuc-te",
    title: "React Server Components: Hướng dẫn thực tế cho dự án thương mại điện tử",
    excerpt:
      "Khi nào nên dùng Server Components, khi nào cần Client Components? Bài viết giải thích rõ ràng với ví dụ thực tế từ dự án e-commerce 100k+ sản phẩm.",
    date: "2025-02-15",
    author: "Lê Văn Thành",
    category: "Phát triển",
    readTime: "15 phút đọc",
    image: "/images/tour-2-hoi-an.png",
  },
  {
    slug: "do-luong-roi-digital-marketing",
    title: "Cách đo lường ROI chính xác cho chiến dịch Digital Marketing",
    excerpt:
      "Hướng dẫn thiết lập hệ thống tracking, phân tích attribution model và xây dựng dashboard báo cáo giúp bạn hiểu rõ hiệu quả mỗi đồng tiền bỏ ra.",
    date: "2025-01-05",
    author: "Phạm Thu Hà",
    category: "Marketing",
    readTime: "9 phút đọc",
    image: "/images/tour-3-mekong.png",
  },
];

export type BlogPost = (typeof BLOG_POSTS)[number];

/** Format date to "JUN 12, 2025" style (Figma design) */
export function formatBlogDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();
}
