"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export type VideoItem = {
  id: number;
  label: string;
  image: string;
  url?: string;
  /** Tailwind mt-* class for desktop wave stagger */
  stagger?: string;
  mobileStagger?: string;
};

type Props = { videos: VideoItem[] };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function VideoCard({ image, label, url }: { image: string; label: string; url?: string }) {
  const inner = (
    <motion.div
      className="relative rounded-xl overflow-hidden aspect-[270/478] cursor-pointer group"
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Image src={image} alt={label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 768px) 18vw, 270px" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[60%] to-black" />
      <div className="absolute inset-x-0 bottom-0 p-3 lg:p-5 flex items-center justify-center">
        <p className="text-white text-base md:text-lg lg:text-xl font-bold leading-tight text-center whitespace-pre-line">
          {label}
        </p>
      </div>
    </motion.div>
  );
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer">{inner}</a>;
  return inner;
}

/**
 * YoutubeGrid — client component: staggered video grid + mobile horizontal scroll.
 * Receives video data as props from the server wrapper (youtube-section.tsx).
 */
export function YoutubeGrid({ videos }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || window.innerWidth >= 768) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const middleCard = el.children[Math.floor(videos.length / 2)] as HTMLElement | undefined;
        if (!middleCard) return;
        el.scrollLeft = middleCard.offsetLeft + middleCard.offsetWidth / 2 - el.clientWidth / 2;
      });
    });
  }, [videos.length]);

  return (
    <section className="section-padding bg-white">
      <motion.div
        className="flex items-center justify-center gap-3 mb-6 md:mb-8 lg:mb-10 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-xl md:text-2xl lg:text-[32px] font-bold leading-tight text-[var(--color-foreground)]">
          Our channel
        </h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/youtube-logo.svg" alt="YouTube" className="size-8 md:size-10 lg:size-12 object-contain" />
      </motion.div>

      <div className="container-wide">
        {/* Desktop: staggered grid */}
        <motion.div
          className="hidden md:grid grid-cols-5 gap-4 mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {videos.map((video) => (
            <motion.div key={video.id} className={video.stagger ?? "mt-0"} variants={cardVariants}>
              <VideoCard image={video.image} label={video.label} url={video.url} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile: horizontal scroll, centered on middle card */}
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-4 md:hidden items-start scrollbar-hide snap-x snap-mandatory">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              className={`shrink-0 w-[270px] snap-center ${video.mobileStagger ?? "mt-0"}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <VideoCard image={video.image} label={video.label} url={video.url} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
