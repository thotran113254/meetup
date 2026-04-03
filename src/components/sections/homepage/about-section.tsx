import { getSetting } from "@/db/queries/settings-queries";
import type { AboutData } from "@/lib/types/homepage-cms-types";
import { AboutSectionContent } from "./about-section-content";

/** Fallback data — exact replica of original hardcoded values */
const FALLBACK_ABOUT: AboutData = {
  title: "About us",
  quote:
    "Friendship, integrity and a spirit of self-improvement forge the strength of an organization that continues to grow.",
  mobilePhotos: [
    { src: "/images/about-clothesline-1.png", alt: "Team in office", deg: 23, left: "5%", top: "36%", stringH: 15 },
    { src: "/images/about-clothesline-3.png", alt: "Team with flag", deg: 15, left: "28%", top: "38%", stringH: 22, wide: true },
    { src: "/images/about-clothesline-5.png", alt: "Team at flower garden", deg: 0, left: "55%", top: "40%", stringH: 30 },
    { src: "/images/about-clothesline-2.png", alt: "Team at viewpoint", deg: -10, left: "80%", top: "38%", stringH: 18 },
  ],
  desktopImage: "/images/about-us.png",
  teamImage: "/images/about-team-photo.png",
  dragonImage: "/images/about-dragon.png",
  templeImage: "/images/about-temple.png",
  cloudImage: "/images/about-cloud.png",
};

/**
 * AboutSection — Server component that loads about data from CMS.
 * Falls back to FALLBACK_ABOUT when DB is unavailable or setting not set.
 */
export async function AboutSection() {
  let data = FALLBACK_ABOUT;
  try {
    const cms = await getSetting<AboutData>("homepage_about");
    if (cms) data = { ...FALLBACK_ABOUT, ...cms };
  } catch {
    // DB unavailable — use fallback
  }
  return <AboutSectionContent data={data} />;
}
