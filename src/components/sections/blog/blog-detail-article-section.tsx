"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { formatBlogDate, type BlogPost, type BlogSection } from "@/lib/blog-data";

/** Thin horizontal rule matching Figma Divider (opacity-5 on #1D1D1D) */
function Divider() {
  return <div className="h-px w-full bg-[#1D1D1D] opacity-5" />;
}

/** Desktop sticky Table of Contents sidebar (Figma node 13925:88202) */
function TocSidebar({ sections, activeId }: { sections: BlogSection[]; activeId: string }) {
  return (
    <aside className="bg-white rounded-xl shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] p-5 w-full flex flex-col max-h-[calc(100vh-130px)]">
      <p className="text-[16px] font-bold text-[#1D1D1D] tracking-[0.32px] mb-3 shrink-0">
        Table of contents
      </p>
      <Divider />
      {/* Scrollable list when TOC exceeds viewport height */}
      <div className="overflow-y-auto flex-1 min-h-0">
        {sections.map((s, i) => (
          <div key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block py-3 text-[12px] font-medium leading-[1.2] transition-colors ${
                activeId === s.id ? "text-[#3BBCB7]" : "text-[#828282] hover:text-[#3BBCB7]"
              }`}
            >
              {s.subtitle}
            </a>
            {i < sections.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </aside>
  );
}

/**
 * Mobile sticky bottom Table of Contents bar (Figma node 13925:87924).
 * Collapsed by default showing only the active subtitle; expand to see all.
 */
function MobileToc({ sections, activeId }: { sections: BlogSection[]; activeId: string }) {
  const [open, setOpen] = useState(false);
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)]">
      {/* Toggle button above panel */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="absolute -top-8 left-4 w-8 h-8 bg-white rounded-tl-lg rounded-tr-lg shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] flex items-center justify-center"
          aria-label="Collapse table of contents"
        >
          <ChevronUp className="w-4 h-4 text-[#1D1D1D]" />
        </button>
      )}

      {/* Header row — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 pt-3 pb-2 flex items-center justify-between cursor-pointer"
      >
        <p className="text-[16px] font-bold text-[#1D1D1D] tracking-[0.32px]">
          Table of contents
        </p>
        <ChevronUp
          className={`w-4 h-4 text-[#1D1D1D] transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>
      <Divider />

      {/* Expanded section list — max half screen height to prevent overflow on small devices */}
      {open ? (
        <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
          {sections.map((s, i) => (
            <div key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`block py-2 text-[14px] font-bold leading-[1.3] tracking-[0.14px] transition-colors ${
                  activeId === s.id ? "text-[#3BBCB7]" : "text-[#828282]"
                }`}
              >
                {s.subtitle}
              </a>
              {i < sections.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      ) : (
        <p className="px-4 pb-3 text-[14px] font-bold text-[#3BBCB7] tracking-[0.14px]">
          {active?.subtitle}
        </p>
      )}
    </div>
  );
}

interface Props {
  post: BlogPost;
}

/**
 * BlogDetailArticleSection — Two-column desktop layout (928px article + 456px sticky sidebar).
 * Mobile: single column with sticky bottom TOC bar.
 * Matches Figma nodes 13925:85942 (desktop) and 13925:86020 (mobile).
 */
export function BlogDetailArticleSection({ post }: Props) {
  const { sections } = post;
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  // Track which section is scrolled into view for TOC highlighting
  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      {/* pb-24 on mobile ensures last content isn't hidden behind the fixed bottom TOC bar */}
      <section className="w-full bg-white py-6 md:py-10 pb-24 lg:pb-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[100px]">
          {/* items-stretch (default) so sidebar wrapper is as tall as article, enabling sticky to work */}
          <div className="flex gap-4">
            {/* Article body */}
            <article className="flex-1 min-w-0 max-w-[928px] bg-white rounded-xl shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] p-5">
              {/* Date badge */}
              <div className="flex items-center gap-[3px] bg-[#F3F3F3] rounded-[8px] px-2 py-1 h-6 w-fit mb-4">
                <Calendar className="w-3 h-3 text-[#1D1D1D] shrink-0" />
                <span className="text-[10px] font-medium leading-[1.2] text-[#1D1D1D] overflow-hidden text-ellipsis">
                  {formatBlogDate(post.date)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-[24px] md:text-[32px] font-bold text-[#1D1D1D] leading-[1.2] tracking-[0.08px] mb-4">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-[14px] text-[#828282] leading-[1.5] tracking-[0.035px] mb-4">
                {post.excerpt}
              </p>

              <Divider />

              {/* Article sections */}
              {sections.map((section, i) => (
                <div key={section.id} id={section.id} className="mt-4 flex flex-col gap-4 scroll-mt-20">
                  <h2 className="text-[16px] md:text-[20px] font-bold text-[#1D1D1D] leading-[1.2] tracking-[0.05px]">
                    {section.subtitle}
                  </h2>
                  <div className="relative w-full h-[195px] md:h-[505px] rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={section.image}
                      alt={section.subtitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 888px"
                    />
                  </div>
                  {/* Render paragraphs as Markdown — works for both plain text and Markdown content */}
                  {section.paragraphs.map((para, j) => (
                    <div key={j} className="prose-blog">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{para}</ReactMarkdown>
                    </div>
                  ))}
                  {i < sections.length - 1 && <Divider />}
                </div>
              ))}
            </article>

            {/* Desktop sticky sidebar — hidden on mobile */}
            {sections.length > 0 && (
              <div className="hidden lg:block w-[456px] shrink-0">
                <div className="sticky top-[90px]">
                  <TocSidebar sections={sections} activeId={activeId} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile sticky bottom TOC */}
      {sections.length > 0 && (
        <MobileToc sections={sections} activeId={activeId} />
      )}
    </>
  );
}
