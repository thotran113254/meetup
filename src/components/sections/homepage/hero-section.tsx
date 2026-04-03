import { getActiveSlides } from "@/db/queries/slide-queries";
import { HeroSlideshow } from "./hero-slideshow";

/**
 * HeroSection — Server component that loads active slides from CMS.
 * Falls back to static banner (via HeroSlideshow) when DB is unavailable or empty.
 */
export async function HeroSection() {
  let slides: Awaited<ReturnType<typeof getActiveSlides>> = [];
  try {
    slides = await getActiveSlides();
  } catch {
    // DB unavailable — HeroSlideshow renders the static fallback banner
  }
  return <HeroSlideshow slides={slides} />;
}
