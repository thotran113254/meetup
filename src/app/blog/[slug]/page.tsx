import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata, buildArticleJsonLd } from "@/lib/seo-utils";
import { formatDate } from "@/lib/utils";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BLOG_POSTS } from "@/lib/blog-data";

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
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <article className="section-padding">
        <div className="container-narrow">
          {/* Article header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-4">
              <span className="rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] px-3 py-0.5 font-medium text-xs">
                {post.category}
              </span>
              <span>&middot;</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>&middot;</span>
              <span>{post.readTime}</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl leading-tight">
              {post.title}
            </h1>

            <p className="mt-4 text-lg text-[var(--color-muted-foreground)] leading-relaxed">
              {post.excerpt}
            </p>

            <div className="mt-6 flex items-center gap-3 pt-6 border-t border-[var(--color-border)]">
              <div className="h-10 w-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm">{post.author}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">Tac gia tai YourBrand</p>
              </div>
            </div>
          </header>

          {/* Image placeholder */}
          <div className="aspect-video rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)]/20 mb-10 flex items-center justify-center">
            <span className="text-[var(--color-primary)]/30 text-6xl font-black">{post.category.charAt(0)}</span>
          </div>

          {/* Article body */}
          <div className="prose prose-slate max-w-none text-[var(--color-foreground)]">
            <p className="text-lg leading-relaxed text-[var(--color-muted-foreground)]">
              {post.excerpt} Day la noi dung chi tiet cua bai viet. Trong thuc te, noi dung se duoc lay tu CMS hoac file markdown.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Gioi thieu</h2>
            <p className="leading-relaxed text-[var(--color-muted-foreground)]">
              Trong bai viet nay, chung ta se di sau vao tung khai niem, phan tich cac truong hop thuc te va dua ra nhung khuyen nghi cu the de ban ap dung ngay vao du an cua minh.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Noi dung chinh</h2>
            <p className="leading-relaxed text-[var(--color-muted-foreground)]">
              Lorem ipsum dolor sit amet, day la placeholder cho noi dung chinh cua bai viet. Trong moi truong san xuat, noi dung nay se duoc lap day tu he thong quan tri noi dung hoac file markdown duoc xu ly boi thu vien nhu gray-matter va next-mdx-remote.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Ket luan</h2>
            <p className="leading-relaxed text-[var(--color-muted-foreground)]">
              Hy vong bai viet da mang lai nhung thong tin huu ich cho ban. Neu co cau hoi, hay de lai binh luan hoac lien he voi chung toi truc tiep.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
