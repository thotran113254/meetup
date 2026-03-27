/**
 * YoutubeSection — "Our channel" video thumbnail grid.
 * 5 vertical video cards in a row, middle card has YouTube play button overlay.
 * Server component — static data, no interactivity.
 */

import Image from "next/image";
import { Play } from "lucide-react";

type VideoCard = {
  id: number;
  label: string;
  image: string;
  hasPlayButton: boolean;
};

const VIDEOS: VideoCard[] = [
  { id: 1, label: "Our team", image: "/images/yt-our-team.png", hasPlayButton: false },
  { id: 2, label: "Travel guide", image: "/images/yt-travel-guide.png", hasPlayButton: false },
  { id: 3, label: "Internet vs. Local expert", image: "/images/yt-internet-vs-local.png", hasPlayButton: true },
  { id: 4, label: "Choice of expert", image: "/images/yt-choice-expert.png", hasPlayButton: false },
  { id: 5, label: "Travel essentials", image: "/images/yt-travel-essentials.png", hasPlayButton: false },
];

export function YoutubeSection() {
  return (
    <section className="py-10 md:py-14 bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Centered heading with YouTube icon */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
            Our channel
          </h2>
          {/* YouTube play icon in red */}
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white"
            aria-label="YouTube"
          >
            <Play className="w-4 h-4 fill-white" />
          </span>
        </div>

        {/* Video grid — 5 columns desktop, scrollable on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {VIDEOS.map((video) => (
            <div
              key={video.id}
              className="flex-shrink-0 relative rounded-xl overflow-hidden cursor-pointer group"
              style={{ width: "180px", height: "300px" }}
            >
              {/* Thumbnail image */}
              <Image
                src={video.image}
                alt={video.label}
                fill
                className="object-cover"
                sizes="180px"
              />

              {/* Dark gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* YouTube play button overlay for middle card */}
              {video.hasPlayButton && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 fill-white text-white" />
                  </div>
                </div>
              )}

              {/* Label at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-semibold text-center leading-tight">
                  {video.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
