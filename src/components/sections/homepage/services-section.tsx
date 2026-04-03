import { getSetting } from "@/db/queries/settings-queries";
import { ServicesCarousel, type ServiceItem } from "./services-carousel";

const FALLBACK_SERVICES: ServiceItem[] = [
  { id: 1, name: "Fast track service", price: "$30", image: "/images/service-fast-track.png", slug: "fast-track" },
  { id: 2, name: "eVisa service", price: "$25", image: "/images/service-evisa.png", slug: "evisa" },
  { id: 3, name: "Airport Pickup service", price: "$20", image: "/images/service-airport-pickup.png", slug: "airport-pickup" },
  { id: 4, name: "eSim service", price: "$15", image: "/images/service-esim.png", slug: "esim" },
];

/**
 * ServicesSection — server component.
 * Loads services from CMS (siteSettings key "homepage_services").
 * Falls back to FALLBACK_SERVICES when DB unavailable or setting not set.
 */
export async function ServicesSection() {
  let services = FALLBACK_SERVICES;
  try {
    const data = await getSetting<ServiceItem[]>("homepage_services");
    if (Array.isArray(data) && data.length > 0) services = data;
  } catch {
    // DB unavailable — use fallback
  }
  return <ServicesCarousel services={services} />;
}
