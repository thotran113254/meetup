import { getSetting } from "@/db/queries/settings-queries";
import { YoutubeGrid, type VideoItem } from "./youtube-grid";

const FALLBACK_VIDEOS: VideoItem[] = [
  { id: 1, label: "Our team", image: "/images/yt-our-team.jpg", stagger: "mt-0", mobileStagger: "mt-0" },
  { id: 2, label: "Travel guide", image: "/images/yt-travel-guide.jpg", stagger: "mt-5", mobileStagger: "mt-0" },
  { id: 3, label: "Internet\nvs. Local expert", image: "/images/yt-internet-vs-local.jpg", stagger: "mt-10", mobileStagger: "mt-5" },
  { id: 4, label: "Choice of expert", image: "/images/yt-choice-expert.jpg", stagger: "mt-5", mobileStagger: "mt-0" },
  { id: 5, label: "Travel essentials", image: "/images/yt-travel-essentials.jpg", stagger: "mt-0", mobileStagger: "mt-0" },
];

/**
 * YoutubeSection — server component.
 * Loads video thumbnails from CMS (siteSettings key "homepage_videos").
 * Falls back to FALLBACK_VIDEOS when DB unavailable or setting not set.
 */
export async function YoutubeSection() {
  let videos = FALLBACK_VIDEOS;
  try {
    const data = await getSetting<VideoItem[]>("homepage_videos");
    if (Array.isArray(data) && data.length > 0) videos = data;
  } catch {
    // DB unavailable — use fallback
  }
  return <YoutubeGrid videos={videos} />;
}
