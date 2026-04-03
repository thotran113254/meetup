import type { TourCardProps } from "@/components/ui/tour-card";
import { getSetting } from "@/db/queries/settings-queries";
import { TourPackageCarousel } from "./tour-package-carousel";

/** Fallback data shown when CMS has no homepage_tours setting */
const FALLBACK_TOURS: TourCardProps[] = [
  {
    image: "/images/tour-1-floating-market.png",
    title: "Cu Chi Tunnels and Mekong Delta Full Day Tour Starting from Ho Chi Minh",
    price: 669,
    duration: "4D3N",
    spots: 3,
    tags: ["Adventure", "Solo"],
    slug: "cu-chi-tunnels",
  },
  {
    image: "/images/tour-2-hoi-an.png",
    title: "Hoi An Ancient Town & My Son Sanctuary Private Day Tour",
    price: 549,
    duration: "1D",
    spots: 5,
    tags: ["Culture", "Group"],
    slug: "hoi-an-my-son",
  },
  {
    image: "/images/tour-3-mekong.png",
    title: "Mekong Delta Ben Tre Floating Market Day Tour from HCMC",
    price: 389,
    duration: "1D",
    spots: 8,
    tags: ["Adventure", "Group"],
    slug: "mekong-delta-ben-tre",
  },
  {
    image: "/images/tour-4-palm-trees.png",
    title: "Phu Quoc Island 4-Day Private Escape — Beaches & Snorkeling",
    price: 899,
    duration: "4D3N",
    spots: 2,
    tags: ["Beach", "Solo"],
    slug: "phu-quoc-island",
  },
];

/**
 * TourPackageSection — server component.
 * Loads tour data from CMS (siteSettings key "homepage_tours").
 * Falls back to FALLBACK_TOURS when DB is unavailable or setting not set.
 */
export async function TourPackageSection() {
  let tours = FALLBACK_TOURS;
  try {
    const data = await getSetting<TourCardProps[]>("homepage_tours");
    if (Array.isArray(data) && data.length > 0) tours = data;
  } catch {
    // DB unavailable — use fallback
  }
  return <TourPackageCarousel tours={tours} />;
}
