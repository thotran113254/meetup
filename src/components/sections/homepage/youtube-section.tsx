"use client";

/**
 * YoutubeSection — "Our channel" video thumbnail grid.
 * Figma node 13284:1721 (desktop), 13334:50635 (mobile).
 * Desktop: 5-col grid with stagger curve + scroll-triggered animations.
 * Mobile: horizontal scroll, pre-scrolled to center the middle card.
 */

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

/** Videos data with stagger offsets for wave pattern */
const VIDEOS = [
  { id: 1, label: "Our team", image: "/images/yt-our-team.jpg", stagger: "mt-0", mobileStagger: "mt-0" },
  { id: 2, label: "Travel guide", image: "/images/yt-travel-guide.jpg", stagger: "mt-5", mobileStagger: "mt-0" },
  { id: 3, label: "Internet\nvs. Local expert", image: "/images/yt-internet-vs-local.jpg", stagger: "mt-10", mobileStagger: "mt-5" },
  { id: 4, label: "Choice of expert", image: "/images/yt-choice-expert.jpg", stagger: "mt-5", mobileStagger: "mt-0" },
  { id: 5, label: "Travel essentials", image: "/images/yt-travel-essentials.jpg", stagger: "mt-0", mobileStagger: "mt-0" },
] as const;

/** Stagger children animation */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function YoutubeSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* On mount: scroll to center the middle card (index 2) on mobile */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || window.innerWidth >= 768) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const middleCard = el.children[2] as HTMLElement | undefined;
        if (!middleCard) return;
        const cardCenter = middleCard.offsetLeft + middleCard.offsetWidth / 2;
        const containerCenter = el.clientWidth / 2;
        el.scrollLeft = cardCenter - containerCenter;
      });
    });
  }, []);

  return (
    <section className="section-padding bg-white">
      {/* Title — centered, YouTube icon visible on all sizes */}
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
        <img
          src="/images/youtube-logo.svg"
          alt="YouTube"
          width={48}
          height={48}
          className="size-8 md:size-10 lg:size-12 object-contain"
        />
      </motion.div>

      <div className="container-wide">
        {/* Desktop: 5-col staggered grid with scroll-triggered animation */}
        <motion.div
          className="hidden md:grid grid-cols-5 gap-4 mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {VIDEOS.map((video) => (
            <motion.div key={video.id} className={video.stagger} variants={cardVariants}>
              <VideoCard image={video.image} label={video.label} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile: horizontal scroll, centered on middle card */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4 md:hidden items-start scrollbar-hide snap-x snap-mandatory"
        >
          {VIDEOS.map((video, i) => (
            <motion.div
              key={video.id}
              className={`shrink-0 w-[270px] snap-center ${video.mobileStagger}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <VideoCard image={video.image} label={video.label} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Single video thumbnail card — aspect 270:478, gradient overlay + label, hover lift */
function VideoCard({ image, label }: { image: string; label: string }) {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden aspect-[270/478] cursor-pointer group"
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(min-width: 768px) 18vw, 270px"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[60%] to-black" />
      <div className="absolute inset-x-0 bottom-0 p-3 lg:p-5 flex items-center justify-center">
        <p className="text-white text-base md:text-lg lg:text-xl font-bold leading-tight text-center whitespace-pre-line">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
