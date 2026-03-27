/**
 * YoutubeSection — "Our channel" video thumbnail grid.
 * Figma node 13284:1721.
 * 5 vertical cards (270x478px) with staggered y-offsets forming a smiley curve:
 *   edges (cards 1 & 5) sit highest (mt=28px), center (card 3) sits lowest (mt=68px).
 * Center card has YouTube red play button overlay.
 * Server component — static data, no interactivity.
 */

import Image from "next/image";
import { Play } from "lucide-react";

type VideoCard = {
  id: number;
  label: string;
  image: string;
  hasPlayButton: boolean;
  /** Staggered top margin — smiley curve: 28, 48, 68, 48, 28 */
  marginTop: number;
};

const VIDEOS: VideoCard[] = [
  { id: 1, label: "Our team",                  image: "/images/yt-our-team.png",         hasPlayButton: false, marginTop: 28 },
  { id: 2, label: "Travel guide",              image: "/images/yt-travel-guide.png",      hasPlayButton: false, marginTop: 48 },
  { id: 3, label: "Internet vs. Local expert", image: "/images/yt-internet-vs-local.png", hasPlayButton: true,  marginTop: 68 },
  { id: 4, label: "Choice of expert",          image: "/images/yt-choice-expert.png",     hasPlayButton: false, marginTop: 48 },
  { id: 5, label: "Travel essentials",         image: "/images/yt-travel-essentials.png", hasPlayButton: false, marginTop: 28 },
];

export function YoutubeSection() {
  return (
    <section className="py-[50px] bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Centered heading with YouTube red play icon to the right */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
            Our channel
          </h2>
          <span
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white flex-none shadow-md"
            aria-label="YouTube"
          >
            <Play className="w-5 h-5 fill-white" />
          </span>
        </div>

        {/* Video card row — horizontally scrollable on small screens */}
        <div
          className="flex justify-start sm:justify-center gap-3 sm:gap-4 overflow-x-auto pb-2 px-4 sm:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {VIDEOS.map((video) => (
            <div
              key={video.id}
              className="flex-shrink-0 flex flex-col items-center"
              style={{ marginTop: `${video.marginTop}px` }}
            >
              {/* Card */}
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{ width: "clamp(200px, 50vw, 270px)", height: "clamp(350px, 70vw, 478px)" }}
              >
                {/* Thumbnail — falls back to teal placeholder if image missing */}
                <Image
                  src={video.image}
                  alt={video.label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="270px"
                />

                {/* Dark gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* YouTube red play button — center card only */}
                {video.hasPlayButton && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="rounded-full bg-red-600 flex items-center justify-center shadow-lg"
                      style={{ width: "56px", height: "56px" }}
                    >
                      <Play className="w-7 h-7 fill-white text-white" />
                    </div>
                  </div>
                )}

                {/* Label bar at card bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2.5">
                  <p className="text-white text-sm font-semibold text-center leading-tight">
                    {video.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
