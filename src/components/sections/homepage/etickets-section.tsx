import { getSetting } from "@/db/queries/settings-queries";
import type { EticketsData } from "@/lib/types/homepage-cms-types";
import { EticketsSectionContent } from "./etickets-section-content";

/** Fallback data — exact replica of original hardcoded values */
const FALLBACK: EticketsData = {
  title: "e-Tickets",
  cities: [
    { value: "hanoi", label: "Hanoi (HAN)" },
    { value: "hochiminh", label: "Ho Chi Minh City (SGN)" },
    { value: "danang", label: "Da Nang (DAD)" },
    { value: "nhatrang", label: "Nha Trang (CXR)" },
    { value: "phuquoc", label: "Phu Quoc (PQC)" },
    { value: "hue", label: "Hue (HUI)" },
    { value: "dalat", label: "Da Lat (DLI)" },
    { value: "bangkok", label: "Bangkok (BKK)" },
    { value: "singapore", label: "Singapore (SIN)" },
    { value: "tokyo", label: "Tokyo (NRT)" },
    { value: "seoul", label: "Seoul (ICN)" },
  ],
  passengers: [
    { value: "1-economy", label: "1 passenger, Economy" },
    { value: "2-economy", label: "2 passengers, Economy" },
    { value: "3-economy", label: "3 passengers, Economy" },
    { value: "1-premium", label: "1 passenger, Premium Economy" },
    { value: "2-premium", label: "2 passengers, Premium Economy" },
    { value: "1-business", label: "1 passenger, Business" },
    { value: "2-business", label: "2 passengers, Business" },
  ],
};

/**
 * EticketsSection — Server component that loads eTickets config from CMS.
 * Falls back to FALLBACK when DB is unavailable or setting not set.
 */
export async function EticketsSection() {
  let data = FALLBACK;
  try {
    const cms = await getSetting<EticketsData>("homepage_etickets");
    if (cms) data = { ...FALLBACK, ...cms };
  } catch {
    // DB unavailable — use fallback
  }
  return <EticketsSectionContent title={data.title} cities={data.cities} passengers={data.passengers} />;
}
