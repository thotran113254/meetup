/**
 * Sample blog post data - replace with CMS or MDX source in production.
 */
export const BLOG_POSTS = [
  {
    slug: "10-bi-quyet-tang-toc-website-nextjs",
    title: "10 bi quyet tang toc website Next.js len diem 100 Lighthouse",
    excerpt: "Kham pha cac ky thuat toi uu hoa hieu suat website Next.js tu image optimization, code splitting den caching strategy giup dat diem Lighthouse hoan hao.",
    date: "2025-03-01",
    author: "Le Van Thanh",
    category: "Phat trien",
    readTime: "8 phut doc",
  },
  {
    slug: "seo-cho-doanh-nghiep-viet-nam-2025",
    title: "Chien luoc SEO toan dien cho doanh nghiep Viet Nam nam 2025",
    excerpt: "Huong dan chi tiet tu nghien cuu tu khoa, toi uu on-page, xay dung backlink den GEO optimization cho AI search engines nhu ChatGPT va Gemini.",
    date: "2025-02-20",
    author: "Pham Thu Ha",
    category: "SEO",
    readTime: "12 phut doc",
  },
  {
    slug: "thiet-ke-ux-tang-ty-le-chuyen-doi",
    title: "Nguyen tac thiet ke UX giup tang ty le chuyen doi len 200%",
    excerpt: "Phan tich cac yeu to UX quan trong nhat anh huong den hanh vi nguoi dung va cach ap dung chung de toi uu landing page, form dang ky va trang thanh toan.",
    date: "2025-02-10",
    author: "Tran Phuong Linh",
    category: "Thiet ke",
    readTime: "10 phut doc",
  },
  {
    slug: "xu-huong-thiet-ke-web-2025",
    title: "Top 8 xu huong thiet ke web noi bat nhat nam 2025",
    excerpt: "Tu glassmorphism, dark mode, micro-interactions den AI-generated design - nhung xu huong nao dang dan dau va phu hop voi doanh nghiep Viet Nam?",
    date: "2025-01-28",
    author: "Tran Phuong Linh",
    category: "Thiet ke",
    readTime: "7 phut doc",
  },
  {
    slug: "react-server-components-huong-dan-thuc-te",
    title: "React Server Components: Huong dan thuc te cho du an thuong mai dien tu",
    excerpt: "Khi nao nen dung Server Components, khi nao can Client Components? Bai viet giai thich ro rang voi vi du thuc te tu du an e-commerce 100k+ san pham.",
    date: "2025-01-15",
    author: "Le Van Thanh",
    category: "Phat trien",
    readTime: "15 phut doc",
  },
  {
    slug: "do-luong-roi-digital-marketing",
    title: "Cach do luong ROI chinh xac cho chien dich Digital Marketing",
    excerpt: "Huong dan thiet lap he thong tracking, phan tich attribution model va xay dung dashboard bao cao giup ban hieu ro hieu qua moi dong tien bo ra.",
    date: "2025-01-05",
    author: "Pham Thu Ha",
    category: "Marketing",
    readTime: "9 phut doc",
  },
];

export type BlogPost = (typeof BLOG_POSTS)[number];
